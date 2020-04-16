/** @format */

import {get_world_data} from './covid-data.js'
import storage_available from './test-local-storage.js'

class CovidConfig {
    constructor(config) {
        if (config && config !== undefined) {
            this.theme = config.theme
            this.countries = config.countries
            this.install_ignored = config.install_ignored
            this.installed = config.installed
            this.first_time = config.first_time
        } else {
            throw new Error('Invalid class constructor invocation.')
        }
    }

    static async build() {
        const _world_data = get_world_data()

        const config = {
            theme: 'light',
            countries: [{ name: 'World', ..._world_data }],
            install_ignored: false,
            installed: false,
            first_time: true
        }

        return new CovidConfig(config)
    }

    to_string() {
        const json = {}

        json.theme = this.theme
        json.install_ignored = this.install_ignored
        json.countries = this.countries.map(e => ({ ...e }))
        json.installed = this.installed
        json.first_time = this.first_time

        return JSON.stringify(json)
    }

    save_country(name, confirmed, deaths, recovered) {
        this.countries.push({
            name: name,
            confirmed: confirmed,
            deaths: deaths,
            recovered: recovered
        })

        this.update_storage()
    }

    remove_country(country_name) {
        this.countries = this.countries.filter(({ name }) => name !== country_name)

        this.update_storage()
    }

    update_storage() {
        localStorage.setItem('covid-user-config', this.to_string())
    }
}

let __CONFIG__ = null

export async function init_config() {
    if (storage_available()) {
        try {
            const raw_config = localStorage.getItem('covid-user-config')

            if (raw_config) {
                const config = JSON.parse(raw_config)

                __CONFIG__ = new CovidConfig(config)
            } else {
                __CONFIG__ = await CovidConfig.build()

                localStorage.setItem('covid-user-config', __CONFIG__.to_string())
            }

            return true
        } catch (e) {
            console.groupCollapsed('CONFIGURATION ERROR')
            console.error(e)
            console.groupEnd('CONFIGURATION ERROR')

            return false
        }
    } else {
        return false
    }
}

export function get_config() {
    return __CONFIG__
}

export function update_config(obj) {
    for (const prop in obj) {
        if (prop in __CONFIG__) {
            __CONFIG__[prop] = obj[prop]
        } else {
            throw new Error(`Invalid configuration property: ${prop}`)
        }
    }

    __CONFIG__.update_storage()
}
