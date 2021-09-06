import Applications from '../../apps'
import { ACTIVE_APP, APP_MOUNTED_NAMES } from '../state.type'
import {
    APP_AT_DOCK_CENTER,
    APP_AT_DOCK_LAUNCHER,
    APP_AT_DOCK_TRAY,
    APP_AT_DESKTOP,
    APP_MOUNTED,
    GET_APP,
} from '../getter.type'
import { CLEAR_ACTIVE_APP, MOUNT_APP, UNMOUNT_APP } from '../mutation.type'
import { INITIALIZE_APP_STATE } from '../action.type'

const apps = Object.values(Applications)

const state = {
    [ACTIVE_APP]: null,
    [APP_MOUNTED_NAMES]: [],
}

const getters = {
    [GET_APP]: () => (appName) => {
        for (const app of apps) {
            if (app.name === appName) {
                return app
            }
        }
    },
    [APP_AT_DESKTOP]: () => apps.filter(app => app.desktop !== false),
    [APP_AT_DOCK_LAUNCHER]: () => apps.filter(app => app.dockLocation === 'left'),
    [APP_AT_DOCK_CENTER]: () => apps.filter(app => app.dockLocation === 'center'),
    [APP_AT_DOCK_TRAY]: () => apps.filter(app => app.dockLocation === 'right'),
    [APP_MOUNTED]: ((state, getters) => {
            return state[APP_MOUNTED_NAMES].map(appName => getters[GET_APP](appName))
        }
    ),
}

const mutations = {
    [CLEAR_ACTIVE_APP](state) {
        state[ACTIVE_APP] = ''
    },
    [MOUNT_APP](state, appName) {
        // 把新挂载的添加到 appMountedNames
        const index = state[APP_MOUNTED_NAMES].indexOf(appName)
        if (index === -1) {
            state[APP_MOUNTED_NAMES].push(appName)
        }
        // 设置当前激活的应用
        state[ACTIVE_APP] = appName
    },
    [UNMOUNT_APP](state, appName) {
        // 删除appMountedNames中的一个元素
        const index = state[APP_MOUNTED_NAMES].indexOf(appName)
        if (index > -1) {
            state[APP_MOUNTED_NAMES].splice(index, 1)
        }
    },
}

const actions = {
    [INITIALIZE_APP_STATE]({ commit, state }, payload) {
        const { [ACTIVE_APP]: activeApp, [APP_MOUNTED_NAMES]: appMountedNames } = payload
        if (appMountedNames) {
            state[APP_MOUNTED_NAMES] = appMountedNames
        }
        if (activeApp) {
            state[ACTIVE_APP] = activeApp
        }
    },
}

export default {
    namespaced: false,
    state,
    getters,
    mutations,
    actions,
}
