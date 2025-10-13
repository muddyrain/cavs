import {
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	Background,
	BaseEdge,
	Connection,
	Controls,
	Edge,
	EdgeChange,
	EdgeProps,
	getStraightPath,
	Handle,
	Node,
	NodeChange,
	NodeProps,
	NodeTypes,
	Position,
	ReactFlow
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { memo, useCallback, useState } from "react"

export type CustomNode = Node<{ label: string }>
const CustomNode = memo((props: NodeProps<CustomNode>) => {
	return (
		<div className="bg-amber-200 p-4 rounded shadow">
			<Handle type="source" position={Position.Bottom} />
			<div className="text-lg font-bold">
				<label>{props.data.label}</label>
			</div>
			<Handle type="target" position={Position.Top} />
		</div>
	)
})
const nodeTypes: NodeTypes = {
	customNode: CustomNode
}

function CustomEdge({ id, sourceX, sourceY, targetX, targetY }: EdgeProps) {
	const [edgePath] = getStraightPath({
		sourceX,
		sourceY,
		targetX,
		targetY
	})

	return (
		<>
			// 红色的虚线
			<path d={edgePath} stroke="red" strokeWidth={2} strokeDasharray="5,5" />
		</>
	)
}
const edgeTypes = {
	customEdge: CustomEdge
}

const initialNodes: Node[] = [
	{
		id: "n1",
		type: "customNode",
		data: { label: "Input Node" },
		position: { x: 250, y: 50 }
	},
	{
		id: "n2",
		type: "customNode",
		data: { label: "Output Node" },
		position: { x: 100, y: 500 }
	}
]
const initialEdges: Edge[] = [
	{
		id: "n1-n2",
		source: "n1",
		target: "n2",
		type: "customEdge"
	}
]

export function DocGraph() {
	const [nodes, setNodes] = useState<Node[]>(initialNodes)
	const [edges, setEdges] = useState<Edge[]>(initialEdges)
	const onNodesChange = useCallback((changes: NodeChange[]) => {
		setNodes((nds) => applyNodeChanges(changes, nds))
	}, [])
	const onEdgesChange = useCallback((changes: EdgeChange[]) => {
		setEdges((eds) => applyEdgeChanges(changes, eds))
	}, [])
	const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [])
	return (
		<div className="h-screen w-full">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				fitView
			>
				<Background />
				<Controls />
			</ReactFlow>
		</div>
	)
}
