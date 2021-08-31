import IssueBlog from './components/IssueBlog.vue'

export default {
    name: 'issue-blog',
    title: 'Blog',
    icon: 'reader.svg',
    component: IssueBlog,
    dockLocation: 'center',
    enableMenu: false,
    enableMaximize: true,
    transparentTitleBar: true,
    repos: [
        {
            owner: 'SUDOCS',
            repo: 'static-file',
        },
        {
            owner: 'flutter',
            repo: 'flutter',
        },
    ],
}