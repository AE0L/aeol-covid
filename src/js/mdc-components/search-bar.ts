import { MDCList } from '@material/list'
import { MDCTextField } from '@material/textfield'
import { MDCTopAppBar } from '@material/top-app-bar'
import Clusterize from 'clusterize.js'
import Fuse from 'fuse.js'
import add_country from '../add-country'
import CovidConfig from '../covid-config'
import CovidData from '../covid-data'
import { el, style_apply, style_remove, style_replace } from '../utils'
import Snackbar from './snackbar'

interface ListItem {
    country: string
    element: string
}

export default class SearchBar {
    private static INSTANCE: SearchBar = null

    private body: HTMLElement = el('body')
    private search_btn: HTMLElement = el('search-btn')
    private search_bar: HTMLElement = el('search-app-bar')
    private search_field: HTMLElement = el('search-text-field')
    private search_field_input = <HTMLInputElement>el('search-text-field-input')
    private search_clear: HTMLElement = el('search-text-field-clear')
    private search_result_container: HTMLElement = el('search-result-container')
    private search_result_list: HTMLElement = el('search-result-list')
    private search_exit: HTMLElement = el('search-exit-btn')
    private search_result: MDCList

    private countries: string[] = null
    private fuse = null
    private virtual_list: Clusterize = null
    private result_items = null
    private list_items: ListItem[] = null

    private constructor() {
        this.search_result = new MDCList(this.search_result_list)
        new MDCTopAppBar(this.search_bar)
        new MDCTextField(this.search_field)

        this.virtual_list = new Clusterize({
            scrollId: 'search-result-container',
            contentId: 'search-result-list',
            show_no_data_row: false
        })

        this.countries = CovidData.country_list
        this.setup_events()
    }

    private toggle_result_container() {
        const cont = this.search_result_container

        if (cont.dataset.collapsed === 'true') {
            requestAnimationFrame(() => {
                const { height: first } = cont.getBoundingClientRect()
                style_replace('collapsed', 'expanded', cont)
                const { height: last } = cont.getBoundingClientRect()

                cont.animate([{ transform: `scaleY(${first / last})` }, { transform: 'none' }], {
                    duration: 125,
                    easing: 'ease-out'
                })

                cont.dataset.collapsed = 'false'
            })
        } else {
            requestAnimationFrame(() => {
                const { height } = cont.getBoundingClientRect()
                style_replace('expanded', 'collapsed', cont)

                cont.animate([{ transform: `scaleY(${height})` }, { transform: 'none' }], {
                    duration: 125,
                    easing: 'ease-in'
                })

                cont.dataset.collapsed = 'true'
            })
        }
    }

    private setup_events() {
        const hide_search_bar = () => {
            this.search_field_input.value = ''
            this.virtual_list.clear()

            style_remove('no-scroll', this.body)
            style_remove('show', this.search_bar)
            style_remove('show', this.search_clear)
            this.toggle_result_container()
        }

        this.search_btn.onclick = () => {
            style_apply('no-scroll', this.body)
            style_apply('show', this.search_bar)
            this.search_field.focus()
            this.toggle_result_container()
        }

        this.search_field_input.onkeyup = () => {
            const { value } = this.search_field_input

            if (value) {
                this.result_items = this.fuse.search(value)

                style_apply('show', this.search_clear)
                this.virtual_list.update(
                    this.result_items.map(({ refIndex: i }) => this.list_items[i].element)
                )
            } else {
                style_remove('show', this.search_clear)
                this.virtual_list.clear()
            }
        }

        this.search_clear.onclick = () => {
            this.search_field_input.value = ''
            this.search_field.focus()
            this.virtual_list.clear()
            style_remove('show', this.search_clear)
        }

        this.search_result.listen('MDCList:action', async ({ detail: { index } }: CustomEvent) => {
            hide_search_bar()
            const name = this.result_items[index].item

            try {
                const country = CovidData.country(name)

                add_country(country)
                CovidConfig.add_country(country)
                this.update_search()
            } catch {
                Snackbar.show(`Can't get ${name}'${name[name.length - 1] === 's' ? '' : 's'} data`)
            }
        })

        this.search_exit.onclick = () => hide_search_bar()
    }

    static set fuse(value: any) {
        SearchBar.get_instance().fuse = value
    }

    static set list_items(value: ListItem[]) {
        SearchBar.get_instance().list_items = value
    }

    static get list_items(): ListItem[] {
        return SearchBar.get_instance().list_items
    }

    static get countries(): string[] {
        return SearchBar.get_instance().countries
    }

    private update_search() {
        const remove: string[] = CovidConfig.countries.map(c => c.name)
        const filtered: string[] = SearchBar.countries.filter(c => !remove.includes(c))

        this.fuse = new Fuse(filtered, { threshold: 0 })
        this.list_items = []

        filtered.forEach(country => {
            this.list_items.push({
                country: country,
                element: `
                <li class=mdc-list-item data-value=${country} role=option>
                    <span class=mdc-list-item__text>${country}</span>
                </li>
                `
            })
        })
    }

    static update_search() {
        SearchBar.get_instance().update_search()
    }

    static get_instance(): SearchBar {
        if (SearchBar.INSTANCE === null) {
            SearchBar.initialize()
        }

        return SearchBar.INSTANCE
    }

    static initialize() {
        SearchBar.INSTANCE = new SearchBar()
        SearchBar.update_search()
    }
}
