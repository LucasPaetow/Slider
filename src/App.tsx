import React from "react";
import styled from "styled-components";
import { Slide } from "./Slide";
import { smoothScrollBy } from "./scroll";

const Body = styled.main`
  height: 100vh;
  width: 100vw;
  background-color: white;
`;

const SlideComponent = styled.section`
  height: 100%;
  position: relative;
  margin-top: 1rem;
`;

const SlideList = styled.ul<{}>`
  display: grid;
  grid-template-rows: 1fr;
  grid-auto-columns: 80vw;
  grid-auto-flow: column;
  overflow-x: auto;
  height: 80vh;
  scroll-snap-type: var(--scroll-behavior);
  overscroll-behavior: contain;
  touch-action: pan-x;
  padding-inline-start: 10vw;

  ::after {
    content: "";
    width: 10vw;
  }

  @media (min-width: 800px) {
    grid-auto-columns: 100vw;

    padding-inline-start: 0;

    ::after {
      content: unset;
      width: unset;
    }
  } ;
`;

const ControlPanel = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 0.5rem;
  background-color: white;
  margin-top: 2rem;
  padding: 1rem;
  overflow: auto;

  @media (min-width: 800px) {
    margin-top: unset;
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
    bottom: 25%;
  } ;
`;

const Button = styled.button<{ color: string }>`
  font-size: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 2px 2px 5px 0 hsla(0, 0%, 0%, 0.15);
  border: transparent;
  border: 1px solid ${(props) => props.color};
`;

const slides = ["LightCoral", "PeachPuff", "LightGreen", "PowderBlue"];

function App() {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [scrollMode, setScrollMode] = React.useState<"automatic" | "manuel">(
    "manuel"
  );
  const ref = React.useRef<HTMLUListElement>(null);
  const customPropertiesStyle = {
    "--scroll-behavior": "x mandatory",
  } as React.CSSProperties;

  const changeActiveSlideTo = (index: number) => {
    setActiveSlide(index);
  };

  React.useEffect(() => {
    const handleScroll = () => {
      if (scrollMode === "manuel") {
        return;
      }
      setScrollMode("manuel");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const smoothScrollOnClick = (index: number): void => {
    if (scrollMode === "manuel") {
      setScrollMode("automatic");
    }

    const getScrollWidth = (listObject: any): number => {
      if (!listObject) {
        return 0;
      }
      return listObject.children[index].clientWidth;
    };

    if (window.innerWidth < 800) {
      smoothScrollBy(getScrollWidth(ref.current) * index, {
        parentElement: ref?.current as HTMLUListElement,
      });
    } else {
      smoothScrollBy(getScrollWidth(ref.current) * index, {
        parentElement: ref?.current as HTMLUListElement,
        duration: 0,
      });
    }

    changeActiveSlideTo(index);
  };

  return (
    <Body>
      <SlideComponent>
        <SlideList ref={ref} style={customPropertiesStyle}>
          {slides.map((color, index) => (
            <Slide
              color={color}
              activeSlide={activeSlide}
              index={index}
              parentRef={ref}
              changeActiveSlideTo={changeActiveSlideTo}
            ></Slide>
          ))}
        </SlideList>

        <ControlPanel>
          {slides.map((color, index) => (
            <Button onClick={() => smoothScrollOnClick(index)} color={color}>
              {color}
            </Button>
          ))}
        </ControlPanel>
      </SlideComponent>
    </Body>
  );
}

export default App;
