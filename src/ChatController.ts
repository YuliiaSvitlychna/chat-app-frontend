import { ChatModel, MessageObject } from './ChatModel';
import { ChatView } from './ChatView';

export class ChatController {
  private model: ChatModel;
  private view: ChatView;
  private refreshInterval: number | null = null;

  constructor() {
    this.model = new ChatModel();
    this.view = new ChatView();
    this.setupEventListeners();
  }

  // Налаштування обробників подій
  private setupEventListeners(): void {
    this.view.setupEventListeners(() => this.sendMessage());
  }

  // Ініціалізація чату
  public async initialize(): Promise<void> {
    await this.hideAndLoadChat();
    this.startAutoRefresh();
  }

  // Приховання контейнера, завантаження чату та показ
  private async hideAndLoadChat(): Promise<void> {
    this.view.hideChatContainer();
    await this.loadChat();
    this.view.scrollToBottom();
    this.view.showChatContainer();
  }

  // Завантаження повідомлень з сервера
  private async loadChat(): Promise<void> {
    const messages = await this.model.getMessages();
    this.view.renderMessages(messages, (messageId: string) => this.model.isOwnMessage(messageId));
    
    // Очікування оновлення DOM
    await new Promise((resolve) => requestAnimationFrame(resolve));
    
    if (this.view.isAtBottom()) {
      this.view.scrollToBottom();
    }
  }

  // Відправка повідомлення
  private async sendMessage(): Promise<void> {
    const username = this.view.getUsername();
    const messageText = this.view.getMessage();

    if (!username || !messageText) {
      return;
    }

    const messageId = this.model.generateMessageId();
    const message: MessageObject = {
      id: messageId,
      username: username,
      message: messageText,
    };

    this.model.addOwnMessageId(messageId);
    await this.model.sendMessage(message);
    this.view.clearMessageInput();
  }

  // Запуск автоматичного оновлення
  private startAutoRefresh(): void {
    this.refreshInterval = window.setInterval(() => {
      this.loadChat();
    }, 1000);
  }

  // Зупинка автоматичного оновлення
  public destroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }
}
