import { MDCSnackbar } from '@material/snackbar'
import { el } from '../utils'

const __ELEMENT__ = el('action-snackbar')
let __INSTANCE__ = null

class Snackbar {
    constructor() {
        this._self = new MDCSnackbar(__ELEMENT__)
    }

    show(message, callback) {
        this._self.labelText = message
        this._self.open()
    }
}


export function show(msg, callback) {
    if (__INSTANCE__ !== null) {
        __INSTANCE__.show(msg, callback)
    } else {
        throw new Error('Snackbar instance not initialized')
    }
}

export function initialize() {
    if (__INSTANCE__ === null) {
        __INSTANCE__ = new Snackbar()
    } else {
        throw new Error('Snackbar instance already initialized')
    }
}