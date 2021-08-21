import GithubRepo from './components/GithubRepo.vue'

export default {
    name: 'github-repo',
    title: 'Repos',
    icon: 'github.svg',
    component: GithubRepo,
    dockLocation: 'center',
    enableMenu: false,
    enableMaximize: false,
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