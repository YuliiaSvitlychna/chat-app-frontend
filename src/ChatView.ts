import { MessageObject } from './ChatModel';

export class ChatView {
  private chatContainer!: HTMLElement;
  private usernameInput!: HTMLInputElement;
  private messageInput!: HTMLInputElement;
  private sendBtn!: HTMLElement;

  constructor() {
    this.initializeElements();
  }

  private initializeElements(): void {
    this.chatContainer = document.getElementById('chatContainer')!;
    this.usernameInput = document.getElementById('usernameInput') as HTMLInputElement;
    this.messageInput = document.getElementById('messageInput') as HTMLInputElement;
    this.sendBtn = document.getElementById('sendBtn')!;
  }

  // Приховання контейнера чату
  public hideChatContainer(): void {
    this.chatContainer.style.visibility = 'hidden';
  }

  // Показ контейнера чату
  public showChatContainer(): void {
    this.chatContainer.style.visibility = 'visible';
  }

  // Перевірка чи користувач прокрутив до низу
  public isAtBottom(): boolean {
    return this.chatContainer.scrollTop === this.chatContainer.scrollHeight;
  }

  // Прокрутка до низу
  public scrollToBottom(): void {
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
  }

  // Отримання значення з поля імені користувача
  public getUsername(): string {
    return this.usernameInput.value;
  }

  // Отримання значення з поля повідомлення
  public getMessage(): string {
    return this.messageInput.value;
  }

  // Очищення поля повідомлення та фокус
  public clearMessageInput(): void {
    this.messageInput.value = '';
    this.messageInput.focus();
  }

  // Відображення повідомлень в чаті
  public renderMessages(messages: MessageObject[], isOwnMessage: (messageId: string) => boolean): void {
    this.chatContainer.innerHTML = messages
      .map((mesObj: MessageObject) => {
        return isOwnMessage(mesObj.id)
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
  }

  // Налаштування обробників подій
  public setupEventListeners(onSendMessage: () => void): void {
    this.sendBtn.addEventListener('click', onSendMessage);
    
    this.messageInput.addEventListener('keyup', async (e) => {
      if (e.key === 'Enter') {
        await onSendMessage();
      }
    });

    this.usernameInput.addEventListener('keyup', async (e) => {
      if (e.key === 'Enter') {
        await onSendMessage();
      }
    });
  }
}
