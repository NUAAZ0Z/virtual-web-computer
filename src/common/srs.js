import Axios from 'axios'

// SRS API 域名
const srsApiHost = 'srs-api.sudocs.com'
// 历史视频记录 API 域名
const srsHookHost = 'srs-hooks.sudocs.com'
// 创建 Axios 实例
const http = Axios.create({})

// 请求推流
const publishUrl = `//${srsApiHost}/rtc/v1/publish/`
// 终止会话
const nackUrl = `//${srsApiHost}/rtc/v1/nack/`
// 请求播放
const playUrl = `//${srsApiHost}/rtc/v1/play/`

/**
 * 请求 SRS API
 * @param url API 地址
 * @param liveApp 直播 app
 * @param liveStream 直播 stream
 * @param offer PeerConnection Offer
 * @returns {Promise<any>}
 */
const requestLiveSession = async (url, liveApp, liveStream, offer) => {
    const data = {
        api: `https:${url}`,
        tid: Number(parseInt(new Date().getTime() * Math.random() * 100)).toString(16).substr(0, 7),
        streamurl: `webrtc://${srsApiHost}/${liveApp}/${liveStream}`,
        clientip: null,
        sdp: offer.sdp,
    }
    const { data: session } = await http.post(url, data)
    return session
}

/**
 * 创建推流
 * @param liveApp 直播 app
 * @param liveStream 直播 stream
 * @param videoSource 直播视频来源，可以指定摄像头或者屏幕
 * @returns Object
 */
export const createRtcPublisher = (liveApp, liveStream, videoSource) => {
    const self = {}

    let sessionId = null

    self.publish = async (constraints = { audio: true }) => {
        self.pc = new RTCPeerConnection(null)
        self.stream = new MediaStream()

        // 只发送
        self.pc.addTransceiver('audio', { direction: 'sendonly' })
        self.pc.addTransceiver('video', { direction: 'sendonly' })

        let s
        if (videoSource === 'camera') {
            // 视频来源为摄像头
            s = await navigator.mediaDevices.getUserMedia(constraints)
        } else {
            // 视频来源为屏幕
            s = await navigator.mediaDevices.getDisplayMedia(constraints)
        }

        // 关联多媒体流
        s.getTracks().forEach((track) => {
            self.pc.addTrack(track)
            self.stream.addTrack(track)
        })

        // 创建本地的 Offer
        const offer = await self.pc.createOffer()
        await self.pc.setLocalDescription(offer)

        // 请求 SRS 的推流接口，协商信息
        const session = await requestLiveSession(publishUrl, liveApp, liveStream, offer)
        if (session) {
            // 协商成功，设立远程的会话描述信息，当开始录制时，将多媒体流推向远程服务器
            await self.pc.setRemoteDescription(
                new RTCSessionDescription({
                    type: 'answer',
                    sdp: session.sdp,
                }),
            )
            sessionId = session.sessionid
            return session
        }
    }

    // 断开停止推流
    self.drop = async () => {
        await http.get(`${nackUrl}?drop=1&username=${sessionId}`)
        self.pc.close()
        self.pc = null
        self.stream.getTracks().forEach(track => {
            track.stop()
        })
    }

    return self
}


export const createRtcPlayer = (liveApp, liveStream) => {

    const self = {}
    let sessionId = null

    self.play = async () => {
        self.pc = new RTCPeerConnection()
        self.stream = new MediaStream()

        // 只接受直播数据
        self.pc.addTransceiver('audio', { direction: 'recvonly' })
        self.pc.addTransceiver('video', { direction: 'recvonly' })

        // 绑定直播数据流
        self.pc.ontrack = (event) => {
            self.stream.addTrack(event.track)
        }

        // 创建 Offer，指定为本地描述信息
        const offer = await self.pc.createOffer()
        await self.pc.setLocalDescription(offer)

        // 请求 SRS API 播放直播，协商直播信息
        const session = await requestLiveSession(playUrl, liveApp, liveStream, offer)

        if (session) {
            // 协商成功，设立会话的远程描述信息
            await self.pc.setRemoteDescription(new RTCSessionDescription({
                type: 'answer',
                sdp: session.sdp,
            }))
            sessionId = session.sessionid
        }
    }

    // 拆除连接
    self.drop = async () => {
        await http.get(`${nackUrl}?drop=1&username=${sessionId}`)
        self.pc.close()
        self.pc = null
        self.stream.getTracks().forEach(track => {
            track.stop()
        })
    }
    return self
}

export const srsApi = {
    // 请求 SRS API 获取直播数据
    fetchLives: async () => {
        return await http.get(`//${srsApiHost}/api/v1/streams/`)
    },
    // 请求历史视频数据API
    fetchHistories: async () => {
        return await http.get(`//${srsHookHost}/v1/dvr`)
    },
}