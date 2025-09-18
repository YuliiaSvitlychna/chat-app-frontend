import { ChatController } from './ChatController';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const chatController = new ChatController();
    await chatController.initialize();
  } catch (error) {
    console.error('Failed to initialize chat application:', error);
  }
});
