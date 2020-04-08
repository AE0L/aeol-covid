const themes = {
    light: {
        primary: '#121212',
        secondary: '#43A047',
        background: '#FFF',
        surface: '#FFF',
        error: '#b00020',
        "on-primary": '#fff',
        "on-secondary": '#fff',
        "on-surface": '#000',
        "on-errors": '#fff',
        death: '#e53935',
        recovered: '#43A047',
        'label-weight': 'bold',
        text: {
            primary: {
                background: 'rgba(0, 0, 0, 0.87)',
                light: 'rgba(0, 0, 0, 0.87)',
                darK: 'white',
            },

            secondary: {
                background: 'rgba(0, 0, 0, 0.54)',
                light: 'rgba(0, 0, 0, 0.54)',
                dark: 'rgba(255, 255, 255, 0.7)',
            },

            hint: {
                background: 'rgba(0, 0, 0, 0.38)',
                light: 'rgba(0, 0, 0, 0.38)',
                dark: 'rgba(255, 255, 255, 0.5)'
            },

            disabled: {
                background: 'rgba(0, 0, 0, 0.38)',
                light: 'rgba(0, 0, 0, 0.38)',
                dark: 'rgba(255, 255, 255, 0.5)',
            },

            icon: {
                background: 'rgba(0, 0, 0, 0.38)',
                light: 'rgba(0, 0, 0, 0.38)',
                dark: 'rgba(255, 255, 255, 0.5)',
            }
        }
    },

    dark: {
        primary: '#121212',
        secondary: '#EF5350',
        background: '#121212',
        surface: '#212121',
        error: '#b00020',
        'on-primary': '#FFF',
        'on-secondary': '#000',
        'on-surface': '#FFF',
        'on-errors': '#FFF',
        death: '#EF5350',
        recovered: '#66BB6A',
        'label-weight': 'normal',
        text: {
            primary: {
                background: 'white',
                light: 'rgba(0, 0, 0, 0.87)',
                darK: 'white',
            },

            secondary: {
                background: 'rgba(255, 255, 255, 0.5)',
                light: 'rgba(0, 0, 0, 0.54)',
                dark: 'rgba(255, 255, 255, 0.7)',
            },

            hint: {
                background: 'rgba(255, 255, 255, 0.5)',
                light: 'rgba(0, 0, 0, 0.38)',
                dark: 'rgba(255, 255, 255, 0.5)'
            },

            disabled: {
                background: 'rgba(255, 255, 255, 0.5)',
                light: 'rgba(0, 0, 0, 0.38)',
                dark: 'rgba(255, 255, 255, 0.5)',
            },

            icon: {
                background: 'rgba(255, 255, 255, 0.5)',
                light: 'rgba(0, 0, 0, 0.38)',
                dark: 'rgba(255, 255, 255, 0.5)',
            }
        }
    }
}

const e       = i => document.getElementById(i)
const app_bar = e('top-app-bar')

export default function change_theme(theme) {
    const root = document.documentElement
    const set_style = (p, v) => root.style.setProperty(p, v)
    const use_theme = themes[theme]

    for (const prop of Object.keys(use_theme)) {
        if (prop !== 'text') {
            set_style(`--mdc-theme-${prop}`, use_theme[prop])
        }
    }

    for (const prop of Object.keys(use_theme.text)) {
        const text = use_theme.text[prop]

        for (const on_prop of Object.keys(text)) {
            set_style(`--mdc-theme-text-${prop}-on-${on_prop}`, text[on_prop])
        }
    }

    const curr_theme = theme === 'dark' ? 'light' : 'dark'

    app_bar.classList.replace(`${curr_theme}-theme`, `${theme}-theme`)
}