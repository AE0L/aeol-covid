import { MDCMenu } from '@material/menu'
import CovidConfig from '../covid-config'
import { el, remove_child, style_apply } from '../utils'
import SearchBar from './search-bar'

export default class CardMenu {
    private static INSTANCE: CardMenu = null
    private element: HTMLElement = el('card-menu')

    private component: MDCMenu
    private selected: HTMLElement

    constructor() {
        this.component = new MDCMenu(this.element)
        this.selected = null
        this.component.setFixedPosition(true)

        this.component.listen('MDCMenu:selected', () => {
            const { name } = this.selected.dataset
            const card = el(`${name}-card`)

            CovidConfig.remove_country(name)
            SearchBar.update_search()
            style_apply('remove', card)
            card.onanimationend = () => remove_child('card-container', card)
        })
    }

    show(): void {
        this.component.open = true
    }

    disable_list_item(evt: Event) {
        evt.stopPropagation()
    }

    toggle_item(index: number, enabled: boolean): void {
        const item = this.component.getOptionByIndex(index)

        this.component.setEnabled(index, enabled)

        if (enabled) {
            item.removeEventListener('click', this.disable_list_item)
        } else {
            item.addEventListener('click', this.disable_list_item)
        }
    }

    attach(button: HTMLElement): void {
        button.onclick = () => {
            if (button.dataset.country === 'world') {
                this.toggle_item(0, false)
            } else {
                this.toggle_item(0, true)
            }

            this.component.setAnchorElement(button)
            this.selected = button
            this.show()
        }
    }

    static get_instance(): CardMenu {
        if (CardMenu.INSTANCE === null) {
            CardMenu.INSTANCE = new CardMenu()
        }

        return CardMenu.INSTANCE
    }
}
