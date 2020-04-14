/** @format */

import { el } from '../utils'
import { update_config } from '../covid-config'
import { MDCIconButtonToggle } from '@material/icon-button'

const __BODY__ = el('body')
const __ELEMENT__ = el('theme-change')
let __INSTANCE__ = null

const ERROR = {
    TC01: { code: 'TC01', msg: 'Theme changer instance already initialized' }
}

class ThemeChanger {
    constructor(theme) {
        this._self = new MDCIconButtonToggle(__ELEMENT__)

        this._change_theme(theme)

        this._self.listen('MDCIconButtonToggle:change', ({ detail: { isOn } }) => {
            this._change_theme(isOn ? 'dark' : 'light')
        })
    }

    _change_theme(theme) {
        this._self.on = theme === 'dark'
        __BODY__.dataset.theme = theme
    }
}

export function initialize({ theme }) {
    if (__INSTANCE__ === null) {
        __INSTANCE__ = Object.freeze(new ThemeChanger(theme))
    } else {
        throw ERROR.TC01
    }
}
