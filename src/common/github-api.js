import Axios from 'axios'

const instance = Axios.create({
    timeout: 1000 * 8,
    baseURL: '//api-github.webmirror.workers.dev',
})

instance.interceptors.response.use((res) => {
    return Promise.resolve(res)
}, (error) => {
    return Promise.resolve(null)
})

export const getContent = async ({ owner, repo, path = '' }) => {
    return await instance.get(`/repos/${owner}/${repo}/contents/${path}`)
}
