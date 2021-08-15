import { ref } from 'vue'

export const WINDOW_NORMAL = 0x1
export const WINDOW_MINIMIZED = 0x1 << 1
export const WINDOW_MAXIMIZED = 0x1 << 2


export function useWindowStateManager() {
    let windowZIndex = 10000
    const windowStatus = ref(WINDOW_NORMAL)
    const oldWindowStatus = ref(WINDOW_NORMAL)

    const minimizeWindow = () => {
        windowStatus.value = WINDOW_MINIMIZED
    }

    const maximizeWindow = () => {
        windowStatus.value = WINDOW_MAXIMIZED
    }

    const unMaximizeWindow = () => {
        windowStatus.value = WINDOW_NORMAL
    }

    const unMinimizeWindow = () => {
        windowStatus.value = oldWindowStatus.value
    }

    const updateZIndex = () => {
        return ++windowZIndex
    }

    return {
        windowStatus,
        oldWindowStatus,
        updateZIndex,
        minimizeWindow,
        maximizeWindow,
        unMaximizeWindow,
        unMinimizeWindow,
    }
}
