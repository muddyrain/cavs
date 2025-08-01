import { renderHook, act } from "@testing-library/react"
import { useToggle } from "."
import { expect, test } from "vitest"

test("should toggle state", () => {
	const { result } = renderHook(() => useToggle(false))

	expect(result.current[0]).toBe(false)

	act(() => {
		result.current[1]()
	})

	expect(result.current[0]).toBe(true)
})
