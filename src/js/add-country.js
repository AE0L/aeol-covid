import { el               } from './utils.js'
import { el_create        } from './utils.js'
import { append_child     } from './utils.js'
import { add_to_countries } from './covid-config.js'
import * as card_menu from './mdc-components/card-menu'

export default function add_country(country, confirmed, deaths, recovered, scroll=true) {
    confirmed = confirmed.toLocaleString()
    deaths    = deaths.toLocaleString()
    recovered = recovered.toLocaleString()

    const html = `
      <div class="themed mdc-card">
        <div class=mdc-elevation-overlay></div>
        <div class="mdc-card__actions">
          <span class="card__title">${country}</span>
          <div class="mdc-card__action-icons mdc-menu-surface--anchor">
            <button id=${country}-menu-btn data-country=${country} class="card__menu material-icons mdc-icon-button mdc-card__action mdc-card__action-icon">more_vert</button>
          </div>
        </div>
        
        <div id=world-data class="mdc-card__actions">
          <div class="card__data-grid mdc-layout-grid">
            <div class="mdc-layout-grid__inner">
              <div class="mdc-layout-grid__cell--span-12-tablet mdc-layout-grid__cell--span-12-phone mdc-layout-grid__cell--span-12-desktop">
                <div class="mdc-layout-grid__cell">
                  <div class="card__label">Confirmed</div>
                </div>
                <div class="mdc-layout-grid__cell">
                  <div class=mdc-layout-grid__cell>
                    <span class="card__value confirmed">${confirmed}</span>
                  </div>
                </div>
              </div>
              <div class="mdc-layout-grid__cell--span-4-tablet mdc-layout-grid__cell--span-12-phone mdc-layout-grid__cell--span-6-desktop">
               <div class="mdc-layout-grid__cell">
                  <div class="card__label">Deaths</div>
                </div>
                <div class="mdc-layout-grid__cell">
                  <div class=mdc-layout-grid__cell>
                    <span class="card__value death">${deaths}</span>
                  </div>
                </div>
              </div>
              <div class="mdc-layout-grid__cell--span-4-tablet mdc-layout-grid__cell--span-12-phone mdc-layout-grid__cell--span-6-desktop">
                <div class="mdc-layout-grid__cell">
                  <div class="card__label">Recovered</div>
                </div>
                <div class="mdc-layout-grid__cell">
                  <div class=mdc-layout-grid__cell>
                    <span class="card__value recovered">${recovered}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    const card_cell = el_create('div', {
      attributes: { 
        id: `${country}-card`,
        innerHTML: html 
      },
      classList:  [ 'mdc-layout-grid__cell', 'card-cell']
    })

    append_child('card-container', card_cell)

    card_menu.attach(el(`${country}-menu-btn`))

    if (scroll) {
      card_cell.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
}
