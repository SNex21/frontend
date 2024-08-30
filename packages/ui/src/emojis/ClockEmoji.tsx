import * as React from "react";
import { EmojiProps } from "./types";

const AlarmClockEmoji = React.forwardRef<SVGSVGElement, EmojiProps>(({ size = 20, ...props }, ref) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
    >
      <rect x="0.5" y="0.5" width="21" height="21" fill="url(#AlarmClockEmojiPattern)" />
      <defs>
        <pattern id="AlarmClockEmojiPattern" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use href="#AlarmClockEmojiImage" transform="scale(0.0138889)" />
        </pattern>
        <image
          id="AlarmClockEmojiImage"
          width="72"
          height="72"
          href="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
});

export { AlarmClockEmoji };
