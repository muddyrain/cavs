import { useCallback } from "react";
import { ArrowDirectionType } from "@/types/sheet";
import { useComputed } from "./useComputed";
import { useStore } from "./useStore";

export const useDirection = () => {
  const { selectedCell } = useStore();

  const { fitCellViewPort, getNextPosition, updateSelectionAndCell } =
    useComputed();

  const onDirectionKeyDown = useCallback(
    (key: ArrowDirectionType) => {
      if (!selectedCell) return;
      const nextCell = getNextPosition(key);
      if (!nextCell) return;
      updateSelectionAndCell(nextCell.nextRow, nextCell.nextCol);
      fitCellViewPort(nextCell.nextRow, nextCell.nextCol);
    },
    [selectedCell, fitCellViewPort, getNextPosition, updateSelectionAndCell],
  );

  return { onDirectionKeyDown };
};
