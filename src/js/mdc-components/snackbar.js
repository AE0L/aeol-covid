import { MDCSnackbar } from '@material/snackbar'

const __ELEMENT__ = el('action-snackbar')

let __INSTANCE__ = null

class Snackbar {
    constructor() {
        this._self = new MDCSnackbar(__ELEMENT__)
    }

    show(message, callback) {
        this._self.labelText = message
        this._open()
    }
}

export function initialize_snackbar() {
    if (__INSTANCE__ === null) {
        __INSTANCE__ = new Snackbar()
    }
}

export default __INSTANCE__ as snackbar_intance
