import type { BlockNoteEditor } from "@cavs/editor-core";
import { useEditorChange } from "./useEditorChange.js";
import { useEditorSelectionChange } from "./useEditorSelectionChange.js";

export function useEditorContentOrSelectionChange(
  callback: () => void,
  editor?: BlockNoteEditor<any, any, any>,
) {
  useEditorChange(callback, editor);
  useEditorSelectionChange(callback, editor);
}
