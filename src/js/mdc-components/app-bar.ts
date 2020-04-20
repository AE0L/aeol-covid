import { MDCTopAppBar } from '@material/top-app-bar'
import { el, style_apply, style_remove } from '../utils'

export default class AppBar {
    private element: HTMLElement = el('top-app-bar')

    constructor() {
        new MDCTopAppBar(this.element)

        let docked = true

        document.onscroll = () => {
            const scrolling = document.documentElement.scrollTop > 0

            if ((scrolling && !docked) || (!scrolling && docked)) return

            if (scrolling) {
                style_remove('docked', this.element)
            } else {
                style_apply('docked', this.element)
            }

            docked = !docked
        }
    }

    static initialize() {
        new AppBar()
    }
}
