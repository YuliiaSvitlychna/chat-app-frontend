document.addEventListener('DOMContentLoaded', () => {
  const chatContainer = document.getElementById('chatContainer');
  const usernameInput = document.getElementById(
    'usernameInput',
  ) as HTMLInputElement;
  const messageInput = document.getElementById(
    'messageInput',
  ) as HTMLInputElement;
  const sendBtn = document.getElementById('sendBtn');

  if (chatContainer && usernameInput && messageInput && sendBtn) {
    setInterval(async () => {
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
      console.log(chatContainer.innerHTML);
    }, 1000);

    sendBtn.addEventListener('click', async () => {
      const response = await fetch('http://46.101.114.148:3000/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 'temperary-id-1',
          username: usernameInput.value,
          message: messageInput.value,
        }),
      });
    });
  }
});
