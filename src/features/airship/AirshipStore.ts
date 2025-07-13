import { create } from "zustand"
import { AppState } from "../../models/Airship"
import { calculateInitialState } from "./utils"

const useAirshipStore = create<AppState>((set) => {
	const initialState = {
		inputs: {
			n: 50,
			L2D: 5,
			Vb: 4,
			m: 0.4,
			ro: 0.6,
			rl: 0.2,
			Cp: 0.65,
			rhoS: 30,
		},
	}

	const calculatedState = calculateInitialState(initialState as AppState)

	return {
		...initialState,
		...calculatedState,

		updateInput: (name, value) =>
			set((state) => {
				if (name in state.inputs) {
					const newInputs = { ...state.inputs, [name]: value }
					const newState = { ...state, inputs: newInputs }
					return {
						...newState,
						...calculateInitialState(newState),
					}
				}
				return state
			}),

		calculate: () =>
			set((state) => ({
				...state,
				...calculateInitialState(state),
			})),
	}
})

export default useAirshipStore
