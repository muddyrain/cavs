/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
	// 每行最大长度，超出自动换行
	printWidth: 100,
	// tab 占用空格数
	tabWidth: 2,
	// 是否使用 tab 字符代替空格
	useTabs: true,
	// 语句末尾是否加分号
	semi: false,
	// 是否使用单引号（true 单引号，false 双引号）
	singleQuote: false,
	// 对象属性是否加引号（as-needed 需要时加）
	quoteProps: "as-needed",
	// JSX 属性是否使用单引号
	jsxSingleQuote: false,
	// 尾随逗号（none 不加，es5 ES5 支持的地方加，all 所有多行结构都加）
	trailingComma: "none",
	// 对象字面量括号间是否加空格
	bracketSpacing: true,
	// JSX > 是否另起一行
	jsxBracketSameLine: false,
	// 箭头函数参数是否加括号（always 总是加，avoid 一个参数时不加）
	arrowParens: "always",
	// Markdown 文本如何换行（preserve 保持原样）
	proseWrap: "preserve",
	// HTML 空白敏感度（css 按 CSS 规则）
	htmlWhitespaceSensitivity: "css",
	// 换行符风格（lf Unix，crlf Windows，cr 老 Mac，auto 自动检测）
	endOfLine: "lf",
	// Prettier 插件列表
	plugins: ["prettier-plugin-packagejson"]
}

export default config
