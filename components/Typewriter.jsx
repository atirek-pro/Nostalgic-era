"use client";

import { useEffect, useState } from "react";

export default function Typewriter({ speed = 70 }) {
  const lines = ["Who / Where are we", "listening as?"];
  const fullText = lines.join("\n");

  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      index++;

      setDisplayedText(fullText.slice(0, index));

      if (index === fullText.length) {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [fullText, speed]);

  const [firstLine, secondLine = ""] = displayedText.split("\n");

  return (
    <span>
      <span className="block">
        {firstLine}

        {displayedText.length <= lines[0].length && (
          <span className={isComplete ? "typewriter-cursor" : ""}>|</span>
        )}
      </span>

      <span className="block">
        {secondLine}

        {displayedText.length > lines[0].length && (
          <span className={isComplete ? "typewriter-cursor" : ""}>|</span>
        )}
      </span>
    </span>
  );
}
