import { Country } from './covid-data'
import CardMenu from './mdc-components/card-menu'
import { append_child, el, el_create } from './utils'

export default function add_country(country: Country, scroll = true) {
    const { name, confirmed, deaths, recovered } = country

    const card_template = `
      <div class="themed mdc-card">
        <div class=mdc-elevation-overlay></div>
        <div class="mdc-card__actions">
          <span class="card__title">${name}</span>
          <div class="mdc-card__action-icons mdc-menu-surface--anchor">
            <button id=${name}-menu-btn data-name=${name} class="card__menu material-icons mdc-icon-button mdc-card__action mdc-card__action-icon">more_vert</button>
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
                    <span class="card__value confirmed">${confirmed.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div class="mdc-layout-grid__cell--span-4-tablet mdc-layout-grid__cell--span-12-phone mdc-layout-grid__cell--span-6-desktop">
               <div class="mdc-layout-grid__cell">
                  <div class="card__label">Deaths</div>
                </div>
                <div class="mdc-layout-grid__cell">
                  <div class=mdc-layout-grid__cell>
                    <span class="card__value death">${deaths.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div class="mdc-layout-grid__cell--span-4-tablet mdc-layout-grid__cell--span-12-phone mdc-layout-grid__cell--span-6-desktop">
                <div class="mdc-layout-grid__cell">
                  <div class="card__label">Recovered</div>
                </div>
                <div class="mdc-layout-grid__cell">
                  <div class=mdc-layout-grid__cell>
                    <span class="card__value recovered">${recovered.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    const card_cell = el_create('DIV', {
        attributes: {
            id: `${name}-card`,
            innerHTML: card_template
        },
        class_list: ['mdc-layout-grid__cell', 'card-cell']
    })

    append_child('card-container', card_cell)

    CardMenu.get_instance().attach(el(`${name}-menu-btn`))

    if (scroll) {
        card_cell.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
}
