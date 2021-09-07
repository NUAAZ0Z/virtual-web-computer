import Desktop from '../views/Desktop.vue'
import Blog from '../views/Blog.vue'

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
    {
        path: '/blog',
        name: 'blog',
        component: Blog,
    },
]
