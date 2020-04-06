async function covid_world() {
    const res  = await fetch('http://localhost:8080/global')
    const data = await res.json()

    return data
}

async function covid_country(country) {
    const res = await fetch('http://localhost:8080/country', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ country: country })
    })
    const data = await res.json()

    return data
}

async function covid_countries(countries) {
    const res = await fetch('http://localhost:8080/countries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ countries: countries })
    }) 

    const data = await res.json()

    return data
}

const e = (i) => document.getElementById(i)

covid_world().then(res => {
    const { confirmed, deaths, recovered } = res

    e('world-confirmed').innerText = confirmed.toLocaleString()
    e('world-deaths').innerText    = deaths.toLocaleString()
    e('world-recovered').innerText = recovered.toLocaleString()
})
