import { MDCDialog } from '@material/dialog'
import { el, el_text, el_query } from '../utils'

interface OnCloseCallback {
    (action: string): void
}

export default class Dialog {
    private static INSTANCE: Dialog = null
    private element: HTMLElement = el('main-dialog')

    private component: MDCDialog
    private title: HTMLElement
    private content: HTMLElement
    private primary: HTMLElement
    private primary_label: HTMLElement
    private secondary: HTMLElement
    private secondary_label: HTMLElement

    private constructor() {
        this.component = new MDCDialog(this.element)
        this.title = el_query('#dialog-title', this.element)
        this.content = el_query('#dialog-content', this.element)
        this.primary = el_query('#dialog-primary', this.element)
        this.primary_label = el_query('.mdc-button__label', this.primary)
        this.secondary = el_query('#dialog-secondary', this.element)
        this.secondary_label = el_query('.mdc-button__label', this.secondary)
    }

    open(
        title: string,
        content: string,
        primary: string,
        secondary: string,
        on_close?: OnCloseCallback
    ): void {
        el_text(this.title, title)
        el_text(this.content, content)
        el_text(this.primary_label, primary)
        el_text(this.secondary_label, secondary)

        this.primary.dataset.mdcDialogAction = primary
        this.secondary.dataset.mdcDialogAction = secondary

        this.component.layout()
        this.component.open()

        if (on_close) {
            this.component.listen('MDCDialog:closed', ({ detail: { action } }: CustomEvent) => {
                if (action === primary) {
                    on_close(primary)
                } else {
                    on_close(secondary)
                }
            })
        }
    }

    close(): void {
        this.component.close()
    }

    static get_instance() {
        if (Dialog.INSTANCE === null) {
            Dialog.INSTANCE = new Dialog()
        }

        return Dialog.INSTANCE
    }
}

