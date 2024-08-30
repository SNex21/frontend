import * as React from "react";
import { EmojiProps } from "./types";

const FlexedBicepsEmoji = React.forwardRef<SVGSVGElement, EmojiProps>(
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
        <rect width="72" height="72" fill="url(#FlexedBicepsEmojiPattern)" />
        <defs>
          <pattern
            id="FlexedBicepsEmojiPattern"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use href="#FlexedBicepsEmojiImage" transform="scale(0.0138889)" />
          </pattern>
          <image
            id="FlexedBicepsEmojiImage"
            width="72"
            height="72"
            href="data:image/png;base64,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"
          />
        </defs>
      </svg>
    );
  },
);

export { FlexedBicepsEmoji };
