import { Command } from "../types";
import EventsManager from "./Events.Manager";

class CommandsManager {
  private static commands: Command[] = [];

  public static addCommand = (command: Command) => {
    if (this.commands.find((e) => e.name === command.name))
      throw new Error(`Command ${command.name} already exists`);

    this.commands.push(command);
    console.log(`Command ${command.name} added!`);
  };

  public static processCommand = (commandName: string, ...args: string[]) => {
    if (!commandName) return;

    const foundCmd = this.commands.find(
      (e) =>
        e.name.toLowerCase() === commandName ||
        (e.aliases && e.aliases.includes(commandName))
    );
    if (!foundCmd) return "Command not found!";

    const retVal = foundCmd.fn(...args);
    return retVal && retVal;
  };

  public static findClosestCommand(currentInput: string) {
    return this.commands.find(
      ({ name: cmd, aliases }) =>
        cmd.toLowerCase().includes(currentInput) ||
        aliases?.some((a) => a === currentInput)
    );
  }

  public static getAll() {
    return this.commands;
  }
}

export default CommandsManager;

CommandsManager.addCommand({
  name: "about",
  desc: "about Phyziyx",
  fn() {
    return `I'm Phyziyx, a cross curricular developer, currently a student pursuing BSc in Computer Science. I'm always looking for new opportunities to learn and grow.`;
  },
});

CommandsManager.addCommand({
  name: "clear",
  aliases: ["cls"],
  desc: "clear the terminal",
  fn() {
    return EventsManager.call("clearView");
  },
});

CommandsManager.addCommand({
  name: "echo",
  aliases: ["print"],
  desc: "print out anything",
  fn(...args) {
    return args.join(" ");
  },
});

CommandsManager.addCommand({
  name: "education",
  desc: "my education background",
  fn() {
    return `I'm pursuing BSc in Computer Science.`;
  },
});

CommandsManager.addCommand({
  name: "email",
  desc: "send an email to me",
  fn() {
    return `You can't email me yet!`;
  },
});

CommandsManager.addCommand({
  name: "help",
  aliases: ["?"],
  desc: "check available commands",
  fn() {
    let message = "The available commands are:";

    for (const { name, desc, aliases } of CommandsManager.getAll()) {
      const aliaseses = aliases?.join(", ").substring(-2);
      message += `<br /> ${name}${aliases ? ` (${aliaseses})` : ""}: ${desc}`;
    }

    return message;
  },
});

CommandsManager.addCommand({
  name: "projects",
  desc: "view my projects",
  fn() {
    return `Check my GitHub profile if you're interested <a style="color: to-blue-600;" href="https://github.com/phyziyx">here</a>.`;
  },
});

CommandsManager.addCommand({
  name: "socials",
  desc: "check out my social accounts",
  fn() {
    return `I'm phyziyx everywhere!`;
  },
});

CommandsManager.addCommand({
  name: "welcome",
  desc: "display hero section",
  fn() {
    return `Welcome to Phyziyx's portfolio!`;
  },
});

CommandsManager.addCommand({
  name: "manual",
  aliases: ["man"],
  desc: "view the user manual",
  fn() {
    return `User Manual<br/>
	  You can view all the available commands with help.<br/>
	  You can scroll between the commands entered using Arrow Up or Arrow Down keys.<br/>
	  You may also press Tab to autocomplete the command.`;
  },
});
