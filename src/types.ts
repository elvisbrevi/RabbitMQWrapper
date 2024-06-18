export interface MessageOptions {
  queue: string;
  message: string;
}

export interface ConsumeOptions {
  queue: string;
  onMessage: (msg: string) => void;
}
