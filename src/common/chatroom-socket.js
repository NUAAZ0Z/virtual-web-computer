import { io } from 'socket.io-client'

export const SESSION_ID_KEY = 'chatroom.sessionId'

export const createSocket = () => {
    return io('https://chatroom-express.sudocs.com', {
        path: '/socket.io/',
        auth: {
            sessionId: localStorage.getItem(SESSION_ID_KEY),
        },
    })
}