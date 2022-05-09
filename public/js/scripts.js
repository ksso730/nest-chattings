const socket = io('/');

const getElementById = (id) => document.getElementById(id) || null;

//* get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingboxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

function helloUser() {
  const username = prompt('What is your name?');
  // new_user 라는 이벤트로 등록. client->server
  socket.emit('new_user', username, (data) => {
    console.log(data);
  });
  socket.on('hello_user', (data) => {
    console.log('>>>> ', data);
  });
}

function init() {
  helloUser();
}

init();