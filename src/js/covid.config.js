const { latest_date } = './covid-data.js'
const { world_data  } = './covid-data.js'

class Country {
    constructor({ name, confirmed, deaths, recovered }) {
        this._name      = name
        this._confirmed = confirmed
        this._deaths    = deaths
        this._recovered = recovered
    }

    get name() { return this._name }
    get confirmed() { return this._confirmed }
    get deaths() { return this._deaths }
    get recovered() { return this._recovered }
}

class CovidConfig {
    constructor(config) {
        if (!config) {
            this._theme = 'light'

            this._countries = [(async function() {
                const data = await world_data()

                return new Country({name: 'World', ...data})
            })()]

            this._latest_date = (async function() {
                return await latest_date()
            })()
        } else {
            const { theme, countries, latest_date } = config

            this._theme = theme
            this._countries = countries
            this._latest_date = latest_date
        }
    }

    get theme() { return this._theme }
    get countries() { return this._countries } 
    get latest_date() { return this._latest_date }
}
