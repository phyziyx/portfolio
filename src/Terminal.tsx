import React, { createRef, useEffect, useState } from "react";
import EventsManager from "./Events.Manager";

type Command = {
  name: string;
  alias?: string[];
  desc: string;
  tab: number;
  fn: (...args: string[]) => string | void;
};

const commands: Command[] = [];

function addCommand(command: Command) {
  if (commands.find((e) => e.name === command.name))
    throw new Error(`Command ${command.name} already exists`);

  commands.push(command);
}

addCommand({
  name: "about",
  desc: "about Phyziyx",
  tab: 8,
  fn(...args) {
    return `${this.name} was executed ${this.desc}`;
  },
});

addCommand({
  name: "clear",
  alias: ["cls"],
  desc: "clear the terminal",
  tab: 8,
  fn(...args) {
    return EventsManager.call("clearView");
  },
});

addCommand({
  name: "echo",
  alias: ["print"],
  desc: "print out anything",
  tab: 9,
  fn(...args) {
    return args.join(" ");
  },
});

addCommand({
  name: "education",
  desc: "my education background",
  tab: 4,
  fn(...args) {
    return `${this.name} was executed ${this.desc}`;
  },
});

addCommand({
  name: "email",
  desc: "send an email to me",
  tab: 8,
  fn(...args) {
    return `${this.name} was executed ${this.desc}`;
  },
});

addCommand({
  name: "help",
  alias: ["?"],
  desc: "check available commands",
  tab: 9,
  fn(...args) {
    let message = "The available commands are:";

    for (const { name, desc, alias } of commands) {
      const aliases = alias?.join(", ").substring(-2);
      message += `<br /> ${name}${alias ? ` (${aliases})` : ""}: ${desc}`;
    }

    return message;
  },
});

addCommand({
  name: "history",
  desc: "view command history",
  tab: 6,
  fn(...args) {
    return `${this.name} was executed ${this.desc}`;
  },
});

addCommand({
  name: "projects",
  desc: "view my projects",
  tab: 5,
  fn(...args) {
    return `${this.name} was executed ${this.desc}`;
  },
});

addCommand({
  name: "socials",
  desc: "check out my social accounts",
  tab: 6,
  fn(...args) {
    return `${this.name} was executed ${this.desc}`;
  },
});

addCommand({
  name: "welcome",
  desc: "display hero section",
  tab: 6,
  fn(...args) {
    return `${this.name} was executed ${this.desc}`;
  },
});

addCommand({
  name: "whoami",
  desc: "about current user",
  tab: 7,
  fn(...args) {
    return `${this.name} was executed ${this.desc}`;
  },
});

addCommand({
  name: "manual",
  alias: ["man"],
  desc: "view the user manual",
  tab: 3,
  fn() {
    return `User Manual<br/>
    You can view all the available commands with help.<br/>
    You can scroll between the commands entered using Arrow Up or Arrow Down keys.<br/>
    You may also press Tab to autocomplete the command.`;
  },
});

const Terminal = () => {
  const [username, setUsername] = useState<string>("guest");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [lastCommandIdx, setLastCommandIdx] = useState<number>(-1);
  const [currentCommand, setCurrentCommand] = useState<string>("");
  const [viewPanel, setViewPanel] = useState<string>("");

  const viewRef = createRef<HTMLParagraphElement>();

  const processCommand = (commandName: string, ...args: string[]) => {
    if (!commandName) return;

    const foundCmd = commands.find(
      (e) =>
        e.name.toLowerCase() === commandName || e.alias?.includes(commandName)
    );
    if (!foundCmd) return "Command not found!";

    const retVal = foundCmd.fn(...args);
    // console.log(`retVal: '${retVal}' (${retVal?.length})`);
    return retVal && retVal;
  };

  const handleInputCommand = (text: string) => {
    text = text.trim();
    if (!text) return;

    let [commandName, ...args] = text.split(" ");
    commandName = commandName.toLowerCase();

    let retVal: string | void = "";
    if (commandName) {
      retVal = processCommand(commandName, ...args);
      if (!retVal) return;
    }

    setViewPanel(() => {
      const newView = `${viewPanel}${text}<br/>${retVal && `${retVal}<br/>`}`;
      if (viewRef.current) viewRef.current.innerHTML = newView;
      return newView;
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();

      if (lastCommandIdx === 0) return;

      setCurrentCommand(() => {
        setLastCommandIdx((lastCmdIdx) => lastCmdIdx - 1);
        return commandHistory[lastCommandIdx - 1];
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();

      if (lastCommandIdx === commandHistory.length - 1) return;

      setCurrentCommand(() => {
        setLastCommandIdx((lastCmdIdx) => lastCmdIdx + 1);
        return commandHistory[lastCommandIdx + 1];
      });
    } else if (e.key === "Enter") {
      e.preventDefault();

      setCommandHistory((prev) => {
        setLastCommandIdx(() => commandHistory.length + 1);
        if (prev[commandHistory.length - 1] === currentCommand) return prev;
        return [...prev, currentCommand];
      });

      handleInputCommand(currentCommand);
      setCurrentCommand("");
    } else if (e.key === "Tab") {
      e.preventDefault();

      const currentInput = currentCommand.toLowerCase().trim();
      if (!currentInput) return;

      const foundCmd = commands.find(
        ({ name: cmd, alias }) =>
          cmd.toLowerCase().includes(currentInput) ||
          alias?.some((a) => a === currentInput)
      );

      if (!foundCmd) return;
      setCurrentCommand(foundCmd.name);
    }
  };

  useEffect(() => {
    EventsManager.add("clearView", () => {
      setViewPanel(() => {
        const newView = ``;
        setViewPanel(newView);
        if (viewRef.current) viewRef.current.innerHTML = newView;
        return newView;
      });
    });

    EventsManager.add("setUsername", (username: string) => {
      setUsername(username);
    });

    return () => {
      EventsManager.remove("clearView");
      EventsManager.remove("setUsername");
    };
  }, []);

  return (
    <div className="bg-black bg-scroll flex-grow text-white font-mono min-h-screen">
      <p className="prompt">
        Hey there! Welcome to phyziyx's portfolio. Please type help to view the
        available commands.
      </p>
      <p ref={viewRef}></p>
      <div className="flex flex-row">
        <p>{username}@phyziyx:</p>
        <input
          className="bg-transparent w-screen outline-none border-none font-mono ml-2 text-slate-300"
          type="text"
          value={currentCommand}
          autoFocus={true}
          onChange={(e) => setCurrentCommand(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>
    </div>
  );
};

export default Terminal;
