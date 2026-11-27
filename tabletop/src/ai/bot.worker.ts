/** The bot worker. It receives a seat's view and answers with an encoded action. */
import type { BotReply, BotRequest } from './protocol';
import { runBot } from './run-bot';

interface WorkerScope {
  onmessage: ((event: MessageEvent<BotRequest>) => void) | null;
  postMessage(message: BotReply): void;
}

const scope = self as unknown as WorkerScope;

scope.onmessage = (event) => {
  void runBot(event.data).then((reply) => scope.postMessage(reply));
};
