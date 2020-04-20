import CovidData from './covid-data'
import storage_available from './test-local-storage'
import { Theme } from './mdc-components/theme-changer'

interface Country {
    name: string
    confirmed: number
    deaths: number
    recovered: number
}

interface Config {
    theme: Theme
    countries: Country[]
    install_ignored: boolean
    installed: boolean
    first_time: boolean
}

export default class CovidConfig {
    private static INSTANCE: CovidConfig = null
    private static STORAGE: string = 'covid-user-config'

    private _theme: Theme
    private _countries: Country[]
    private _install_ignored: boolean
    private _installed: boolean
    private _first_time: boolean

    private constructor(config: Config) {
        for (const prop in config) {
            this[`_${prop}`] = config[prop]
        }
    }

    static get theme(): Theme {
        return CovidConfig.get_instance()._theme
    }

    static set theme(new_theme: Theme) {
        CovidConfig.get_instance()._theme = new_theme
        CovidConfig.update_storage()
    }

    static get countries(): Country[] {
        return CovidConfig.get_instance()._countries
    }

    static add_country(country: Country): void {
        CovidConfig.get_instance()._countries.push(country)
        CovidConfig.update_storage()
    }

    static remove_country(country: string): void {
        CovidConfig.get_instance()._countries = CovidConfig.get_instance()._countries.filter(
            ({ name }) => name !== country
        )
        CovidConfig.update_storage()
    }

    static get install_ignored() {
        return CovidConfig.get_instance()._install_ignored
    }

    static set install_ignored(value: boolean) {
        CovidConfig.get_instance()._install_ignored = value
        CovidConfig.update_storage()
    }

    static get installed() {
        return CovidConfig.get_instance()._installed
    }

    static set installed(value: boolean) {
        CovidConfig.get_instance()._installed = value
        CovidConfig.update_storage()
    }

    static get first_time() {
        return CovidConfig.get_instance()._first_time
    }

    static set first_time(value: boolean) {
        CovidConfig.get_instance()._first_time = value
        CovidConfig.update_storage()
    }

    private static build(): Config {
        const world_data = CovidData.world_data
        const config: Config = {
            theme: 'light',
            countries: [{ name: 'World', ...world_data }],
            install_ignored: false,
            installed: false,
            first_time: true
        }

        return config
    }

    static to_string(): string {
        return JSON.stringify({
            theme: CovidConfig.theme,
            countries: CovidConfig.countries.map(e => ({ ...e })),
            install_ignored: CovidConfig.install_ignored,
            installed: CovidConfig.installed,
            first_time: CovidConfig.first_time
        })
    }

    private static update_storage() {
        localStorage.setItem(CovidConfig.STORAGE, CovidConfig.to_string())
    }

    static get_instance(): CovidConfig {
        if (CovidConfig.INSTANCE === null) {
            if (storage_available()) {
                const raw_local_config: string = localStorage.getItem(CovidConfig.STORAGE)

                if (raw_local_config) {
                    const local_config: Config = JSON.parse(raw_local_config)

                    CovidConfig.INSTANCE = new CovidConfig(local_config)
                } else {
                    CovidConfig.INSTANCE = new CovidConfig(CovidConfig.build())
                }
            }

            CovidConfig.update_storage()
        }

        return CovidConfig.INSTANCE
    }
}
