/**
 * Availability test from MDN Documentation:
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
 *
 * @format
 */

export default function storage_available() {
    try {
        const storage = window['localStorage']
        const x = '__storage_test__'
        storage.setItem(x, x)
        storage.removeItem(x)
        return true
    } catch (e) {
        const { code, name } = e
        return (
            e instanceof DOMException &&
            (code === 22 ||
                code === 1014 ||
                name === 'QuotaExceededError' ||
                name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            storage &&
            storage.length !== 0
        )
    }
}
