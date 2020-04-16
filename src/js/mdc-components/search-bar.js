/** @format */

import { MDCList } from '@material/list'
import { MDCTextField } from '@material/textfield'
import { MDCTopAppBar } from '@material/top-app-bar'
import Clusterize from 'clusterize.js'
import Fuse from 'fuse.js'
import add_country from '../add-country'
import { get_country, get_country_list } from '../covid-data'
import { el, style_apply, style_remove } from '../utils'
import * as snackbar from './snackbar'
import * as config from '../covid-config'

const body = el('body')
const search_btn = el('search-btn')
const search_bar = el('search-app-bar')
const search_field = el('search-text-field')
const search_field_input = el('search-text-field-input')
const search_clear = el('search-text-field-clear')
const search_exit = el('search-exit-btn')
const search_result_container = el('search-result-container')
const search_result_list = el('search-result-list')
const search_result = new MDCList(search_result_list)

new MDCTopAppBar(search_bar)
new MDCTextField(search_field)

let countries = null
let fuse = null
let result_items = null
let list_items = null

// virualized list
const virtual_list = new Clusterize({
    scrollElem: search_result_container,
    contentElem: search_result_list,
    show_no_data_row: false
})

function initialize_searching() {
    countries = get_country_list()
    update_search()
}

function toggle_result_container() {
    const cont = search_result_container

    if (cont.dataset.collapsed === 'true') {
        requestAnimationFrame(() => {
            const { height: first } = cont.getBoundingClientRect()
            cont.classList.replace('collapsed', 'expanded')
            const { height: last } = cont.getBoundingClientRect()

            cont.animate([{ transform: `scaleY(${first / last})` }, { transform: 'none' }], {
                duration: 125,
                easing: 'ease-out'
            })

            cont.dataset.collapsed = false
        })
    } else {
        requestAnimationFrame(() => {
            const { height } = cont.getBoundingClientRect()
            cont.classList.replace('expanded', 'collapsed')

            cont.animate([{ transform: `scaleY(${height})` }, { transform: 'none' }], {
                duration: 125,
                easing: 'ease-in'
            })

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
            virtual_list.update(result_items.map(({ refIndex: i }) => list_items[i].element))
        } else {
            style_remove('show', search_clear)
            virtual_list.clear()
        }
    }

    search_clear.onclick = () => {
        search_field_input.value = ''
        search_field.focus()
        virtual_list.clear()
        style_remove('show', search_clear)
    }

    search_result.listen('MDCList:action', async ({ detail: { index } }) => {
        hide_search_bar()

        const name = result_items[index].item

        try {
            const { confirmed, deaths, recovered } = get_country(name)

            add_country(name, confirmed, deaths, recovered)
            config.save_country(name, confirmed, deaths, recovered)
            update_search()
        } catch ({ code, msg }) {
            if (code === 'CD02') {
                snackbar.show(
                    `Can't get ${name}'${name[name.length - 1] === 's' ? '' : 's'} data`
                )
            }
        }
    })

    search_exit.onclick = () => hide_search_bar()
}

export function update_search() {
    const remove = config.get_config().countries.map(c => c.name)
    const filtered = countries.filter(c => !remove.includes(c))

    fuse = new Fuse(filtered, { threshold: 0 })
    list_items = []

    filtered.forEach(country => {
        list_items.push({
            country: country,
            element: `
                <li class=mdc-list-item data-value=${country} role=option>
                    <span class=mdc-list-item__text>${country}</span>
                </li>
            `
        })
    })
}

export function initialize(config) {
    initialize_searching()
    initialize_event_handlers(config)
}
