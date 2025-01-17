import * as React from "react";
import { EmojiProps } from "./types";

const СonfettiEmoji = React.forwardRef<SVGSVGElement, EmojiProps>(
  ({ size = 20, ...props }, ref) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        ref={ref}
        {...props}
      >
        <rect width="72" height="72" fill="url(#СonfettiEmojiPattern)" />
        <defs>
          <pattern
            id="СonfettiEmojiPattern"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use href="#СonfettiEmojiImage" transform="scale(0.0138889)" />
          </pattern>
          <image
            id="СonfettiEmojiImage"
            width="72"
            height="72"
            href="./images/confetti.png"
          />
        </defs>
      </svg>
    );
  },
);

export { СonfettiEmoji };
