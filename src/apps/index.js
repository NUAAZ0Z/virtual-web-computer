import Launcher from './launcher'
import Computer from './computer'
import GithubRepo from './github-repo'
import IssueBlog from './issue-blog'
import TrashBin from './trash-bin'

const Apps = [
    Launcher,
    Computer,
    GithubRepo,
    IssueBlog,
    TrashBin,
]

export default {
    ...Apps,
}
