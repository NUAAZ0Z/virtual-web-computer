import { createStore } from 'vuex'
import apps from './modules/apps'

const store = createStore({
    modules: {
        apps,
    },
})

export default store