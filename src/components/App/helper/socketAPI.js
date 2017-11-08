import openSocket from 'socket.io-client';
import config from '../../../config';

const SOCKET_ADDR = config.server.socketURI;
const socket = openSocket(SOCKET_ADDR);

// receivers
function setUpdateRequestReceiver(callback) {
    socket.on('server:user/update-request', () => callback());
}

function setUserUpdateReceiver(callback) {
    socket.on('server:user/update', (userdata) => callback(userdata));
}

function setRoomUserLeaveReceiver(callback) {
    socket.on('server:room/user-leave', (userid) => callback(userid));
}

// emitter
function updateUserData(userdata) {
    socket.emit('client:user/update', userdata);
}

function requestRoomUpdate(userdata) {
    socket.emit('client:user/update-request');
}

function changeRoom(room) {
    socket.emit('client:room/update', room);
}

export default {
  setUpdateRequestReceiver,
  setUserUpdateReceiver,
  setRoomUserLeaveReceiver,
  updateUserData,
  requestRoomUpdate,
  changeRoom
}
