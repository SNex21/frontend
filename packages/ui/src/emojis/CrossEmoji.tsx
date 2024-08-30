import * as React from "react";
import { EmojiProps } from "./types";

const CrossMarkEmoji = React.forwardRef<SVGSVGElement, EmojiProps>(({ size = 20, ...props }, ref) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
    >
      <rect width="23" height="23" fill="url(#CrossMarkEmojiPattern)" />
      <defs>
        <pattern id="CrossMarkEmojiPattern" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use href="#CrossMarkEmojiImage" transform="scale(0.0138889)" />
        </pattern>
        <image
          id="CrossMarkEmojiImage"
          width="72"
          height="72"
          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAolBMVEUAAAAvAAC7AACDAADsQECJAADqHh72QEDBAACGAAD6QED8WVnFAAD7PT3CAACLAADIAAD6Hh7zHh7oHR1VAADuQED6Ghr4GRn2Hh7sHh73Hh69AAD1Hh72QECEAABSAADBAADoEhLPAwPkLy+dDQ38QkKgCwv8Q0PdMjKAAADuPj5IAADmAADxAAD0AADuAADoAAD3AADqAAD4AgL5AAD6AQHDN2OKAAAALHRSTlMAA+thYGHqYPJ5YAnreOth6+rq6gpg8/Lq6uvr6mFhCPPx8YKCgW1sbGxiBFHaXmIAAAIhSURBVFjDldDpdoIwEAXgTLVCsZt2o7Z2dVdEpb7/qxVxuZqJmcz1h+eE4eNOzCHN/pCMKjTsN/lp8+a5lZDKSVrPN5DgrNetRAMlrfW6kpgDKdSBBOdvkwLbyXsV1SuQ4EAKdyoJzktxSNh2pXPISynB0UhwIMFB0oSkvdKiYFLpLE9TdCC5nU5hvbKRfuEwSXQg/ZrB/XzJkkbnoSjl8/P7gaE7t0RuhtzOHZmtZFlzSMxhsztnL9lJu+Rwuqk9B2cr8bxHHIre+RwcWZIdSaKTvXwOpOuMD7W7dHw/bT6RXcPxShGhj9+BdFlKmZ12dLifNntYOpdwRKkaJcFhUuaWCA4CJ1DqksfRSQoHUp6xdDr8LIejkDQOpNs8y4Vk+S0cnyQGjizpHb0ER5ZW55kVHJUkO3oJjk5yBU649FN+nv1+4IRm8u0q9D1RMvT06l7t9UlXCQ6X9H2ETlpHL8FpLLxpBErc4VJInzp3uFQnhaOS9A7uSe3M4nim7VRvzOwsZm+12lv5Z6dR9/RxOh9EH26JlI4xgsQdnouNs5EucCZIbqe2G6WaW5L7wPFLpHFkCc6Dx/FKD5AERyMJjigp+kidBEchCY5GGnkchTQyvVh2ZCnumcerWHJkKb56NOYTEnMECc6nMZBCHEjcMdgOTqCEvfbSl+UopC846AQnQGJ9cE9wwiTcj9UJTqhU9WESnFCpcrg0nhpVpuMj5x/N25P8d9C5WQAAAABJRU5ErkJggg=="
        />
      </defs>
    </svg>
  );
});

export { CrossMarkEmoji };
