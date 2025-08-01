import { useCallback, useState } from "react"

/**
 * A custom hook that manages a boolean toggle state.
 * @param initialState Initial state of the toggle, default is false
 * @returns A tuple containing the current state and a function to toggle the state
 */
export const useToggle = (initialState = false): [boolean, () => void] => {
	const [state, setState] = useState(initialState)
	const toggle = useCallback(() => setState((state) => !state), [])
	return [state, toggle]
}
