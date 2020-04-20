import storage_available from './test-local-storage'
import Snackbar from './mdc-components/snackbar'

export interface World {
    confirmed: number
    deaths: number
    recovered: number
}

export interface Country {
    name: string
    confirmed: number
    deaths: number
    recovered: number
}

export interface GlobalData {
    date: string
    world: World
    countries: string[]
    result: Country[]
}

export default class CovidData {
    private static INSTANCE: CovidData = null
    private static STORAGE: string = 'covid-global-data'

    private date: string
    private world: World
    private countries: string[]
    private result: Country[]

    private constructor(global_data: GlobalData) {
        for (const prop in global_data) {
            this[prop] = global_data[prop]
        }
    }

    static country(name: string): Country {
        for (const country in CovidData.get_instance().result) {
            if (name === country) {
                return { name: name, ...CovidData.get_instance().result[name] }
            }
        }

        throw 'error'
    }

    static get country_list(): string[] {
        return CovidData.get_instance().countries
    }

    static get world_data(): World {
        return CovidData.get_instance().world
    }

    static get latest_date(): string {
        return CovidData.get_instance().date
    }

    private static async fetch_data(req: string) {
        const res = await fetch(`/${req}`)
        const json = await res.json()

        return json
    }

    static get_instance(): CovidData {
        if (CovidData.INSTANCE === null) {
            throw 'error'
        }

        return CovidData.INSTANCE
    }

    static to_string(): string {
        const json = {
            world: CovidData.world_data,
            countries: CovidData.country_list,
            latest_date: CovidData.latest_date,
            result: CovidData.get_instance().result
        }

        return JSON.stringify(json)
    }

    static async initialize() {
        try {
            const latest_data = await CovidData.fetch_data('covid-world')

            CovidData.INSTANCE = new CovidData(latest_data)

            localStorage.setItem(CovidData.STORAGE, CovidData.to_string())
        } catch {
            if (storage_available()) {
                const raw_data = localStorage.getItem(CovidData.STORAGE)

                if (raw_data) {
                    const local_data: GlobalData = JSON.parse(raw_data)

                    CovidData.INSTANCE = new CovidData(local_data)
                } else {
                    Snackbar.show('Please check your internet connection')
                }
            }
        }
    }
}
