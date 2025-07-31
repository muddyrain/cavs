#!/bin/bash
# 删除当前目录及子目录下所有 node_modules 文件夹

find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

echo "所有 node_modules 文件夹已删除。"