export type Command = {
  name: string;
  aliases?: string[];
  desc: string;
  fn: (...args: string[]) => string | void;
};
