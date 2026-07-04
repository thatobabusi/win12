// Win12 app — search. Extracted from apps.js onto the kernel.
// Globals ($, lang, openapp, shownotice, etc.) and cross-app calls resolve
// at call time via the shared global scope, so this loads AFTER apps.js.
(function (global) {
  var search = {
        rand: [{ name: 'Bottle Cap Introduction.txt', bi: 'text', ty: 'Text Document' },
        { name: 'Bottle Cap Diagram.png', bi: 'image', ty: 'PNG File' },
        { name: 'Bottle Cap Structure.docx', bi: 'richtext', ty: 'Microsoft Word 文档' },
        { name: 'Coca Cola Bottle Cap.jpg', bi: 'image', ty: 'JPG File' },
        { name: 'Coca Cola Cap History.pptx', bi: 'slides', ty: 'Microsoft PowerPoint Presentation' },
        { name: 'Bottle Cap Quality Analysis.xlsx', bi: 'ruled', ty: 'Microsoft Excel Worksheet' },
        { name: 'Bottle Cap.svg', bi: 'image', ty: 'SVG File' },
        { name: 'Bottle Cap Intro.doc', bi: 'richtext', ty: 'Microsoft Word 文档' }],
        search: le => {
            if (le > 0) {
                $('#search-win>.ans>.list>list').html(
                    `<a class="a" onclick="apps.search.showdetail(${le % 8})"><i class="bi bi-file-earmark-${apps.search.rand[le % 8].bi}"></i> ${apps.search.rand[le % 8].name
                    }</a><a class="a" onclick="apps.search.showdetail(${(le + 3) % 8})"><i class="bi bi-file-earmark-${apps.search.rand[(le + 3) % 8].bi}"></i> ${apps.search.rand[(le + 3) % 8].name}</a>`);
                apps.search.showdetail(le % 8);
            } else {
                $('#search-win>.ans>.list>list').html(
                    `<p class="text">Recommended</p>
					<a onclick="openapp('setting');$('#search-btn').removeClass('show');
					$('#search-win').removeClass('show');
					setTimeout(() => {
						$('#search-win').removeClass('show-begin');
					}, 200);">
						<img src="assets/icons/setting.svg"><p>设置</p></a>
					<a onclick="openapp('about');$('#search-btn').removeClass('show');
					$('#search-win').removeClass('show');
					setTimeout(() => {
						$('#search-win').removeClass('show-begin');
					}, 200);">
						<img src="assets/icons/about.svg"><p>${getAboutAppTitle()}</p></a>`);
                $('#search-win>.ans>.view').removeClass('show');
            }
        },
        showdetail: i => {
            $('#search-win>.ans>.view').addClass('show');
            let inf = apps.search.rand[i];
            $('#search-win>.ans>.view>.fname>.bi').attr('class', 'bi bi-file-earmark-' + inf.bi);
            $('#search-win>.ans>.view>.fname>.name').text(inf.name);
            $('#search-win>.ans>.view>.fname>.type').text(inf.ty);
        }
    };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('search', search);
  } else {
    (global.apps = global.apps || {}).search = search;
  }
})(typeof window !== 'undefined' ? window : globalThis);
