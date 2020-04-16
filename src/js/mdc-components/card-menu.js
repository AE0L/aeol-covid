/** @format */

import { MDCMenu } from '@material/menu'
import { get_config } from '../covid-config'
import { el, remove_child } from '../utils'
import { update_search } from './search-bar'

const __ELEMENT__ = el('card-menu')
let __INSTANCE__ = null

function disable_list_item(evt) {
    evt.stopPropagation()
}

class CardMenu {
    constructor() {
        this._self = new MDCMenu(__ELEMENT__)
        this._self.setFixedPosition(true)
        this._selected = null

        this._self.listen('MDCMenu:selected', () => {
            const { country } = this._selected.dataset
            const card = el(`${country}-card`)

            get_config().remove_country(country)
            update_search()
            card.classList.add('remove')
            card.onanimationend = () => remove_child('card-container', card)
        })
    }

    _show() {
        this._self.open = true
    }

    _toggle_item(index, enabled) {
        const item = this._self.getOptionByIndex(index)

        this._self.setEnabled(index, enabled)
        item[enabled ? 'removeEventListener' : 'addEventListener']('click', disable_list_item)
    }

    attach(button) {
        button.onclick = () => {
            if (button.dataset.country === 'world') {
                this._toggle_item(0, false)
            } else {
                this._toggle_item(0, true)
            }

            this._self.setAnchorElement(button)
            this._selected = button
            this._show()
        }
    }
}

function get_instance() {
    if (__INSTANCE__ === null) {
        __INSTANCE__ = new CardMenu()
    }

    return __INSTANCE__
}

export function attach(el) {
    get_instance().attach(el)
}
