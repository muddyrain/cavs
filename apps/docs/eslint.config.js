// 导入预设配置
import js from "@eslint/js";

// 导入共享配置文件
import { eslintConfig } from "@cavs/eslint-config";

/**
 * ESLint configuration for spreadsheet package
 * @type {import('eslint').ESLint}
 */
export default {
  extends: [js.configs.recommended, eslintConfig],
};
