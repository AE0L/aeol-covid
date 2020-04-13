import { MDCTopAppBar } from '@material/top-app-bar'
import { el } from '../utils'
import { style_apply, style_remove } from '../utils'

const __ELEMENT__  = el('top-app-bar')
let   __INSTANCE__ = null

const ERROR = {
    AB01: { code: 'AB01', msg: 'App bar instance already initialized' }
}

class AppBar {
    constructor() {
        this._self   = new MDCTopAppBar(__ELEMENT__)
        this._docked = true

        document.onscroll = function() {
            const scrolling = this.documentElement.scrollTop > 0

            if ((scrolling && !this._docked) || (!scrolling && this._docked)) return

            (scrolling ? style_remove : style_apply)('docked', __ELEMENT__) 

            this._docked = !this._docked
        }
    }
}

export function initialize() {
    if (__INSTANCE__ === null) {
        __INSTANCE__ = Object.freeze(new AppBar())
    } else {
        throw ERROR.AB01
    }
}
