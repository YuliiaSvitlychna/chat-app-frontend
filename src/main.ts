declare const uuidv4: () => string;

type MessageObject = {
  id: string;
  username: string;
  message: string;
};

document.addEventListener('DOMContentLoaded', async () => {
  const chatContainer = document.getElementById('chatContainer');
  const usernameInput = document.getElementById(
    'usernameInput',
  ) as HTMLInputElement;
  const messageInput = document.getElementById(
    'messageInput',
  ) as HTMLInputElement;
  const sendBtn = document.getElementById('sendBtn');

  if (chatContainer && usernameInput && messageInput && sendBtn) {
    const isOwnMessage = (mesObj: MessageObject) => {
      const myIdStr = localStorage.getItem("myIds");
      const myIds = myIdStr ? JSON.parse(myIdStr) : [];
      return myIds.includes(mesObj.id);
    };
    const hideChatContainer = async () => {
      chatContainer.style.visibility = 'hidden';
    };

    const showChatContainer = async () => {
      chatContainer.style.visibility = 'visible';
    };

    const isAtDown = () =>
      chatContainer.scrollTop === chatContainer.scrollHeight;

    const scrollToDown = async () => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    };

    const loadChat = async () => {
      const res = await fetch('http://46.101.114.148:3000/chat/messages');
      const json = await res.json();
      chatContainer.innerHTML = json
        .map((mesObj: MessageObject) => {
          return isOwnMessage(mesObj)
            ? `<div class="message-bubble bg-green-100 rounded-lg p-3 max-w-[80%] ml-auto">
                <div class="text-xs text-green-600 font-medium mb-1">${mesObj.username}</div>
                <div class="text-gray-800">${mesObj.message}</div>
                <div class="text-xs text-gray-500 mt-1 text-right"></div>
              </div>`
            : `<div class="message-bubble bg-purple-100 rounded-lg p-3 max-w-[80%] mr-auto">
                <div class="text-xs text-purple-600 font-medium mb-1">${mesObj.username}</div>
                <div class="text-gray-800">${mesObj.message}</div>
                <div class="text-xs text-gray-500 mt-1 text-left"></div>
              </div>`;
        })
        .join('\n');

      await new Promise((resolve) => requestAnimationFrame(resolve));

      if (isAtDown()) {
        scrollToDown();
      }
    };

    await hideChatContainer();
    await loadChat();
    await scrollToDown();
    await showChatContainer();

    setInterval(loadChat, 1000);

    const sendMassage = async () => {
      if (!usernameInput.value || !messageInput.value) {
        return;
      }

      const id = uuidv4();
      const myIdStr = localStorage.getItem('myIds');
      const myIds = myIdStr ? JSON.parse(myIdStr) : [];
      myIds.push(id);
      localStorage.setItem("myIds", JSON.stringify(myIds));

      await fetch('http://46.101.114.148:3000/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          username: usernameInput.value,
          message: messageInput.value,
        }),
      });
      messageInput.value = '';
      messageInput.focus();
    };

    sendBtn.addEventListener('click', sendMassage);
    messageInput.addEventListener('keyup', async (e) => {
      if (e.key === 'Enter') {
        await sendMassage();
      }
    });

    usernameInput.addEventListener('keyup', async (e) => {
      if (e.key === 'Enter') {
        await sendMassage();
      }
    });
  }
});
