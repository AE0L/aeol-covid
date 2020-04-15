import { MDCDialog } from '@material/dialog'
import { el } from '../utils'
1
const __ELEMENT__  = el('main-dialog')
let   __INSTANCE__ = null

const ERROR = {
    D01: { code: 'D01', msg: 'Dialog instance already initialized' },
    D02: { code: 'D02', msg: 'Dialog instance not initialized' }
}

class Dialog {
    constructor() {
        this._self = new MDCDialog(__ELEMENT__)
        this._content = el('main-dialog-content')
        this._secondary = this._self.buttons_[0]
        this._primary = this._self.buttons_[1]
        this._secondary_label = el('main-dialog-secondary-label')
        this._primary_label = el('main-dialog-primary-label')
    }

    layout() {
        this._self.layout()
    }

    open(content, primary, secondary, primary_action, secondary_action) {
        this._content.innerText = content
        this._primary_label.innerText = primary
        this._secondary_label.innerText = secondary
        this._self.open()

        this._self.listen('MDCDialog:closed', ({ detail: { action } }) => {
            if (action === 'primary') {
                primary_action()
            } else {
                secondary_action()
            }
        })
    }

    cose() {
        return this._self.close()
    }
}

export function open(...args) {
    if (__INSTANCE__ !== null) {
        __INSTANCE__.open(...args)
    } else {
        throw ERROR.D02
    }
}

export function initialize() {
    if (__INSTANCE__ === null) {
        __INSTANCE__ = new Dialog()
    } else {
        throw ERROR.D01
    }
}
