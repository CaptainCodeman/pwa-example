import 'mega-material/icon-button'
import 'mega-material/snackbar'
import 'mega-material/button'

const isIOS = !!window.navigator.userAgent && /iPad|iPhone|iPod/.test(window.navigator.userAgent)

function hexString(buffer: ArrayBuffer) {
    const byteArray = new Uint8Array(buffer);

    const hexCodes = [...byteArray].map(value => {
        const hexCode = value.toString(16);
        const paddedHexCode = hexCode.padStart(2, '0');
        return paddedHexCode;
    });

    return hexCodes.join('');
}

async function generateHash(text: string) {
    const encoder = new TextEncoder()
    const buff = encoder.encode(text)
    const digest = await window.crypto.subtle.digest('SHA-1', buff)
    return hexString(digest)
}

async function getAppVersion() {
    // cachebust service worker
    const url = `/sw.js?c=${Date.now()}`
    const headers = { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    const resp = await fetch(url, { headers })
    const text = await resp.text()
    const hash = await generateHash(text)
    return hash
}

async function checkForUpdate() {
    if (isIOS && window.navigator.standalone === true) {
        const current = window.localStorage.getItem('version')
        const latest = await getAppVersion()
        if (latest !== current) {
            window.localStorage.setItem('version', latest)
            window.location.reload()
        }
    } else {
        window.dispatchEvent(new CustomEvent('sw-update'))
    }
}

if (document.hidden !== undefined) {
    function visibilityChange() {
        document.title = document.hidden ? 'hidden' : 'active'

        if (!document.hidden && window.navigator.standalone === true) {
            // TODO: limit how often this gets called
            checkForUpdate()
        }
    }

    visibilityChange();
    document.addEventListener('visibilitychange', visibilityChange, false);
}

const refresh = document.querySelector('mega-icon-button[icon="refresh"]')
refresh.addEventListener('click', _ => {
    checkForUpdate()
})

const s = document.createElement('script')
s.src = `https://cdn.jsdelivr.net/npm/pwacompat@2.0.9/pwacompat.min.js`
document.head.appendChild(s)