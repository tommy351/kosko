import { useContext } from "react";
import { PlaygroundContext } from "../context";

export default function usePlaygroundContext() {
  return useContext(PlaygroundContext);
}
