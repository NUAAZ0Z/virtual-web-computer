import { CURRENT_WALLPAPER } from '../state.type'
import { SWITCH_WALLPAPER } from '../mutation.type'

const wallpapers = Object.values(import.meta.glob('../../assets/wallpapers/*'))

const state = {
    [CURRENT_WALLPAPER]: 0,
}

const getters = {
    [CURRENT_WALLPAPER]: (state) => wallpapers[state[CURRENT_WALLPAPER]](),
}

const mutations = {
    [SWITCH_WALLPAPER](state) {
        state[CURRENT_WALLPAPER] += 1
        state[CURRENT_WALLPAPER] %= wallpapers.length
    },
}

export default {
    namespaced: false,
    state,
    getters,
    mutations,
}
