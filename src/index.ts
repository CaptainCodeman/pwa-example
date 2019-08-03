import '@webcomponents/webcomponentsjs/webcomponents-loader'

import '@material/mwc-button'
import '@material/mwc-drawer'
import '@material/mwc-icon-button'
import '@material/mwc-snackbar'
import '@material/mwc-top-app-bar'

// import '@material/mwc-linear-progress'

import supportsPassive from 'supports-passive'

const passiveOrFalse = supportsPassive ? { passive: true } : false

const isIos = () => {
const userAgent = window.navigator.userAgent.toLowerCase();
return /iphone|ipad|ipod/.test( userAgent );
}
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

const drawer = document.querySelector('mwc-drawer');
const drawerShowAt = 1024

let drawOpen = false
drawer.addEventListener('MDCDrawer:closed', _ => {
    drawOpen = false
})

function setDrawOpenState() {
    const type = window.innerWidth < 768 ? 'modal' : 'dismissible'
    if (type !== drawer.type) {
        drawer.type = type
    }
    drawer.open = drawOpen || window.innerWidth >= drawerShowAt
}

const container = drawer.parentNode;
container.addEventListener('MDCTopAppBar:nav', _ => {
    if (window.innerWidth < drawerShowAt) {
        drawOpen = !drawOpen
        setDrawOpenState()
    }
})

const bar = document.querySelector('mwc-top-app-bar');
(<any>bar).scrollTarget = bar.nextElementSibling

function setViewport() {
    setDrawOpenState()

    document.documentElement.style.setProperty('--viewport-width', `${window.innerWidth}px`);
    document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
}

setViewport();

window.addEventListener('resize', setViewport, passiveOrFalse);

function setOrientation() {
    switch (window.orientation) {
        case 90:
            document.documentElement.setAttribute('landscape', 'left')
            break
        case -90:
            document.documentElement.setAttribute('landscape', 'right')
            break
        default:
            document.documentElement.removeAttribute('landscape')
            break
    }

    setTimeout(setViewport, 500);
}

setOrientation()

window.addEventListener('orientationchange', setOrientation);

function checkForUpdate() {
    window.dispatchEvent(new CustomEvent('sw-update'))
}

if (document.hidden !== undefined) {
    function visibilityChange() {
        document.title = document.hidden ? 'hidden' : 'active'
        setViewport()

        if (!document.hidden && isIos() && !isInStandaloneMode()) {
            // TODO: limit how often this gets called
            checkForUpdate()
        }
    }

    visibilityChange();
    document.addEventListener('visibilitychange', visibilityChange, false);
}

window.addEventListener('load', () => document.body.classList.remove('unresolved'));

const refresh = document.querySelector('mwc-icon-button[icon="refresh"]')
refresh.addEventListener('click', checkForUpdate)