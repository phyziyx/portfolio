type MyEvent = {
  [name: string]: (...args: any[]) => void;
};

class EventsManager {
  private static events: MyEvent = {};

  static add(name: string, fn: (...args: any[]) => void): void {
    if (this.events[name]) throw new Error(`Event "${name}" already exists!`);

    this.events[name] = fn;
  }

  static remove(name: string): void {
    if (!this.events[name]) throw new Error(`Event "${name}" does not exist!`);

    delete this.events[name];
  }

  static call(name: string, ...args: any[]): void {
    if (!this.events[name]) throw new Error(`Event "${name}" does not exist!`);

    this.events[name].call(args);
  }
}

export default EventsManager;
