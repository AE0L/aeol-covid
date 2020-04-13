import { MDCMenu } from '@material/menu'
import { el } from '../utils'
import { remove_child } from '../utils'
import { get_config } from '../covid-config'

const __ELEMENT__ = el('context-menu')
let __INSTANCE__ = null

class ContextMenu {
    constructor() {
        this._self = new MDCMenu(__ELEMENT__)
        this._self.setFixedPosition(true)
        this._selected = null

        this._self.listen('MDCMenu:selected', (evt) => {
            const { country } = this._selected.dataset
            const card = el(`${country}-card`)

            get_config().remove_country(country)
            card.classList.add('remove')
            card.onanimationend = () => remove_child('card-container', card)
        })
    }

    _show() {
        this._self.open = true
    }

    _toggle_item(index, enabled) {
        const item = this._self.getOptionByIndex(index)

        function disable_list_item(evt) { evt.stopPropagation() }

        this._self.setEnabled(index, enabled)
        item[enabled ? 'removeEventListener' : 'addEventListener']('click', disable_list_item)
    }

    attach(button) {
        button.onclick = function() {
            if (this.dataset.country === 'world') {
                this._toggle_item(0, false)
            } else {
                this._toggle_item(0, true)
                this._self.setEnabled(0, true)
                this._self.getOptionByIndex(0).removeEventListener('click', this._disable_list_item)
            }

            this._self.setAnchorElement(e)
            this._selected = button
            this._show()
        }
    }
}

export function initialize_cardmenu() {
    if (__INSTANCE__ === null) {
        __INSTANCE__ = new ContextMenu()
    } else {
        throw new Error('ContextMenu already have an instance')
    }
}

export default __INSTANCE__ as cardmenu_instance

