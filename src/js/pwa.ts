import CovidConfig from './covid-config'
import ConfirmDialog from './mdc-components/confirm-dialog'
import Dialog from './mdc-components/dialog'

const DEV: boolean = false
const SERVICE_WORKER: string = 'covid-sw.js'

function show_update_notification(worker: ServiceWorker) {
    Dialog.get_instance().open(
        'New Update Found!',
        'A new update was found, please reload the app to download the latest updates.',
        'Reload',
        'Later',
        (action: string) => {
            if (action === 'Reload') {
                worker.postMessage({ action: 'skipWaiting' })
            }
        }
    )
}

async function register() {
    let refreshing: boolean = false

    if ('serviceWorker' in navigator && !DEV) {
        if (!navigator.serviceWorker.controller) {
            const reg: ServiceWorkerRegistration = await navigator.serviceWorker.register(
                SERVICE_WORKER,
                { scope: '/' }
            )
            if (DEV) {
                console.log(`Service worker registered with scope, ${reg.scope}`)
            }
        } else {
            const reg: ServiceWorkerRegistration = await navigator.serviceWorker.getRegistration()
            reg.onupdatefound = () => {
                const worker: ServiceWorker = reg.installing

                worker.onstatechange = function () {
                    if (this.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            show_update_notification(worker)
                        }
                    }
                }
            }

            navigator.serviceWorker.oncontrollerchange = () => {
                if (refreshing) return
                window.location.reload()
                refreshing = true
            }
        }
    }
}

function config_set_ignored() {
    CovidConfig.install_ignored = true
}

function show_installed_message() {
    ConfirmDialog.get_instance().open(
        'App Installed!',
        `Thank you for installing the app. The COVID-19 data is always updated at midnight so make sure to open the app with an internet connection at least once for each day to get the latest data.`,
        'Close',
        () => {
            CovidConfig.first_time = false
        }
    )
}

function show_first_time_message() {
    ConfirmDialog.get_instance().open(
        'Welcome!',
        `This is the COVID-19 progressive web app. If you want to track a country's COVID-19 data, simply use the search bar above to add them to your list.`,
        'Close',
        () => {
            CovidConfig.first_time = false
        }
    )
}

function show_a2hs_message() {
    let deferred_prompt = null

    window.addEventListener('beforeinstallprompt', function handler(evt) {
        if (CovidConfig.install_ignored) return

        evt.preventDefault()
        deferred_prompt = evt

        Dialog.get_instance().open(
            'Add to Home Screen',
            "Add the app in your home screen to get the latest COVID-19 data even if you're offline.",
            'Add',
            'Cancel',
            (action) => {
                if (action === 'Add') {
                    deferred_prompt.prompt()

                    deferred_prompt.userChoice.then(({ outcome }) => {
                        if (outcome === 'accepted') {
                            CovidConfig.installed = true
                        } else {
                            setTimeout(() => show_first_time_message(), 100)
                            config_set_ignored()
                        }

                        window.removeEventListener('beforeinstallprompt', handler)
                        deferred_prompt = null
                    })
                } else {
                    show_first_time_message()
                    config_set_ignored()
                }
            }
        )
    })
}

export function initialize() {
    register()

    const installed: boolean = CovidConfig.installed
    const first_time: boolean = CovidConfig.first_time

    if (installed && first_time) {
        show_installed_message()
    } else if (!installed && first_time) {
        show_a2hs_message()
    }
}

