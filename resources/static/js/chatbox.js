
//chatbox START
//The Whole File is from Github: https://github.com/WebDevSimplified/Realtime-Simple-Chat-App 
// Content: 

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FINISHED BY STUDYING INTO THE CODE:https://codeload.github.com/WebDevSimplified/Realtime-Simple-Chat-App/zip/master
//FINISHED BY STUDYING INTO THE CODE:https://codeload.github.com/WebDevSimplified/Realtime-Simple-Chat-App/zip/master
//FINISHED BY STUDYING INTO THE CODE:https://codeload.github.com/WebDevSimplified/Realtime-Simple-Chat-App/zip/master
// -----------------------------THE FRONT END SCRIPT FOR SOCKET.IO CHATBOX------------------------------------------- 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

//READS IN THE NAME OF THE USER
const name = prompt('What Should I call you?')

//SPECIFY WHICH TOPIC TO DISCUSS TODAY
const topic = prompt('What topic are you happy to talk about today?')
appendMessage(name+' joined')
socket.emit('new-user', name , topic)

//WHEN RECEIVING STUFF FROM THE INPUT BOX AND HIT SEND
//THE DATA IS APPENDED TO THE PAGE
socket.on('text-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

//WHEN THE USER IS CONNECTED TO THE SERVER, WELCOME MESSAGE
socket.on('user-connected', name => {
  appendMessage(`WELCOME '${name}' TO USE OUR SERVICE`)
})

//WHEN THE USER IS GONE, A MESSAGE TO DISPLAY
socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

//SUBMIT THE MESSAGE TO THE SERVER
messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`You: ${message}`)
  socket.emit('send-text-message', message)
  messageInput.value = ''
})

//APPEND MESSAGE FROM THE DIV 
function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

///The Whole File is from Github: https://github.com/WebDevSimplified/Realtime-Simple-Chat-App 
// ChatBox End
