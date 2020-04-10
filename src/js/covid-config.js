import { latest_date }   from './covid-data.js'
import { world_data  }   from './covid-data.js'
import storage_available from './test-local-storage.js'


class CovidConfig {
    constructor(config) {
        if (config && config !== undefined) {
            this.theme       = config.theme
            this.countries   = config.countries
            this.latest_date = config.latest_date
            this.new         = config.new
        } else {
            throw new Error(
                'Cannot be called without config file, use static function build() instead.'
            )
        }
    }

    static async build() {
        const _world_data  = await world_data()
        const _latest_date = await latest_date()

        const config = {
            theme:       'light',
            countries:   [
                { name: 'World', ..._world_data }
            ],
            latest_date: _latest_date,
            new: true
        }

        return new CovidConfig(config)
    }

    to_string() {
        const json = {}

        json.theme       = this.theme
        json.latest_date = this.latest_date
        json.countries   = this.countries.map(e => ({...e}))

        return JSON.stringify(json)
    }

    save_country(name, confirmed, deaths, recovered) {
        this.countries.push({
            name: name,
            confirmed: confirmed,
            deaths: deaths,
            recovered: recovered
        })

        this.update()
    }

    update() {
        localStorage.setItem('covid-user-config', this.to_string())
    }
}

let __CONFIG__ = null

export async function  init_config() {
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
            console.error(e);
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

export function update_config(o) {
    for (const p in o) {
        __CONFIG__[p] = o[p]
    }

    __CONFIG__.update()
}
