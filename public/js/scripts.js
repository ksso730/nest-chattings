const socket = io('/chattings');

const getElementById = (id) => document.getElementById(id) || null;

//* get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingboxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

//* global socket handler
socket.on('user_connected', (username) => {
  drawNewChat(`${username} is connected!!`);
});
socket.on('new_chat', (data) => {
  const { chat, username } = data;
  drawNewChat(`${number} ${username}: ${chat}`);
});

const handleSubmit = (event) => {
  event.preventDefault();
  const inputValue = event.target.elements[0].value;
  if (inputValue !== '') {
    socket.emit('submit_chat', inputValue);
    drawNewChat(`me : ${inputValue}`);
    event.target.elements[0].value = '';
  }
};

//* draw functions
const drawHelloStranger = (username) =>
  (helloStrangerElement.innerText = `Hello Stranger ${username} :)`);

const drawNewChat = (message) => {
  const wrapperChatBox = document.createElement('div');
  const chatBox = `
    <div>
      ${message}
    </div>
    `;
  wrapperChatBox.innerHTML = chatBox;
  chattingboxElement.append(wrapperChatBox);
};

function helloUser() {
  const username = prompt('What is your name?');
  // new_user 라는 이벤트로 등록. client->server
  socket.emit('new_user', username, (data) => {
    drawHelloStranger(data);
  });
}

function init() {
  helloUser();
  // 이벤트 연결
  formElement.addEventListener('submit', handleSubmit);
}

init();
