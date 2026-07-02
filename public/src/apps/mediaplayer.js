/* global $, lang */
// Win12 app — Media Player.
//
// Extracted from the apps.js monolith onto the kernel. Uses the browser-safe
// queue/URL helpers in window.MediaPlayerCore (mediaplayer-core.js) and drives
// its window through the win12.windows facade. Behaviour is identical to the
// previous inline version — the mediaplayer unit + e2e tests guard it.
// Loaded AFTER apps.js so the registration is not clobbered.
(function (global) {
  var mediaplayer = {
    queue: [],
    currentIndex: -1,
    activeItem: null,
    _bound: false,
    init() {
      if (!this._bound) {
        this.bindEvents();
        this._bound = true;
      }
      // Real file player: nothing is queued until the user opens a file
      // (via "Open file" or File Explorer). open() fills the queue before
      // openapp(), so only fall back to the empty state when it is untouched.
      if (!this.queue.length) {
        this.showEmptyState();
      }
    },
    showEmptyState() {
      this.currentIndex = -1;
      this.activeItem = null;
      $('#mediaplayer-video, #mediaplayer-audio').hide();
      $('#mediaplayer-artwork').show();
      $('#mediaplayer-now-title').text(lang('Open a file to start playing', 'mediaplayer.empty'));
      $('#mediaplayer-now-artist').text('');
      $('#mediaplayer-library').empty();
      $('#mediaplayer-progress').val(0);
      this._setPlayLabel(false);
      this._showError('');
    },
    media() {
      return this.activeItem && this.activeItem.type === 'video'
        ? $('#mediaplayer-video')[0]
        : $('#mediaplayer-audio')[0];
    },
    previous() { this.select(this.currentIndex - 1); },
    next() { this.select(this.currentIndex + 1); },
    toggle() {
      const media = this.media();
      if (media && media.getAttribute('src')) {
        if (media.paused) media.play().catch(() => {});
        else media.pause();
      }
    },
    pickFile() { $('#mediaplayer-file-input').val('').trigger('click'); },
    handleFile(file) {
      if (!file) return;
      const type = file.type.startsWith('video/') ? 'video'
        : file.type.startsWith('audio/') ? 'audio' : '';
      if (!type) {
        this._showError(lang('This file cannot be played.', 'mediaplayer.unsupported'));
        return;
      }
      this.open(URL.createObjectURL(file), file.name, type, true);
    },
    open(url, name, type, ownedUrl = false) {
      const item = ownedUrl
        ? window.MediaPlayerCore.createLocalItem(url, name, type)
        : { id: 'file:' + url, title: name, artist: lang('Local file', 'mediaplayer.local-file'), source: url, type, ownedUrl: false, artwork: '' };
      // Set the queue before openapp() so init() leaves it intact.
      this.queue = [item];
      this.currentIndex = 0;
      this.activeItem = null;
      global.win12.windows.open('mediaplayer');
      this.select(0);
    },
    select(index, autoplay = true) {
      const next = window.MediaPlayerCore.clampQueueIndex(index, this.queue.length);
      if (next < 0) return;
      // releaseOwnedUrl handled in stop()/close(); stop tears down the media element.
      this.stop();
      this.currentIndex = next;
      this.activeItem = this.queue[next];
      this.render();
      if (!this.activeItem.source) {
        this._showError(lang('This file cannot be played.', 'mediaplayer.unsupported'));
        return;
      }
      const media = this.media();
      media.src = this.activeItem.source;
      media.load();
      if (autoplay) media.play().catch(() => {});
    },
    render() {
      const item = this.activeItem;
      const isVideo = item.type === 'video';
      $('#mediaplayer-now-title').text(item.title);
      $('#mediaplayer-now-artist').text(item.artist);
      $('#mediaplayer-video').toggle(isVideo);
      $('#mediaplayer-audio').hide();
      $('#mediaplayer-artwork').toggle(!isVideo);
      $('.window.mediaplayer>.titbar>p').text(item.title || lang('媒体播放器', 'mediaplayer.name'));
      $('.window.mediaplayer>.titbar>img').attr('src', isVideo ? 'assets/icons/files/vidio.png' : 'assets/icons/files/music.png');
      const library = $('#mediaplayer-library').empty();
      this.queue.forEach((track, index) => {
        $('<button>', {
          type: 'button',
          'data-track-id': track.id,
          text: track.title,
          'aria-current': index === this.currentIndex ? 'true' : 'false'
        }).on('click', () => this.select(index)).appendTo(library);
      });
    },
    stop() {
      $('#mediaplayer-video, #mediaplayer-audio').each((_, element) => {
        element.pause();
        element.removeAttribute('src');
        element.load();
      });
      $('#mediaplayer-progress').val(0);
      this._setPlayLabel(false);
      this._showError('');
    },
    bindEvents() {
      const self = this;
      $('#mediaplayer-file-input').off('change.mp').on('change.mp', function () {
        self.handleFile(this.files && this.files[0]);
      });
      $('#mediaplayer-open-file').off('click.mp').on('click.mp', () => self.pickFile());
      $('#mediaplayer-previous').off('click.mp').on('click.mp', () => self.previous());
      $('#mediaplayer-play').off('click.mp').on('click.mp', () => self.toggle());
      $('#mediaplayer-next').off('click.mp').on('click.mp', () => self.next());
      $('#mediaplayer-progress').off('input.mp').on('input.mp', function () {
        const media = self.media();
        if (media && media.duration) media.currentTime = (this.value / 100) * media.duration;
      });
      $('#mediaplayer-volume').off('input.mp').on('input.mp', function () {
        const media = self.media();
        if (media) media.volume = Number(this.value);
      });
      $('#mediaplayer-video, #mediaplayer-audio')
        .off('.mp')
        .on('loadedmetadata.mp', function () {
          if (this === self.media()) $('#mediaplayer-progress').val(0);
        })
        .on('timeupdate.mp', function () {
          if (this !== self.media() || !this.duration) return;
          $('#mediaplayer-progress').val((this.currentTime / this.duration) * 100);
        })
        .on('play.mp', function () {
          if (this === self.media()) self._setPlayLabel(true);
        })
        .on('pause.mp', function () {
          if (this === self.media()) self._setPlayLabel(false);
        })
        .on('ended.mp', function () {
          if (this === self.media()) self.next();
        })
        .on('error.mp', function () {
          if (this !== self.media() || !self.activeItem || !self.activeItem.source) return;
          self._showError(lang('This file cannot be played.', 'mediaplayer.unsupported'));
          self._setPlayLabel(false);
        });
    },
    _setPlayLabel(playing) {
      $('#mediaplayer-play').text(playing ? '⏸' : '▶');
    },
    _showError(message) {
      $('#mediaplayer-error').text(message).toggleClass('show', !!message);
    },
    close() {
      this.stop();
      if (this.activeItem) window.MediaPlayerCore.releaseOwnedUrl(this.activeItem);
      this.activeItem = null;
      this.queue = [];
      this.currentIndex = -1;
      global.win12.windows.hide('mediaplayer');
    }
  };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('mediaplayer', mediaplayer);
  } else {
    (global.apps = global.apps || {}).mediaplayer = mediaplayer;
  }
})(typeof window !== 'undefined' ? window : globalThis);
