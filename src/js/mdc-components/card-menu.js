/** @format */

import { MDCMenu } from '@material/menu'
import { el } from '../utils'
import { remove_child } from '../utils'
import { get_config } from '../covid-config'

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

        this._self.listen('MDCMenu:selected', evt => {
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

        this._self.setEnabled(index, enabled)
        item[enabled ? 'removeEventListener' : 'addEventListener'](
            'click',
            disable_list_item
        )
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

export function attach(el) {
    if (__INSTANCE__ !== null) {
        __INSTANCE__.attach(el)
    } else {
        throw new Error('Card menu instance not initialized')
    }
}

export function initialize() {
    if (__INSTANCE__ === null) {
        __INSTANCE__ = new CardMenu()
    } else {
        throw new Error('Card menu instance already initialized')
    }
}

export function instance() {
    if (__INSTANCE__ !== null) {
        return __INSTANCE__
    } else {
        throw new Error('Card menu instance not initialized')
    }
}
