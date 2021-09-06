import { createStore } from 'vuex'
import apps from './modules/apps'
import wallpapers from './modules/wallpapers'

const store = createStore({
    modules: {
        apps,
        wallpapers,
    },
})

export default store
