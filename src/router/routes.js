import Desktop from '../views/Desktop.vue'

export default [
    {
        path: '/',
        redirect: '/desktop',
    },
    {
        path: '/desktop',
        name: 'desktop',
        component: Desktop,
    },
]
