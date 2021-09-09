import Desktop from '../views/Desktop.vue'
import Blog from '../views/Blog.vue'
import { ROUTE_BLOG, ROUTE_DESKTOP } from './route.name'

export const routes = [
    {
        path: '/',
        redirect: '/desktop',
    },
    {
        path: '/desktop',
        name: ROUTE_DESKTOP,
        component: Desktop,
    },
    {
        path: '/blog',
        name: ROUTE_BLOG,
        component: Blog,
    },
]
