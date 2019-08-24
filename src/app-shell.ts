import '@webcomponents/webcomponentsjs/webcomponents-loader'
import { customElement, LitElement, html, css, property, PropertyValues, query } from 'lit-element'
import supportsPassive from 'supports-passive'

import { DrawerElement } from 'mega-material/drawer';
import 'mega-material/drawer'
import 'mega-material/top-app-bar'

const drawerShowAt = 1024
const drawerModalAt = 768

@customElement('app-shell')
export class AppShellElement extends LitElement {
  @property({ type: Boolean }) drawOpen: boolean = false

  @query('mega-drawer')
  drawer: DrawerElement

  constructor() {
    super()
    this.setDrawOpenState = this.setDrawOpenState.bind(this)
  }

  firstUpdated(changedProperties: PropertyValues) {
    import('./lazy')
    document.body.classList.remove('unresolved')

    const passiveOrFalse = supportsPassive ? { passive: true } : false
    this.setDrawOpenState()

    window.addEventListener('resize', this.setDrawOpenState, passiveOrFalse);
    window.addEventListener('orientationchange', () => setTimeout(this.setDrawOpenState, 500));
  }

  setDrawOpenState() {
    if (window.innerWidth < drawerModalAt) {
      this.drawer.modal = true
      this.drawer.dismissible = false
    } else {
      this.drawer.modal = false
      this.drawer.dismissible = true
    }
    this.drawer.opened = this.drawOpen || window.innerWidth >= drawerShowAt
  }

  checkUpdate(e: Event) {
    this.dispatchEvent(new CustomEvent('sw-update', {
      bubbles: true,
      composed: true,
    }))
  }

  render() {
    return html`
      <mega-drawer hasheader dismissible>
        <span slot="title">Drawer Title</span>
        <span slot="subtitle">subtitle</span>
        <div id="drawer-content">
          <p>Drawer content</p>
          <mega-icon-button icon="refresh" @click=${this.checkUpdate}></mega-icon-button>
          <mega-icon-button icon="gesture"></mega-icon-button>
          <mega-icon-button icon="gavel"></mega-icon-button>
        </div>
        <div slot="app-content">
          <mega-top-app-bar>
            <mega-icon-button icon="menu" slot="navigationIcon"></mega-icon-button>
            <div slot="title" id="title">PWA Example</div>
            <mega-icon-button icon="file_download" slot="actionItems"></mega-icon-button>
            <mega-icon-button icon="print" slot="actionItems"></mega-icon-button>
            <mega-icon-button icon="favorite" slot="actionItems"></mega-icon-button>
          </mega-top-app-bar>
          <div id="main-content">
            <slot></slot>
          </div>
        </div>
      </mega-drawer>
    `
  }

  static get styles() {
    return css`
      #drawer-content {
        padding: 0px 8px;
      }

      div[slot="app-content"] {
        width: 100%;
        height: 100%;
        display: flex;
        background-color: #fff;
        flex-direction: column;
        overflow: hidden;
      }

      #main-content {
        overflow-x: hidden;
        overflow-y: scroll;
        box-sizing: border-box;
        padding: var(--min-padding);
        -webkit-overflow-scrolling: touch;
      }

      @supports(padding: max(0px)) {
        #main-content {
          padding-left: max(var(--min-padding), var(--safe-area-inset-left));
          padding-right: max(var(--min-padding), var(--safe-area-inset-right));
        }
      }

      mega-drawer {
        background-color: #f7f7f7;
      }

      mega-top-app-bar {
        display: block;
        flex: 0;
      }

      @media (min-width: 1024px) {
        mega-icon-button[slot="navigationIcon"] {
          display: none;
        }
      }
    `
  }
}
