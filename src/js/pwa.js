/** @format */

import * as dialog from './mdc-components/dialog'
import * as confirm from './mdc-components/confirm-dialog'
import * as config from './covid-config'

const DEV = false

function show_update_notification(worker) {
    dialog.open(
        'New Update Found!',
        'A new update was found, please reload the app to download the latest updates.',
        'Reload',
        'Later',
        () => worker.postMessage({ action: 'skipWaiting' })
    )
}

function register() {
    let refreshing = false

    if ('serviceWorker' in navigator && !DEV) {
        if (!navigator.serviceWorker.controller) {
            navigator.serviceWorker.register('covid-sw.js', { scope: '/' }).then(reg => {
                if (DEV) {
                    console.log(`Service worker registered with scope, ${reg.scope}`)
                }
            })
        } else {
            navigator.serviceWorker.getRegistration().then(reg => {
                reg.onupdatefound = () => {
                    const worker = reg.installing

                    worker.onstatechange = () => {
                        if (worker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                show_update_notification(worker)
                            }
                        }
                    }
                }
            })

            navigator.serviceWorker.oncontrollerchange = () => {
                if (refreshing) return
                window.location.reload()
                refreshing = true
            }
        }
    }
}

function config_set_ignored(ignored) {
    config.update_config({ install_ignored: ignored })
}

function show_installed_message() {
    confirm.open(
        'App Installed!',
        `Thank you for installing the app. The COVID-19 data is always updated at midnight so make sure to open the app with an internet connection at least once for each day to get the latest data.`,
        'Close',
        () => config.update_config({ first_time: false })
    )
}

function show_first_time_message() {
    confirm.open(
        'Welcome!',
        `This is the COVID-19 progressive web app. If you want to track a country's COVID-19 data, simply use the search bar above to add them to your list.`,
        'Close',
        () => config.update_config({ first_time: false })
    )
}

function show_add_to_home_screen_message() {
    let deferred_prompt = null

    window.addEventListener('beforeinstallprompt', function handler(e) {
        if (config.get_config().install_ignored) return

        e.preventDefault()
        deferred_prompt = e

        dialog.open(
            'Add to Home Screen',
            "Add the app in your home screen to get the latest COVID-19 data even if you're offline.",
            'Add',
            'Cancel',
            () => {
                deferred_prompt.prompt()

                deferred_prompt.userChoice.then(({ outcome }) => {
                    if (outcome === 'accepted') {
                        config.update_config({ installed: true })
                    } else {
                        setTimeout(() => show_first_time_message(), 100)
                        config_set_ignored(true)
                    }

                    window.removeEventListener('beforeinstallprompt', handler)
                    deferred_prompt = null
                })
            },
            () => {
                show_first_time_message()
                config_set_ignored(true)
            },
            () => {
                show_first_time_message()
                config_set_ignored(true)
            }
        )
    })
}

export function initialize() {
    register()

    if(config.get_config().installed && config.get_config().first_time) {
        show_installed_message()
    } else if (!config.get_config().installed && config.get_config().first_time) {
        show_add_to_home_screen_message()
    }
}
