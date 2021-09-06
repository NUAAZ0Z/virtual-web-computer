import { createStore } from 'vuex'
import apps from './modules/apps'
import createPersistedState from 'vuex-persistedstate'
import wallpapers from './modules/wallpapers'
import { CURRENT_WALLPAPER } from './state.type'

const persistedState = createPersistedState({
    // 设置要持久化的Stata
    paths: [
        // 使用了模块，需要使用完整State路径
        ...[CURRENT_WALLPAPER].map(val => `wallpapers.${val}`),
    ],
})

const store = createStore({
    modules: {
        apps,
        wallpapers,
    },
    plugins: [
        persistedState,
    ],
})

export default store
