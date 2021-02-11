import React from "react";
import styled from "styled-components";
import { useIntersectionObserver } from "./useIntersectionObserver";

type ListProps = {
  backgroundColor: string;
  isActive: boolean;
};

const List = styled.li<ListProps>`
  position: relative;
  background-color: ${(props) => props.backgroundColor};

  grid-rows: 1/2;
  grid-columns: 1/2;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  display: grid;
  justify-items: center;
  align-items: center;
  color: white;
  height: 100%;
  transform: scale(${(props) => (props.isActive ? 1 : 0.85)});
  transition: transform 200ms ease;

  @media (min-width: 800px) {
    transform: scale(1);
  } ;
`;

type SlideProps = {
  color: string;
  activeSlide: number;
  index: number;
  parentRef: React.RefObject<HTMLUListElement>;
  changeActiveSlideTo: (index: number) => void;
};

export const Slide = (props: SlideProps) => {
  const { color, activeSlide, index, parentRef, changeActiveSlideTo } = props;
  const isActive = index === activeSlide;
  const [ref, entry] = useIntersectionObserver({
    root: parentRef.current,
    rootMargin: "10%",
    threshold: 1,
  });

  React.useEffect(() => {
    if (entry.intersectionRatio < 0.9) {
      return;
    }

    changeActiveSlideTo(index);
  }, [entry]);

  return (
    <List backgroundColor={color} isActive={isActive} ref={ref}>
      {color}
    </List>
  );
};
