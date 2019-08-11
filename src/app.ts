import '@webcomponents/webcomponentsjs/webcomponents-loader'

import 'mega-material/drawer'
import 'mega-material/top-app-bar'

import supportsPassive from 'supports-passive'

window.addEventListener('error', e => {
    window.gtag('event', 'exception', {
        'description': e.error,
        'fatal': false
    })
})

const passiveOrFalse = supportsPassive ? { passive: true } : false

const drawer = document.querySelector('mega-drawer');
const drawerShowAt = 1024
const drawerModalAt = 768

let drawOpen = false
drawer.addEventListener('MDCDrawer:closed', _ => {
    drawOpen = false
})

function setDrawOpenState() {
    const type = window.innerWidth < drawerModalAt ? 'modal' : 'dismissible'
    switch (type) {
        case 'modal':
            drawer.modal = true
            drawer.dismissible = false
            break
        case 'dismissible':
            drawer.modal = false
            drawer.dismissible = true
            break
    }
    drawer.opened = drawOpen || window.innerWidth >= drawerShowAt
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
// const container = drawer.parentNode;
// container.addEventListener('top-app-bar:nav', toggleDrawer)

const bar = document.querySelector('mega-top-app-bar');
(<any>bar).scrollTarget = bar.parentElement;

window.addEventListener('load', () => document.body.classList.remove('unresolved'));

document.addEventListener('touchmove', function () {
    document.body.scrollTop = 0
})

const refresh = document.querySelector('mega-icon-button[icon="refresh"]')
refresh.addEventListener('click', _ => {
    toggleDrawer()
})

window.requestIdleCallback =
    window.requestIdleCallback ||
    function (cb) {
        var start = Date.now();
        return setTimeout(function () {
            cb({
                didTimeout: false,
                timeRemaining: function () {
                    return Math.max(0, 50 - (Date.now() - start));
                }
            });
        }, 1);
    }

window.cancelIdleCallback =
    window.cancelIdleCallback ||
    function (id) {
        clearTimeout(id);
    }

import('./lazy')