/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useKeyPress } from "./useKeyPress";

// Configures arrow key navigation for a list view
export default function useArrowNavigation(
  isActive: boolean, // If true, navigation will be active for the current list
  list: any | any[], // List of items to navigate through
  onSelect: (value: any) => void // callback function after an item on the link has been selected
) {
  const [selected, setSelected] = useState<any>(undefined);
  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const enterPress = useKeyPress("Enter");
  const [cursor, setCursor] = useState(0);
  const [hovered, setHovered] = useState(undefined);

  const canChangeCursor = isActive && list && list!.length;

  // Navigate down the list, and go back to top after getting to the bottom
  useEffect(() => {
    if (canChangeCursor && downPress) {
      setCursor((prevState) =>
        prevState < list!.length - 1 ? prevState + 1 : 0
      );
    }
  }, [downPress]);

  // Navigate up the list, and go back to bottom after getting to the top
  useEffect(() => {
    if (canChangeCursor && upPress) {
      setCursor((prevState) =>
        prevState > 0 ? prevState - 1 : list!.length - 1
      );
    }
  }, [upPress]);

  // Perform callback when an item has been selected by pressing 'enter'
  useEffect(() => {
    if (canChangeCursor && enterPress) {
      setSelected(list[cursor]);
      onSelect(list[cursor]);
    }
  }, [cursor, enterPress]);

  // Update current active component
  useEffect(() => {
    if (canChangeCursor && hovered) {
      setCursor(list!.indexOf(hovered));
    }
  }, [hovered]);

  return {
    selected,
    hovered,
    setHovered,
    setSelected,
    cursor,
    setCursor,
  };
}
