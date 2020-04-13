import { get_country_list } from '../covid-data'
import { MDCList } from '@material/list'
import { MDCTopAppBar } from '@material/top-app-bar'
import { MDCTextField } from '@material/textfield'
import { style_apply } from '../utils'
import { style_remove } from '../utils'
import { el } from '../utils'
import { get_country } from '../covid-data'
import snackbar_instance from './snackbar'
import Fuse from 'fuse.js'
import Clusterize from 'clusterize.js'
import add_country from '../add-country'

const log = (s) => console.log(`(search-bar): ${s}`)

const body                    = el('body')
const search_btn              = el('search-btn')
const search_bar              = el('search-app-bar')
const search_field            = el('search-text-field')
const search_field_input      = el('search-text-field-input')
const search_clear            = el('search-text-field-clear')
const search_exit             = el('search-exit-btn')
const search_result_container = el('search-result-container')
const search_result_list      = el('search-result-list')
const search_result           = new MDCList(search_result_list)

new MDCTopAppBar(search_bar)
new MDCTextField(search_field)

let countries;
let fuse;
let result_items;
const list_items = []

// virualized list
const virtual_list = new Clusterize({
    scrollElem: search_result_container,
    contentElem: search_result_list,
    show_no_data_row: false
})


function initialize_searching() {
    countries = get_country_list()
    fuse = new Fuse(countries, { threshold: 0 })

    countries.forEach(country => list_items.push(`
        <li class=mdc-list-item data-value=${country} role=option>
            <span class=mdc-list-item__text>${country}</span>
        </li>
    `))
}

function toggle_result_container() {
    const cont = search_result_container

    if (cont.dataset.collapsed === 'true') {
        requestAnimationFrame(() => {
            const { height: first } = cont.getBoundingClientRect()
            cont.classList.replace('collapsed', 'expanded')
            const { height: last } = cont.getBoundingClientRect()

            cont.animate([
                { transform: `scaleY(${first / last})` },
                { transform: 'none' }
            ], { duration: 175, easing: 'ease-out' })

            cont.dataset.collapsed = false
        })
    } else {
        requestAnimationFrame(() => {
            const { height } = cont.getBoundingClientRect()
            cont.classList.replace('expanded', 'collapsed')

            cont.animate([
                { transform: `scaleY(${height})` },
                { transform: 'none' }
            ], { duration: 175, easing: 'ease-in' })

            cont.dataset.collapsed = true
        })
    }
}

function initialize_event_handlers(config) {
    const hide_search_bar = () => {
        search_field_input.value = ''
        virtual_list.clear()

        style_remove('no-scroll', body)
        style_remove('show', search_bar)
        style_remove('show', search_clear)
        toggle_result_container()
    }

    search_btn.onclick = () => {
        style_apply('no-scroll', body)
        style_apply('show', search_bar)
        search_field.focus()
        toggle_result_container()
    }

    search_field_input.onkeyup = function() {
        const { value } = this

        if (value) {
            result_items = fuse.search(value)

            style_apply('show', search_clear)
            virtual_list.update(result_items.map(({ refIndex: i }) => list_items[i]))
        } else {
            style_remove('show', search_clear)
        }
    }

    search_clear.onclick = () => {
        search_field_input.value = ''
        search_field.focus()
        virtual_list.clear()
        style_remove('show', search_clear)
    }

    search_result.listen('MDCList:action', async({ detail: { index }}) => {
        hide_search_bar()

        const name = result_items[index].item

        try {
            const { confirmed, deaths, recovered } = get_country(name)

            add_country(name, confirmed, deaths, recovered)
            config.save_country(name, confirmed, deaths, recovered)
        } catch (e) {
            console.error(e)
            snackbar_instance.show('Please check your connection')
        }
    })

    search_exit.onclick = () => hide_search_bar()
}

export function initialize(config) {
    initialize_searching()
    initialize_event_handlers(config)
}
