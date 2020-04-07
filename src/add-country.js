export default function add_country(country, confirmed, deaths, recovered) {
    const html = `
    <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
        <div id=card-${country} class="mdc-theme--surface mdc-card">
          <div class="mdc-card__actions">
            <span class="mdc-theme--text-primary-on-dark">${country}</span>
            <div class="mdc-card__action-icons">
              <button class="material-icons mdc-icon-button mdc-card__action mdc-card__action-icon">more_vert</button>
            </div>
          </div>
          
          <div class="mdc-card__actions">
            <div class="card__data-grid mdc-layout-grid">
              <div class="mdc-layout-grid__inner">
                <div class="mdc-layout-grid__cell--span-12-tablet mdc-layout-grid__cell--span-12-phone mdc-layout-grid__cell--span-4-desktop">
                  <div class="mdc-layout-grid__cell">
                    <div class="card__label">Confirmed Cases</div>
                  </div>
                  <div class="mdc-layout-grid__cell">
                    <div class=mdc-layout-grid__cell>
                      <span class="card__value mdc-theme--text-primary-on-dark">${confirmed}</span>
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
      </div>
    `

    const card_cell = document.createElement('div')

    card_cell.classList.add('mdc-layout-grid__cell', 'mdc-layout-grid__cell--span-12')

    card_cell.innerHTML = html

    document.getElementById('card-container').appendChild(card_cell)
}