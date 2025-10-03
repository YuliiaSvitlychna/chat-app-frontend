import { MessageObject } from '../models/ChatModel';

export class ChatView {
  private chatContainer;
  private usernameInput;
  private messageInput;
  private sendBtn;

  constructor() {
    this.chatContainer = document.getElementById(
      'chatContainer',
    ) as HTMLElement;
    this.usernameInput = document.getElementById(
      'usernameInput',
    ) as HTMLInputElement;
    this.messageInput = document.getElementById(
      'messageInput',
    ) as HTMLInputElement;
    this.sendBtn = document.getElementById('sendBtn') as HTMLInputElement;
  }

  onReady = (func: () => void) => {
    document.addEventListener('DOMContentLoaded', func);
  };

  hideChatContainer = async () => {
    this.chatContainer.style.visibility = 'hidden';
  };

  showChatContainer = async () => {
    this.chatContainer.style.visibility = 'visible';
  };

  isAtDown = () => {
    return this.chatContainer.scrollTop === this.chatContainer.scrollHeight;
  };

  scrollToDown = () => {
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
  };

  private sendMessage = async (func: (message: MessageObject) => void) => {
    if (!this.usernameInput.value || !this.messageInput.value) {
      return;
    }

    func({
      username: this.usernameInput.value,
      message: this.messageInput.value,
    });

    this.messageInput.value = '';
    this.messageInput.focus();
  };

  onSendMessage = (func: (message: MessageObject) => void) => {
    this.sendBtn.addEventListener('click', () => {
      this.sendMessage(func);
    });

    this.messageInput.addEventListener('keyup', async (e) => {
      if (e.key === 'Enter') {
        this.sendMessage(func);
      }
    });

    this.usernameInput.addEventListener('keyup', async (e) => {
      if (e.key === 'Enter') {
        this.sendMessage(func);
      }
    });
  };

  clearMessages = () => {
    this.chatContainer.innerHTML = '';
  };

  displayOwnMassage = (mesObj: MessageObject) => {
    this.chatContainer.innerHTML += `
    <div class="message-bubble bg-green-100 rounded-lg p-3 max-w-[80%] ml-auto">
      <div class="text-xs text-green-600 font-medium mb-1">${mesObj.username}</div>
      <div class="text-gray-800">${mesObj.message}</div>
      <div class="text-xs text-gray-500 mt-1 text-right"></div>
    </div>`;
  };

  displayOtherMassage = (mesObj: MessageObject) => {
    this.chatContainer.innerHTML += `
    <div class="message-bubble bg-purple-100 rounded-lg p-3 max-w-[80%] mr-auto">
      <div class="text-xs text-purple-600 font-medium mb-1">${mesObj.username}</div>
      <div class="text-gray-800">${mesObj.message}</div>
      <div class="text-xs text-gray-500 mt-1 text-left"></div>
    </div>`;
  };

  wiatAnimationFrame = async () => {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  };
}
