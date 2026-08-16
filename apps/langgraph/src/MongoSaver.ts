import type { RunnableConfig } from "@langchain/core/runnables"
import {
	BaseCheckpointSaver,
	type Checkpoint,
	type CheckpointMetadata,
	type CheckpointTuple
} from "@langchain/langgraph"
import { Collection, type Document } from "mongodb"

// 存储到mongodb里面的文档的类型
interface MongoCheckpointDoc {
	thread_id: string // 线程 ID，用于标识一次对话
	checkpoint_ns: string // 检查点命名空间，通常为空或用于区分不同类型的检查点
	checkpoint_id: string // 检查点 ID，通常是 UUID
	parent_checkpoint_id?: string // 父检查点 ID，用于构建检查点链
	type: "checkpoint" // 文档类型，固定为 "checkpoint"
	checkpoint: Buffer // 序列化后的检查点数据，存储为二进制 Buffer
	checkpoint_type: string // 检查点数据的序列化类型（如 json）
	metadata: Buffer // 序列化后的元数据，存储为二进制 Buffer
	metadata_type: string // 元数据的序列化类型
	created_at: Date // 创建时间
}

export class MongoSaver extends BaseCheckpointSaver {
	private collection: Collection<Document>

	constructor(collection: Collection<Document>) {
		super()
		this.collection = collection
	}

	// 将检查点写入到mongodb里面
	// 核心思路：从检查点里面提取信息，组装成一个doc对象，调用mongodb相应方法进行存储
	async put(
		config: RunnableConfig,
		checkpoint: Checkpoint,
		metadata: CheckpointMetadata
	): Promise<RunnableConfig> {
		// 提取thread_id、checkpoint_ns 等信息
		const thread_id = config.configurable?.thread_id
		const checkpoint_ns = config.configurable?.checkpoint_ns ?? ""

		if (!thread_id) throw new Error("存储checkpoint时需要提供thread_id")

		// 整个checkpoint，有一些可以直接存，有一些数据需要转为二进制
		// 返回值一个是类型，一个转换后的数据
		const [cType, cData] = await this.serde.dumpsTyped(checkpoint)
		const [mType, mData] = await this.serde.dumpsTyped(metadata)

		// 目前，要存储到mongodb里面的各个数据就准备好了
		// 下一步需要做一个数据的组装，组装成一个文档对象
		const doc: MongoCheckpointDoc = {
			thread_id,
			checkpoint_ns,
			checkpoint_id: checkpoint.id,
			parent_checkpoint_id: config.configurable?.checkpoint_id,
			type: "checkpoint",
			checkpoint: Buffer.from(cData),
			checkpoint_type: cType,
			metadata: Buffer.from(mData),
			metadata_type: mType,
			created_at: new Date()
		}

		// 回头就需要将上面的 doc 对象添加到 mongodb 里面对应的 collection（表） 中
		await this.collection.insertOne(doc)

		// 返回新的运行配置
		return {
			configurable: {
				thread_id,
				checkpoint_ns,
				checkpoint_id: checkpoint.id
			}
		}
	}

	// 从mongodb中获取指定的检查点
	async getTuple(config: RunnableConfig): Promise<CheckpointTuple | undefined> {
		// 1. 从config对象上面提取必要的信息，比如 thread_id、checkp

		const thread_id = config.configurable?.thread_id
		const checkpoint_id = config.configurable?.checkpoint_id
		const checkpoint_ns = config.configurable?.checkpoint_ns ?? ""

		if (!thread_id) throw new Error("没有提供thread_id，无法恢复检查点")

		// 构建 mongodb 的 query 对象（负责查询的）
		const query: any = {
			thread_id,
			checkpoint_ns,
			type: "checkpoint"
		}

		if (checkpoint_id) query.checkpoint_id = checkpoint_id

		// 执行查询
		const doc = (await this.collection.findOne(query, {
			sort: {
				_id: -1 // 按照 _id 进行一个倒序排列，因为默认要获取最新的
			}
		})) as unknown as MongoCheckpointDoc

		// 目前 doc 拿到的是一个文档对象
		// 需要将 doc 这个文档对象还原为 checkpoint
		if (!doc) return undefined

		// 将 checkpoint 以及 metadata 这两个二进制数据重新转换回来
		const checkpoint = await this.serde.loadsTyped(doc.checkpoint_type, doc.checkpoint.toString())

		const metadata = await this.serde.loadsTyped(doc.metadata_type, doc.metadata.toString())

		// 接下来就可以返回符合 langgraph 要求的 CheckpointTuple 对象
		return {
			config: {
				configurable: {
					thread_id,
					checkpoint_ns,
					checkpoint_id: doc.checkpoint_id
				}
			},
			checkpoint,
			metadata,
			parentConfig: doc.parent_checkpoint_id
				? {
						configurable: {
							thread_id,
							checkpoint_ns,
							checkpoint_id: doc.parent_checkpoint_id
						}
					}
				: undefined,
			pendingWrites: []
		}
	}

	// 保存中间写入操作（pending writes）
	async putWrites(config: RunnableConfig, writes: PendingWrite[], taskId: string): Promise<void> {}

	// 提供历史列表
	async *list() {}

	// 删除对应thread_id的所有检查点
	async deleteThread(threadId: string): Promise<void> {}
}
