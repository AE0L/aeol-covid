function prop(p: string, o: object, v?: any): any {
    if (v) {
        o[p] = v
    } else {
        return o[p]
    }
}

export function el(id: string) {
    return document.getElementById(id)
}

export function el_query(q: string, e?: HTMLElement): HTMLElement {
    if (e) {
        return e.querySelector(q)
    }

    return document.querySelector(q)
}

export function el_queryall(q: string, e?: HTMLElement) {
    if (e) {
        return Array.from(e.querySelectorAll(q))
    }

    return Array.from(document.querySelectorAll(q))
}

export function el_text(e: HTMLElement, t?: string) {
    if (t) {
        prop('innerText', e, t)
    } else {
        return prop('innerText', e)
    }
}

export function append_child(p: HTMLElement, ...e: HTMLElement[]): null
export function append_child(p: string, ...e: HTMLElement[]): null
export function append_child(p: any, ...e: HTMLElement[]) {
    if (typeof p === 'object') {
        for (const _e of e) {
            p.appendChild(_e)
        }
    } else if (typeof p === 'string') {
        const _p: HTMLElement = el(p)

        for (const _e of e) {
            _p.appendChild(_e)
        }
    }
}

export function remove_child(p: HTMLElement, ...e: HTMLElement[]): null
export function remove_child(p: string, ...e: HTMLElement[]): null
export function remove_child(p: any, ...e: HTMLElement[]) {
    if (typeof p === 'object') {
        for (const _e of e) {
            p.removeChild(_e)
        }
    } else if (typeof p === 'string') {
        const _p: HTMLElement = el(p)

        for (const _e of e) {
            _p.removeChild(_e)
        }
    }
}

interface element_property {
    attributes?: object,
    class_list?: string[]
}

export function el_create(e: string, o?: element_property): HTMLElement {
    const _e: HTMLElement = document.createElement(e)

    if (o) {
        const { attributes: a, class_list: c } = o

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

export function clear_children(e: HTMLElement) {
    while (e.lastElementChild) {
        e.removeChild(e.lastElementChild)
    }
}

export function style_apply(s: string, ...e: HTMLElement[]) {
    for (const _e of e) {
        _e.classList.add(s)
    }
}

export function style_remove(s: string, ...e: HTMLElement[]) {
    for (const _e of e) {
        _e.classList.remove(s)
    }
}

export function style_replace(o: string, r: string, ...e: HTMLElement[]) {
    for (const _e of e) {
        _e.classList.replace(o, r)
    }
}
