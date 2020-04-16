/** @format */

import { MDCDialog } from '@material/dialog'
import { el } from '../utils'

const __ELEMENT__ = el('main-dialog')
let __INSTANCE__ = null

class Dialog {
    constructor() {
        this._self = new MDCDialog(__ELEMENT__)
        this._title = el('main-dialog-title')
        this._content = el('main-dialog-content')
        this._secondary = this._self.buttons_[0]
        this._primary = this._self.buttons_[1]
        this._secondary_label = el('main-dialog-secondary-label')
        this._primary_label = el('main-dialog-primary-label')
    }

    open(title, content, primary, secondary, primary_action=null, secondary_action=null, on_close=null) {
        this._title.innerText = title
        this._content.innerText = content
        this._primary_label.innerText = primary
        this._secondary_label.innerText = secondary
        this._primary.dataset.mdcDialogAction = primary
        this._secondary.dataset.mdcDialogAction = secondary
        this._self.open()
        this._self.layout()

        this._self.listen('MDCDialog:closed', ({ detail: { action } }) => {
            if (action === primary && primary_action) {
                primary_action()
            } else if (action === secondary && secondary_action) {
                secondary_action()
            } else if (action === 'close' && on_close) {
                on_close()
            }
        })
    }

    cose() {
        return this._self.close()
    }
}

function get_instance() {
    if (__INSTANCE__ === null) {
        __INSTANCE__ = new Dialog()
    }

    return __INSTANCE__
}

export function open(...args) {
    get_instance().open(...args)
}

