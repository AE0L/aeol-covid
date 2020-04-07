import { MDCRipple } from '@material/ripple'
import { MDCTopAppBar } from '@material/top-app-bar'

const e = (i) => document.getElementById(i)
const CACHE = {}

export default function material_setup() {
    CACHE['add-fab-ripple'] = new MDCRipple(e('add-fab'))
    CACHE['top-app-bar']    = new MDCTopAppBar(e('top-app-bar'))
}