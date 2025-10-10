import {
	createReactBlockSpec,
	createReactInlineContentSpec,
	DefaultReactSuggestionItem,
	getDefaultReactSlashMenuItems,
	SuggestionMenuController,
	useCreateBlockNote
} from "@cavs/editor-react"
import { BlockNoteView } from "@cavs/editor-shadcn"
import "@cavs/editor-shadcn/style.css"
import {
	BlockNoteSchema,
	defaultBlockSpecs,
	defaultInlineContentSpecs,
	defaultStyleSpecs,
	filterSuggestionItems,
	insertOrUpdateBlock
} from "@cavs/editor-core"
import { zh } from "@cavs/editor-core/locales"

const schema = BlockNoteSchema.create({
	blockSpecs: {
		...defaultBlockSpecs,
		blockAI: createReactBlockSpec(
			{
				type: "blockAI",
				content: "none",
				propSchema: {
					id: {
						default: "ai-block"
					},
					title: {
						default: "AI 助手"
					},
					description: {
						default: "这是一个 AI 助手块"
					},
					content: {
						default: "你好！我是你的 AI 助手，有什么可以帮你的吗？"
					}
				}
			},
			{
				render: (props) => {
					const { title, description, content } = props.block.props
					return (
						<div className="border p-4 rounded-lg shadow-md bg-gray-50 w-lg">
							<h3 className="text-lg font-bold text-blue-600">{title}</h3>
							<p className="text-xs text-gray-500">{description}</p>
							<div className="mt-2 p-2 bg--white border rounded text-lg text-black">
								<span>内容：</span>
								<span>{content}</span>
							</div>
						</div>
					)
				}
			}
		)
	},
	inlineContentSpecs: {
		...defaultInlineContentSpecs,
		mention: createReactInlineContentSpec(
			{
				type: "mention",
				content: "none",
				propSchema: {
					id: {
						default: ""
					},
					name: {
						default: ""
					}
				}
			},
			{
				render: (props) => {
					const { id } = props.inlineContent.props
					return <span className="text-blue-500 bg-amber-200">@{id}</span>
				}
			}
		)
	},
	styleSpecs: {
		...defaultStyleSpecs
	}
})

export function DocEditor() {
	const editor = useCreateBlockNote({
		schema,
		dictionary: zh,
		initialContent: [
			{
				type: "paragraph",
				content: [
					{
						type: "text",
						text: "这是一段文本，你可以输入@来触发提及菜单。"
					},
					{
						type: "mention",
						props: {
							id: "example",
							name: "示例用户"
						}
					}
				]
			},
			{
				type: "blockAI"
			}
		]
	})

	const insertBlockAI = (e: typeof editor): DefaultReactSuggestionItem => {
		return {
			title: "插入 AI 助手块",
			subtext: "为您提供智能帮助",
			icon: <span>🤖</span>,
			onItemClick: () => {
				insertOrUpdateBlock(e, {
					type: "blockAI",
					props: {
						id: `ai-block-${Date.now()}`, // 确保每个块有唯一的 ID
						title: "AI 小助手",
						description: "智能内容生成",
						content: "你好！我是你的 AI 小助手，有什么可以帮你的吗？"
					}
				})
			}
		}
	}

	const getMentionUserItems = (e: typeof editor) => {
		const userItems: DefaultReactSuggestionItem[] = [
			{
				icon: <span>👩‍💻</span>,
				title: "用户123",
				onItemClick: () => {
					e.insertInlineContent([
						{
							type: "mention",
							props: { id: "User123", name: "用户123" }
						}
					])
				}
			},
			{
				icon: <span>👨‍💻</span>,
				title: "用户456",
				onItemClick: () => {
					e.insertInlineContent([
						{
							type: "mention",
							props: { id: "User456", name: "用户456" }
						}
					])
				}
			}
		]
		return userItems
	}

	return (
		<div className="h-screen flex flex-col bg-background">
			<BlockNoteView editor={editor}>
				<SuggestionMenuController
					triggerCharacter="@"
					getItems={async (query) => {
						return filterSuggestionItems(getMentionUserItems(editor), query)
					}}
				/>
				<SuggestionMenuController
					triggerCharacter="/"
					getItems={async (query) => {
						return filterSuggestionItems(
							[...getDefaultReactSlashMenuItems(editor), insertBlockAI(editor)],
							query
						)
					}}
				/>
			</BlockNoteView>
		</div>
	)
}
