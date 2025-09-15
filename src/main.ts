declare const uuidv4: () => string;

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
        .map((mesObj: any) => {
          return `
                <div class="message-bubble bg-green-100 rounded-lg p-3 max-w-[80%] ml-auto">
                    <div class="text-xs text-green-600 font-medium mb-1">${mesObj.username}</div>
                    <div class="text-gray-800">${mesObj.message}</div>
                    <div class="text-xs text-gray-500 mt-1 text-right"></div>
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

      await fetch('http://46.101.114.148:3000/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: uuidv4(),
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
