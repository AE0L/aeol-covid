const fetch_body = (method, js) => ({
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(js)
})

async function world_data() {
    const res  = await fetch('/global')
    const data = await res.json()

    return data
}

async function country_data(country) {
    const res  = await fetch('/country', fetch_body('POST', { country: country }))
    const data = await res.json()

    return data
}
    
async function countries_data(countries) {
    const res  = await fetch('/countries', fetch_body('POST', { countries: countries })) 
    const data = await res.json()

    return data
}

async function latest_date() {
    const res  = await fetch('./latest-date')
    const data = res.json()

    return data
}

async function country_list() {
    const res  = await fetch('./country-list')
    const data = await res.json()

    return data
}

export { world_data, country_data, countries_data, country_list, latest_date }
