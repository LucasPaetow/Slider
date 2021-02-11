import { callbackify } from "util";

interface animateProps {
  timing: (timeFraction: number) => number;
  draw: (progress: number) => void;
  duration: number;
  callback?: () => void;
}

const animate = ({ timing, draw, duration, callback }: animateProps): void => {
  let start = performance.now();

  requestAnimationFrame(function animationStep(time) {
    // timeFraction goes from 0 to 1
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    // calculate the current animation state
    let progress = timing(timeFraction);

    draw(progress); // draw it

    timeFraction < 1
      ? requestAnimationFrame(animationStep)
      : callback && requestAnimationFrame(callback);
  });
};

interface SmoothScrollOptions {
  duration?: number;
  parentElement?: HTMLElement;
}

export const smoothScrollBy = (
  newScrollPosition: number,
  {
    duration = 400,
    parentElement = document.documentElement,
  }: SmoothScrollOptions
): void => {
  const previousScrollPosition = parentElement.scrollLeft;
  const previousScrollBehavior = parentElement.style.getPropertyValue(
    "--scroll-behavior"
  );

  parentElement.style.setProperty("--scroll-behavior", "unset");

  animate({
    duration,
    timing(timeFraction) {
      // ease-in-out
      if (timeFraction <= 0.5) {
        return (2 * timeFraction) / 2;
      } else {
        return (2 - 2 * (1 - timeFraction)) / 2;
      }
    },
    draw(progress) {
      parentElement.scrollTo(
        previousScrollPosition +
          (newScrollPosition - previousScrollPosition) * progress,
        0
      );
    },
    callback: () => {
      parentElement.style.setProperty(
        "--scroll-behavior",
        previousScrollBehavior
      );
    },
  });
};
