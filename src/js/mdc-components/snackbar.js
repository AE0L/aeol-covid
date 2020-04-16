/** @format */

import { MDCSnackbar } from '@material/snackbar'
import { el } from '../utils'

const __ELEMENT__ = el('action-snackbar')
let __INSTANCE__ = null

class Snackbar {
    constructor() {
        this._self = new MDCSnackbar(__ELEMENT__)
    }

    show(message) {
        this._self.labelText = message
        this._self.open()
    }
}

function get_instance() {
    if (__INSTANCE__ === null) {
        __INSTANCE__ = new Snackbar()
    }

    return __INSTANCE__
}

export function show(msg, callback) {
    get_instance().show(msg, callback)
}

