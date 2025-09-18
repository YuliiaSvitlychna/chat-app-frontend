import { v4 as uuidv4 } from 'uuid';

export interface MessageObject {
  id: string;
  username: string;
  message: string;
}

export class ChatModel {
  private static readonly API_BASE_URL = 'http://46.101.114.148:3000/chat';
  private static readonly STORAGE_KEY = 'myIds';

  // Отримання повідомлень з сервера
  public async getMessages(): Promise<MessageObject[]> {
    const res = await fetch(`${ChatModel.API_BASE_URL}/messages`);
    const json = await res.json();
    return json;
  }

  // Відправка повідомлення на сервер
  public async sendMessage(message: MessageObject): Promise<void> {
    await fetch(`${ChatModel.API_BASE_URL}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }

  // Генерація нового ID для повідомлення
  public generateMessageId(): string {
    return uuidv4();
  }

  // Перевірка чи повідомлення належить поточному користувачу
  public isOwnMessage(messageId: string): boolean {
    const myIdStr = localStorage.getItem(ChatModel.STORAGE_KEY);
    const myIds = myIdStr ? JSON.parse(myIdStr) : [];
    return myIds.includes(messageId);
  }

  // Додавання ID повідомлення до списку власних
  public addOwnMessageId(messageId: string): void {
    const myIdStr = localStorage.getItem(ChatModel.STORAGE_KEY);
    const myIds = myIdStr ? JSON.parse(myIdStr) : [];
    myIds.push(messageId);
    localStorage.setItem(ChatModel.STORAGE_KEY, JSON.stringify(myIds));
  }

  // Отримання списку власних ID повідомлень
  public getOwnMessageIds(): string[] {
    const myIdStr = localStorage.getItem(ChatModel.STORAGE_KEY);
    return myIdStr ? JSON.parse(myIdStr) : [];
  }
}
