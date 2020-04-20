import { MDCIconButtonToggle } from '@material/icon-button'
import { el } from '../utils'
import CovidConfig from '../covid-config'

const BODY: HTMLElement = el('body')

export type Theme = 'dark' | 'light'

export default class ThemeChanger {
    private static INSTANCE: ThemeChanger = null
    private element: HTMLElement = el('theme-change')

    private component: MDCIconButtonToggle

    constructor(theme: Theme) {
        this.component = new MDCIconButtonToggle(this.element)

        this.change_theme(theme)

        this.component.listen('MDCIconButtonToggle:change', ({ detail: { isOn } }: CustomEvent) => {
            const new_theme: Theme = isOn ? 'dark' : 'light'

            this.change_theme(new_theme)
            CovidConfig.theme = new_theme
        })
    }

    change_theme(theme: string) {
        this.component.on = theme === 'dark'
        BODY.dataset.theme = theme
    }

    static initialize() {
        if (ThemeChanger.INSTANCE === null) {
            ThemeChanger.INSTANCE = new ThemeChanger(CovidConfig.theme)
        }

        return ThemeChanger.INSTANCE
    }
}

