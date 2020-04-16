/** @format */

import { MDCDialog } from '@material/dialog'
import { el } from '../utils'

const __ELEMENT__ = el('confirm-dialog')
let __INSTANCE__ = null

class ConfirmDialog {
    constructor() {
        this._self = new MDCDialog(__ELEMENT__)
        this._title = el('confirm-dialog-title')
        this._content = el('confirm-dialog-content')
        this._confirm_label = el('confirm-dialog-button-label')
    }

    open(title, content, label, confirm_action=null) {
        this._title.innerText = title
        this._content.innerText = content
        this._confirm_label.innerText = label
        this._self.open()
        this._self.layout()

        this._self.listen('MDCDialog:closed', () => {
            if (confirm_action) {
                confirm_action(this._self)
            }
        })
    }
}

function get_instance() {
    if (__INSTANCE__ === null) {
        __INSTANCE__ = new ConfirmDialog()
    }

    return __INSTANCE__
}

export function open(...args) {
    get_instance().open(...args)
}

