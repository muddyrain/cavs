// 冒泡排序
function bubbleSort(arr) {
	let len = arr.length
	for (let i = 0; i < len - 1; i++) {
		for (let j = 0; j < len - 1 - i; j++) {
			if (arr[j] > arr[j + 1]) {
				// 交换
				;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
			}
		}
	}
	return arr
}
console.log(bubbleSort([5, 3, 8, 4, 2])) // 输出: [2, 3, 4, 5, 8]
