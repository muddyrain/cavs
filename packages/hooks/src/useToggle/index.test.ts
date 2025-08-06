import { act, renderHook } from "@testing-library/react"
import { expect, test } from "vitest"
import { useToggle } from "./index"

test("should toggle state", () => {
	const { result } = renderHook(() => useToggle(false))

	expect(result.current[0]).toBe(false)

	act(() => {
		result.current[1]()
	})

	expect(result.current[0]).toBe(true)
})
