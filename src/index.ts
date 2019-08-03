import '@webcomponents/webcomponentsjs/webcomponents-loader'

import '@material/mwc-button'
import '@material/mwc-drawer'
import '@material/mwc-icon-button'
import '@material/mwc-snackbar'
import '@material/mwc-top-app-bar'

// import '@material/mwc-linear-progress'

import supportsPassive from 'supports-passive'

const passiveOrFalse = supportsPassive ? { passive: true } : false

const drawer = document.querySelector('mwc-drawer');

let drawOpen = false
drawer.addEventListener('MDCDrawer:closed', _ => {
    drawOpen = false
})

function setDrawOpenState() {
    const type = window.innerWidth < 768 ? 'modal' : 'dismissible'
    if (type !== drawer.type) {
        drawer.type = type
    }
    drawer.open = drawOpen || window.innerWidth >= 960
}

const container = drawer.parentNode;
container.addEventListener('MDCTopAppBar:nav', _ => {
    if (window.innerWidth < 960) {
        drawOpen = !drawOpen
        setDrawOpenState()
    }
})

const bar = document.querySelector('mwc-top-app-bar');
(<any>bar).scrollTarget = bar.nextElementSibling

function setViewport() {
    requestAnimationFrame(() => {
        setDrawOpenState()
        document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
    })
}

setViewport();

window.addEventListener('resize', setViewport, passiveOrFalse);
window.addEventListener('orientationchange', () => {
    setTimeout(() => setViewport(), 500)
});

if (document.hidden !== undefined) {
    function visibilityChange() {
        document.title = document.hidden ? 'hidden' : 'active'
    }

    visibilityChange();
    document.addEventListener('visibilitychange', visibilityChange, false);
}

window.addEventListener('load', () => document.body.classList.remove('unresolved'));
