import storage_available from './test-local-storage.js'

let __DATA__ = undefined

async function fetch_data(req) {
    const res = await fetch(`/${req}`)
    return await res.json()
}

export async function initialize_covid_data() {
    if (storage_available()) {
        const stored_data = JSON.parse(localStorage.getItem('covid-world-data'))

        if (stored_data) {
            const latest_date = await fetch_data('latest-date')

            if (stored_data.date === latest_date) {
                __DATA__ = stored_data

                return
            }
        }

        const update_data = await fetch_data('covid-world')

        __DATA__ = update_data

        localStorage.setItem('covid-world-data', JSON.stringify(update_data))
    } 
}

export function get_country(country_name) {
    const { result } = __DATA__

    for (const country in result) {
        if (country_name === country) {
            return result[country_name]
        }
    }

    throw `invalid country name: ${country_name}`
}

export function get_country_list() {
    const { countries } = __DATA__

    if (countries) {
        return countries
    }

    throw 'country list not found'
}

export function get_world_data() {
    const { world } = __DATA__

    if (world) {
        return  world
    }

    throw 'world data not found'
}

export function get_latest_date() {
    const { date } = __DATA__

    if (date) {
        return date
    }

    throw 'latest date not found'
}
