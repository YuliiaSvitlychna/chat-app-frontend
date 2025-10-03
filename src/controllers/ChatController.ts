import { MessageObject } from '../models/ChatModel';
import { ChatSocketModel} from '../models/ChatModelSocket';
import { ChatView } from '../views/ChatView';

export class ChatController {
  private model: ChatSocketModel;
  private view: ChatView;

  constructor() {
    this.model = new ChatSocketModel(process.env.HOST || "http:localhost:3000");
    this.view = new ChatView();

    this.view.onReady(() => {
      this.initialize();
    });
  }

  private initialize = async () => {
    await this.view.hideChatContainer();
    await this.loadChat();
    await this.view.scrollToDown();
    await this.view.showChatContainer();

    this.view.onSendMessage((message: MessageObject) => {
      this.model.sendMessage(message);
    });

    this.model.onNewMessage(async (message: MessageObject) => {
      this.displayMessages([message]);
    });
  };

  private loadChat = async () => {
    const messages = await this.model.loadMessages();
    this.view.clearMessages();
    this.displayMessages(messages);
  };

  private displayMessages = async (messages: MessageObject []) => {
    messages.forEach((message) => {
      if (this.model.isOwnMessage(message)) {
        this.view.displayOwnMassage(message);
      } else {
        this.view.displayOtherMassage(message);
      }
    });

    await this.view.wiatAnimationFrame();

    if (this.view.isAtDown()) {
      this.view.scrollToDown();
    }
  }
}
