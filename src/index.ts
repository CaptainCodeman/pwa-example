import '@webcomponents/webcomponentsjs/webcomponents-loader'

import '@material/mwc-button'
import '@material/mwc-drawer'
import '@material/mwc-icon-button'
import '@material/mwc-snackbar'
import '@material/mwc-top-app-bar'

import supportsPassive from 'supports-passive'

declare global {
    interface Window {
        gtag: Function
    }
}

window.addEventListener('error', e => {
    window.gtag('event', 'exception', {
        'description': e.error,
        'fatal': false
    })
})

const passiveOrFalse = supportsPassive ? { passive: true } : false

const drawer = document.querySelector('mwc-drawer');
const drawerShowAt = 1024

let drawOpen = false
drawer.addEventListener('MDCDrawer:closed', _ => {
    drawOpen = false
})

function setDrawOpenState() {
    const type = window.innerWidth <= 768 ? 'modal' : 'dismissible'
    if (type !== drawer.type) {
        drawer.type = type
    }
    drawer.open = drawOpen || window.innerWidth >= drawerShowAt
}
setDrawOpenState()

window.addEventListener('resize', setDrawOpenState, passiveOrFalse);
window.addEventListener('orientationchange', () => setTimeout(setDrawOpenState, 500));

function toggleDrawer() {
    if (window.innerWidth < drawerShowAt) {
        drawOpen = !drawOpen
        setDrawOpenState()
    }
}
const container = drawer.parentNode;
container.addEventListener('MDCTopAppBar:nav', toggleDrawer)

const bar = document.querySelector('mwc-top-app-bar');
(<any>bar).scrollTarget = bar.nextElementSibling

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

window.addEventListener('load', () => document.body.classList.remove('unresolved'));

const refresh = document.querySelector('mwc-icon-button[icon="refresh"]')
refresh.addEventListener('click', _ => {
    checkForUpdate()
    toggleDrawer()
})