import { exampleSetup } from "prosemirror-example-setup"
import { Plugin } from "prosemirror-state"
import { inputPlugins } from "@/plugins/inputRules"
import { keymapPlugins } from "@/plugins/keymap"
import { schema } from "@/schemas"
import { exitMarkPlugins } from "./exitMark"

export const plugins: Plugin[] = [
	...exampleSetup({ schema, menuBar: false }),
	...exitMarkPlugins,
	keymapPlugins,
	inputPlugins
]
