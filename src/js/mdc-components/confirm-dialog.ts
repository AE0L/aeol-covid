import { MDCDialog } from '@material/dialog'
import { el, el_text, el_query } from '../utils'

export default class ConfirmDialog {
    private static INSTANCE: ConfirmDialog = null
    private element: HTMLElement = el('confirm-dialog')

    private component: MDCDialog
    private title: HTMLElement
    private content: HTMLElement
    private button_label: HTMLElement

    private constructor() {
        this.component = new MDCDialog(this.element)
        this.title = el_query('.mdc-dialog__title', this.element)
        this.content = el_query('.mdc-dialog__content', this.element)
        this.button_label = el_query('.mdc-button__label', this.element)
    }

    open(title: string, content: string, button_label: string, confirm_action?: Function) {
        el_text(this.title, title)
        el_text(this.content, content)
        el_text(this.button_label, button_label)

        this.component.layout()
        this.component.open()

        this.component.listen('MDCDialog:closed', () => {
            if (confirm_action) confirm_action(this.component)
        })
    }

    static get_instance(): ConfirmDialog {
        if (ConfirmDialog.INSTANCE === null) {
            ConfirmDialog.INSTANCE = new ConfirmDialog()
        }

        return ConfirmDialog.INSTANCE
    }
}

