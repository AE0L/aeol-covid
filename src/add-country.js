export default function add_country(country, confirmed, deaths, recovered) {
  console.log(country, confirmed, deaths, recovered)
    const html = `
        <div class="mdc-theme--surface mdc-card">
          <div class="mdc-card__actions">
            <span class="card__title">${country}</span>
            <div class="mdc-card__action-icons mdc-menu-surface--anchor">
              <button id=button-menu-${country} class="material-icons mdc-icon-button mdc-card__action mdc-card__action-icon">more_vert</button>
              <div id=menu-${country} class="mdc-menu mdc-menu-surface">
                <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation=vertical tabindex="-1">
                  <li class="mdc-list-item" role=menuitem>
                    <span class=mdc-list-item__text>Remove</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div id=world-data-container class="mdc-card__actions">
            <div class="card__data-grid mdc-layout-grid">
              <div class="mdc-layout-grid__inner">
                <div class="mdc-layout-grid__cell--span-12-tablet mdc-layout-grid__cell--span-12-phone mdc-layout-grid__cell--span-4-desktop">
                  <div class="mdc-layout-grid__cell">
                    <div class="card__label mdc-theme--text-secondary-on-background">Confirmed Cases</div>
                  </div>
                  <div class="mdc-layout-grid__cell">
                    <div class=mdc-layout-grid__cell>
                      <span class="card__value confirmed">${confirmed.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div class="mdc-layout-grid__cell--span-4-tablet mdc-layout-grid__cell--span-12-phone mdc-layout-grid__cell--span-4-desktop">
                 <div class="mdc-layout-grid__cell">
                    <div class="card__label mdc-theme--text-secondary-on-background">Deaths</div>
                  </div>
                  <div class="mdc-layout-grid__cell">
                    <div class=mdc-layout-grid__cell>
                      <span class="card__value death">${deaths.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div class="mdc-layout-grid__cell--span-4-tablet mdc-layout-grid__cell--span-12-phone mdc-layout-grid__cell--span-4-desktop">
                  <div class="mdc-layout-grid__cell">
                    <div class="card__label mdc-theme--text-secondary-on-background">Recovered</div>
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

    const card_cell = document.createElement('div')

    card_cell.classList.add('mdc-layout-grid__cell', 'mdc-layout-grid__cell--span-12')

    card_cell.innerHTML = html

    document.getElementById('card-container').appendChild(card_cell)
}