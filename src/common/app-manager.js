import { INITIALIZE_APP_STATE } from '../store/action.type'
import { MOUNT_APP, UNMOUNT_APP } from '../store/mutation.type'
import { ACTIVE_APP, APP_MOUNTED_NAMES } from '../store/state.type'
import store from '../store'
import router from '../router'

// URL中的查询参数键名
const appStateKey = 'v'

export function useAppManager() {

    // 反序列化URL上的查询参数 appStateKey
    const deserializeRouteKey = (route) => {
        if (route.query[appStateKey]) {
            return JSON.parse(window.atob(route.query[appStateKey].toString()))
        }
    }

    // 序列化查询参数
    const serializeRouteKey = (config) => {
        return window.btoa(JSON.stringify(config))
    }

    // App状态变化时，如挂载、卸载App，更新URL参数
    const updateRouteQuery = async () => {
        const config = {
            [APP_MOUNTED_NAMES]: store.state.apps[[APP_MOUNTED_NAMES]],
            [ACTIVE_APP]: store.state.apps[[ACTIVE_APP]],
        }
        const key = serializeRouteKey(config)
        await router.replace({
            name: 'desktop',
            query: {
                [appStateKey]: key,
            },
        })
    }

    // 根据URL参数设置State
    const initializeAppState = async () => {
        const config = deserializeRouteKey(router.currentRoute.value)
        if (config) {
            await store.dispatch(INITIALIZE_APP_STATE, config)
        }
    }

    // 挂载 App，注意传入的是完整 App 配置
    const mountApp = async (app) => {
        if (app.component) {
            await store.commit(MOUNT_APP, app.name)
            await updateRouteQuery()
        } else {
            await router.push({
                name: app.route,
            })
        }
    }

    // 卸载 App
    const unmountApp = async (appName) => {
        store.commit(UNMOUNT_APP, appName)
        await updateRouteQuery()
    }

    return {
        initializeAppState,
        mountApp,
        unmountApp,
    }
}
