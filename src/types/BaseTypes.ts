export interface BaseMessageOptions {
  message: string;
}

export interface BaseConsumeOptions {
  onMessage: (msg: string) => void;
}
