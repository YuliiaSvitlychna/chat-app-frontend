import { ChatModel } from '../models/ChatModel';
import { ChatView } from '../views/ChatView';

export class ChatController {
  private model: ChatModel;
  private view: ChatView;

  constructor() {
    this.model = new ChatModel();
    this.view = new ChatView();
  }
}
