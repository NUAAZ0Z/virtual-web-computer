import Launcher from './launcher'
import Computer from './computer'
import GithubRepo from './github-repo'
import IssueBlog from './issue-blog'
import MusicBox from './music-box'
import Live from './live'
import TrashBin from './trash-bin'

const Apps = [
    Launcher,
    Computer,
    GithubRepo,
    IssueBlog,
    MusicBox,
    Live,
    TrashBin,
]

export default {
    ...Apps,
}
