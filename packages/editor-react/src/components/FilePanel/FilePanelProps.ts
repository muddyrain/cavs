import {
	DefaultInlineContentSchema,
	DefaultStyleSchema,
	FilePanelState,
	InlineContentSchema,
	StyleSchema,
	UiElementPosition
} from "@cavs/editor-core"

export type FilePanelProps<
	I extends InlineContentSchema = DefaultInlineContentSchema,
	S extends StyleSchema = DefaultStyleSchema
> = Omit<FilePanelState<I, S>, keyof UiElementPosition>
