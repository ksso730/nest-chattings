const socket = io('/chattings');

const getElementById = (id) => document.getElementById(id) || null;

//* get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingboxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

const drawHelloStranger = (username) =>
  (helloStrangerElement.innerText = `Hello Stranger ${username} :)`);

function helloUser() {
  const username = prompt('What is your name?');
  // new_user 라는 이벤트로 등록. client->server
  socket.emit('new_user', username, (data) => {
    drawHelloStranger(data);
  });
}

function init() {
  helloUser();
}

init();
