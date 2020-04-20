import { MDCSnackbar } from '@material/snackbar'
import { el } from '../utils'

export default class Snackbar {
    private static INSTANCE: Snackbar = null
    private element = el('action-snackbar')

    private component: MDCSnackbar

    constructor() {
        this.component = new MDCSnackbar(this.element)
    }

    static show(msg: string) {
        const instance: Snackbar = Snackbar.get_instance()

        instance.component.labelText = msg
        instance.component.open()
    }

    private static get_instance(): Snackbar {
        if (Snackbar.INSTANCE === null) {
            Snackbar.INSTANCE = new Snackbar()
        }

        return Snackbar.INSTANCE
    }
}
