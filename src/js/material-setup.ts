import { MDCRipple } from '@material/ripple'
import CovidConfig from './covid-config'
import ThemeChanger from './mdc-components/theme-changer'
import AppBar from './mdc-components/app-bar'
import add_country from './add-country'
import { el_queryall } from './utils'
import SearchBar from './mdc-components/search-bar'

function setup_ripples() {
    ;[].map.call(el_queryall('.ripple'), (e: HTMLElement) => {
        new MDCRipple(e).unbounded = true
    })
}

function setup_country_list() {
    CovidConfig.countries.forEach(country => {
        if (country.name === 'World') { return }

        add_country(country, false)
    })
}

export default function material_setup() {
    ThemeChanger.initialize()
    AppBar.initialize()
    SearchBar.initialize()
    setup_country_list()
    setup_ripples()
}
