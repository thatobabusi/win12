// Lunar calendar implementation By @stxttkx
// Improved by lingbopro

let lunarCache = null;
let lunarCachePromise = null;
async function getLunar() {
    let lunarDisplay = document.getElementById('lunar');

    // Cache validation
    if (lunarCache?.data?.AD) {
        const now = new Date();
        const nowAD = new RegExp(`${now.getFullYear()}年0?${now.getMonth() + 1}月0?${now.getDate()}日`, 'g');
        if (!lunarCache.data.AD.match(nowAD)) {
            lunarCache = null;
        }
    }

    // If there is no cache and no ongoing request, initiate a new request
    if (!lunarCache && !lunarCachePromise) {
        lunarCachePromise = (async () => {
            try {
                const response = await fetch('https://api.xcboke.cn/api/calendar');
                if (!response.ok) {
                    // How did you come up with printing this kind of thing to the dev console...
                    // throw new Error('Network is unreliable');
                    throw new Error('HTTP status code does not meet expectations: ' + response.status);
                }
                const jsonContent = await response.json();
                // The new API doesn't have this code parameter at all...
                // if (jsonContent.code !== 1) {
                //    throw new Error(`Server exception, error code: ${jsonContent.code}`);
                // }
                if (typeof jsonContent?.['lunar'] !== 'string') {
                    throw new Error('Server returned data format anomaly');
                }
                lunarCache = jsonContent;
                return lunarCache;
            } catch (error) {
                lunarDisplay.textContent = '';
                console.error('Failed to get lunar information:', error);
                throw error;
            } finally {
                // After the request ends, clear the ongoing Promise marker regardless of success or failure
                lunarCachePromise = null;
            }
        })();
    }
    // If there is an ongoing request but no cache yet, wait for the request to complete
    if (!lunarCache && lunarCachePromise) {
        await lunarCachePromise;
    }

    if (lunarCache?.['lunar']) {
        const lunarContent = lunarCache['lunar'];
        lunarDisplay.textContent = lunarContent;
    }
}
