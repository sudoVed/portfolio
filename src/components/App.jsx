import React from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { Portfolio } from "./Portfolio";
import { Intro } from "./Intro";
import { FaceMapper } from "./FaceMapper";

const MAPPING_MODE = false;

export function App() {
  const reducedMotion = useReducedMotion();
  const [introDone, setIntroDone] = React.useState(reducedMotion);

  React.useEffect(() => {
    if (reducedMotion) setIntroDone(true);
  }, [reducedMotion]);

  if (MAPPING_MODE) return <FaceMapper />;
  return introDone ? <Portfolio /> : <Intro onComplete={() => setIntroDone(true)} />;
}
