async function covid_world() {
    const res  = await fetch('http://localhost:8080/global')
    const data = await res.json()

    return data
}

async function covid_country(country) {
    const res  = await fetch('http://localhost:8080/country', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ country: country })
    })
    const data = await res.json()

    return data
}

const e = (i) => document.getElementById(i)

covid_world().then(({ confirmed, deaths, recovered }) => {
    e('world-con').innerText = confirmed.toLocaleString()
    e('world-dea').innerText = deaths.toLocaleString()
    e('world-rec').innerText = recovered.toLocaleString()
})

covid_country('PHL').then(({ confirmed, deaths, recovered }) => {
    e('ph-con').innerText = confirmed.toLocaleString()
    e('ph-dea').innerText = deaths.toLocaleString()
    e('ph-rec').innerText = recovered.toLocaleString()
})
