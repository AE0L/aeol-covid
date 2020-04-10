const _prop       = (p, e, v) => { e[p] = v }
const _prop_value = (p, e) => e[p]

export const el           = (i) => document.getElementById(i)
export const el_query     = (q) => document.querySelector(q)
export const el_queryall  = (q) => document.querySelectorAll(q)
export const el_text      = (e, t=null) => t ? _prop('innerText', e, t) : _prop_value('innerText', e)

export const el_create = (e, o={attributes:null,classList:null}) => {
    const _e = document.createElement(e)

    if (o) {
        const { attributes: a, classList: c } = o

        if (a) {
            for (const p in a) {
                _e[p] = a[p]
            }
        }

        if (c) {
            _e.classList.add(...c)
        }
    }

    return _e
}

export const append_child = (p, ...e) => {
    if (p instanceof HTMLElement) {
        p.appendChild(e)
    } else if (typeof p === 'string') {
        const pel = el(p)
        e.forEach(c => pel.appendChild(c))
    }
}

export const style_apply = (s, ...e) => {
    for (const _e of e) {
        _e.classList.add(s)
    }
}

export const style_remove = (s, ...e) => {
    for (const _e of e) {
        _e.classList.remove(s)
    }
}

export const performance_check = async (fn) => {
    const s = performance.now()
    await fn()
    const e = performance.now()

    console.group('Performance Check')
    console.log(`FUNCTION:  ${fn.name}`)
    console.log(`EXECUTION: ${(e - s).toFixed(2)}ms`)
    console.groupEnd('Performance Check')
}
