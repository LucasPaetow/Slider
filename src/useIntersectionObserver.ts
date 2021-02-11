import { useEffect, useRef, useState } from "react";

interface IntersectionObserverProps {
  root: Element | null;
  rootMargin?: string;
  threshold: number | number[] | undefined;
}

export const useIntersectionObserver = ({
  root = null,
  rootMargin,
  threshold = 0,
}: IntersectionObserverProps) => {
  const [entry, updateEntry] = useState<any>({});
  const [node, setNode] = useState<Element | null>(null);

  const observer = useRef(
    new IntersectionObserver(([entry]) => updateEntry(entry), {
      root,
      rootMargin,
      threshold,
    })
  );

  useEffect(() => {
    const { current: currentObserver } = observer;
    currentObserver.disconnect();

    if (node) {
      currentObserver.observe(node);
    }

    return () => currentObserver.disconnect();
  }, [node]);

  return [setNode, entry];
};
