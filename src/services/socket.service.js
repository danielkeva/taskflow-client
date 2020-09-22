import io from 'socket.io-client';
const BASE_URL = process.env.NODE_ENV === 'production'
    ? '/'
    : '//localhost:3030'
var socket;

export const socketService = {
    setup,
    terminate,
    on,
    off,
    emit
}

function setup() {
    socket = io(BASE_URL);
}

function terminate() {
    socket = null;
}

function on(eventName, cb) {

    socket.on(eventName, cb)
}

function off(eventName, cb) {
    if (socket) {
        socket.off(eventName, cb)
    }
}

function emit(eventName, data) {
    if (socket) {
        socket.emit(eventName, data);
    }
}