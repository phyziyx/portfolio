import React, { useEffect, useState } from "react";
import CommandsManager from "./utils/Commands.Manager";
import EventsManager from "./utils/Events.Manager";

const Terminal = () => {
  const [username, setUsername] = useState<string>("guest");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [lastCommandIdx, setLastCommandIdx] = useState<number>(-1);
  const [currentCommand, setCurrentCommand] = useState<string>("");
  const [viewPanel, setViewPanel] = useState<string>("");

  const handleInputCommand = (text: string) => {
    text = text.trim();
    if (!text) return;

    let [commandName, ...args] = text.split(" ");
    commandName = commandName.toLowerCase();

    let retVal: string | void = "";
    if (commandName) {
      retVal = CommandsManager.processCommand(commandName, ...args);
      if (!retVal) return;
    }

    setViewPanel(() => {
      const newView = `${viewPanel}${text}<br/>${retVal && `${retVal}<br/>`}`;
      return newView;
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();

      if (lastCommandIdx <= 0) return;

      setCurrentCommand(() => {
        setLastCommandIdx((lastCmdIdx) => lastCmdIdx - 1);
        return commandHistory[lastCommandIdx - 1];
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();

      if (lastCommandIdx === commandHistory.length) return;

      setCurrentCommand(() => {
        setLastCommandIdx((lastCmdIdx) => lastCmdIdx + 1);
        return commandHistory[lastCommandIdx + 1] || "";
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

      const currentInput = currentCommand?.toLowerCase().trim();
      if (!currentInput) return;

      const foundCmd = CommandsManager.findClosestCommand(currentInput);

      if (!foundCmd) return;
      setCurrentCommand(foundCmd.name);
    }
  };

  useEffect(() => {
    EventsManager.add("clearView", () => {
      setViewPanel(() => {
        const newView = ``;
        setViewPanel(newView);
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
        Hey there! Welcome to phyziyx's portfolio. Please type <b>help</b> to
        view the available commands.
      </p>
      <p dangerouslySetInnerHTML={{ __html: viewPanel }}></p>
      <div className="flex flex-row">
        <p>{username}@phyziyx:</p>
        <input
          className="bg-transparent text-wrap flex flex-row w-full outline-none border-none font-mono ml-2 text-slate-300"
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
