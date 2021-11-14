import Axios from 'axios'

const srsApiHost = 'srs-api.sudocs.com'
const srsHookHost = 'srs-hooks.sudocs.com'
const http = Axios.create({})

const publishUrl = `//${srsApiHost}/rtc/v1/publish/`
const nackUrl = `//${srsApiHost}/rtc/v1/nack/`
const playUrl = `//${srsApiHost}/rtc/v1/play/`

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

export const createRtcPublisher = (liveApp, liveStream) => {
    const self = {}

    const publishUrl = `//${srsApiHost}/rtc/v1/publish/`
    const nackUrl = `//${srsApiHost}/rtc/v1/nack/`
    let sessionId = null

    // https://www.npmjs.com/package/media-stream-merger

    self.publish = async (constraints = { audio: true }) => {
        self.pc = new RTCPeerConnection(null)
        self.stream = new MediaStream()

        self.pc.addTransceiver('audio', { direction: 'sendonly' })
        self.pc.addTransceiver('video', { direction: 'sendonly' })

        // const s = await navigator.mediaDevices.getUserMedia(constraints)
        const s = await navigator.mediaDevices.getDisplayMedia(constraints)

        s.getTracks().forEach((track) => {
            self.pc.addTrack(track)
            self.stream.addTrack(track)
        })

        const offer = await self.pc.createOffer()
        await self.pc.setLocalDescription(offer)

        const session = await requestLiveSession(publishUrl, liveApp, liveStream, offer)
        if (session) {
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
    const playUrl = `//${srsApiHost}/rtc/v1/play/`
    let sessionId = null

    self.play = async () => {
        self.pc = new RTCPeerConnection()
        self.stream = new MediaStream()

        self.pc.addTransceiver('audio', { direction: 'recvonly' })
        self.pc.addTransceiver('video', { direction: 'recvonly' })

        self.pc.ontrack = (event) => {
            self.stream.addTrack(event.track)
        }
        const offer = await self.pc.createOffer()
        await self.pc.setLocalDescription(offer)

        const session = await requestLiveSession(playUrl, liveApp, liveStream, offer)

        if (session) {
            await self.pc.setRemoteDescription(new RTCSessionDescription({
                type: 'answer',
                sdp: session.sdp,
            }))
            sessionId = session.sessionid
        }
    }

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
    fetchLives: async () => {
        return await http.get(`//${srsApiHost}/api/v1/streams/`)
    },
    fetchHistories: async () => {
        return await http.get(`//${srsHookHost}/v1/dvr`)
    },
}