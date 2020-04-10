import { 
  el,
  el_create,
  append_child,
} from './utils.js'

export default function add_country(country, confirmed, deaths, recovered) {
    confirmed = confirmed.toLocaleString()
    deaths    = deaths.toLocaleString()
    recovered = recovered.toLocaleString()
    
    const html = `
      <div class="themed mdc-card">
        <div class=mdc-elevation-overlay></div>
        <div class="mdc-card__actions">
          <span class="card__title">${country}</span>
          <div class="mdc-card__action-icons mdc-menu-surface--anchor">
            <button id=button-menu-world class="card__menu material-icons mdc-icon-button mdc-card__action mdc-card__action-icon">more_vert</button>
            <div id=menu-${country} class="mdc-menu mdc-menu-surface">
              <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation=vertical tabindex="-1">
                <li class="mdc-list-item" role=menuitem>
                  <span class=mdc-list-item__text>Remove</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div id=world-data class="mdc-card__actions">
          <div class="card__data-grid mdc-layout-grid">
            <div class="mdc-layout-grid__inner">
              <div class="mdc-layout-grid__cell--span-12-tablet mdc-layout-grid__cell--span-12-phone mdc-layout-grid__cell--span-4-desktop">
                <div class="mdc-layout-grid__cell">
                  <div class="card__label">Confirmed Cases</div>
                </div>
                <div class="mdc-layout-grid__cell">
                  <div class=mdc-layout-grid__cell>
                    <span class="card__value confirmed">${confirmed}</span>
                  </div>
                </div>
              </div>
              <div class="mdc-layout-grid__cell--span-4-tablet mdc-layout-grid__cell--span-12-phone mdc-layout-grid__cell--span-4-desktop">
               <div class="mdc-layout-grid__cell">
                  <div class="card__label">Deaths</div>
                </div>
                <div class="mdc-layout-grid__cell">
                  <div class=mdc-layout-grid__cell>
                    <span class="card__value death">${deaths}</span>
                  </div>
                </div>
              </div>
              <div class="mdc-layout-grid__cell--span-4-tablet mdc-layout-grid__cell--span-12-phone mdc-layout-grid__cell--span-4-desktop">
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
      attributes: { innerHTML: html },
      classList:  [ 'mdc-layout-grid__cell', 'mdc-layout-grid__cell--span-12' ]
    })

    append_child('card-container', card_cell)

    card_cell.scrollIntoView({ behavior: 'smooth', block: 'center' })
}