/** @format */

import storage_available from './test-local-storage.js'

let __DATA__ = null

const ERROR = Object.freeze({
    CD01: { code: 'CD01', msg: 'COVID data already initialized' },
    CD02: { code: 'CD02', msg: 'COVID data not initialized' },
    CD03: { code: 'CD03', msg: 'Local storage not supported' },
    CD04: country => ({ code: 'CDO4', msg: `Invaild country name ${country}` }),
    CD05: { code: 'CD05', msg: 'Country list not found' },
    CD06: { code: 'CD06', msg: 'World COVID data not found' },
    CD07: { code: 'CD07', msg: 'Latest date not found' }
})

async function fetch_data(req) {
    const res = await fetch(`/${req}`)
    return await res.json()
}

function is_initialized() {
    return (
        __DATA__ !== null &&
        'date' in __DATA__ &&
        'world' in __DATA__ &&
        'countries' in __DATA__ &&
        'result' in __DATA__
    )
}

export async function initialize_covid_data() {
    if (!is_initialized()) {
        if (storage_available()) {
            const stored_data = JSON.parse(
                localStorage.getItem('covid-world-data')
            )

            if (stored_data) {
                const latest_date = await fetch_data('latest-date')

                if (stored_data.date === latest_date) {
                    __DATA__ = stored_data

                    return
                }
            }

            const update_data = await fetch_data('covid-world')

            __DATA__ = update_data

            localStorage.setItem(
                'covid-world-data',
                JSON.stringify(update_data)
            )
        } else {
            throw ERROR.CD03
        }
    } else {
        throw ERROR.CD01
    }
}

export function get_country(country_name) {
    if (__DATA__ !== null) {
        const { result } = __DATA__

        for (const country in result) {
            if (country_name === country) {
                return result[country_name]
            }
        }

        throw ERROR.CD04(country_name)
    } else {
        throw ERROR.CD02
    }
}

export function get_country_list() {
    if (__DATA__ !== null) {
        const { countries } = __DATA__

        if (countries) {
            return countries
        }

        throw ERROR.CD05
    } else {
        throw ERROR.CD02
    }
}

export function get_world_data() {
    if (__DATA__ !== null) {
        const { world } = __DATA__

        if (world) {
            return world
        }

        throw new ERROR.CD06()
    } else {
        throw ERROR.CD02
    }
}

export function get_latest_date() {
    if (__DATA__ !== null) {
        const { date } = __DATA__

        if (date) {
            return date
        }

        throw ERROR.CD07
    } else {
        throw ERROR.CD02
    }
}
