const fetch_body = (method, js) => ({
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(js)
})

async function covid_world() {
    const res  = await fetch('/global')
    const data = await res.json()

    return data
}

async function covid_country(country) {
    const res  = await fetch('/country', fetch_body('POST', { country: country }))
    const data = await res.json()

    return data
}
    
async function covid_countries(countries) {
    const res  = await fetch('/countries', fetch_body('POST', { countries: countries })) 
    const data = await res.json()

    return data
}

async function covid_latest_date() {
    const res  = await fetch('./latest-date')
    const data = res.json()

    return new Date(data)
}

export default {
    world:       covid_world,
    country:     covid_country,
    countries:   covid_countries,
    latest_date: covid_latest_date
}