import { io } from 'socket.io-client'

export const SESSION_ID_KEY = 'chatroom.sessionId'

const SOCKET_IO_URL_PROD = 'https://chatroom-express.sudocs.com'
const SOCKET_IO_URL_DEV = 'http://127.0.0.1:4000'
const SOCKET_IO_URL = process.env.NODE_ENV === 'development' ? SOCKET_IO_URL_DEV : SOCKET_IO_URL_PROD

export const createSocket = () => {
    return io(SOCKET_IO_URL, {
        path: '/socket.io/',
        auth: {
            sessionId: localStorage.getItem(SESSION_ID_KEY),
        },
    })
}