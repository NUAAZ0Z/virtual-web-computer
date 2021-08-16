import { ref } from 'vue'
import { useStore } from 'vuex'
import { CLEAR_ACTIVE_APP } from '../store/mutation.type'

export const WINDOW_NORMAL = 0x1
export const WINDOW_MINIMIZED = 0x1 << 1
export const WINDOW_MAXIMIZED = 0x1 << 2

let windowZIndex = 10000

export function useWindowStateManager() {
    const windowStatus = ref(WINDOW_NORMAL)
    const oldWindowStatus = ref(WINDOW_NORMAL)
    const store = useStore()

    const minimizeWindow = () => {
        oldWindowStatus.value = windowStatus.value
        windowStatus.value = WINDOW_MINIMIZED
        store.commit(CLEAR_ACTIVE_APP)
    }

    const maximizeWindow = () => {
        windowStatus.value = WINDOW_MAXIMIZED
    }

    const unMaximizeWindow = () => {
        windowStatus.value = WINDOW_NORMAL
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
    }
}
