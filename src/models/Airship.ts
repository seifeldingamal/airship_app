export interface Airship {
	inputs: Inputs
	a: number[] // Polynomial coefficients [a1, a2, a3, a4, a5, a6]
	// Outputs
	L: number
	D: number
	V: number
	S: number
	xCB: number
	patternPoints: PatternPoint[]
	surfaceArea: number
	integratedVolume: number
	performance: PerformanceMetrics
}

interface Inputs {
	n: number
	nG: number
	L2D: number
	Vb: number
	m: number
	ro: number
	rl: number
	Cp: number
	rhoS: number
}

interface PatternPoint {
	s: number
	phi: number
	x2L: number
	r2D2: number
	r2D: number
	x: number
	r: number
	nr: number
	dx: number
	dr: number
	ds: number
	cumulativeS: number
	U: number
	nU: number
	drdx: number
	h: number
	sPrime: number
	theta: number
	xP: number
	yP: number
	nyP: number
	dxP: number
	dSPrime: number
}

interface PerformanceMetrics {
	envelopeWeight: number
	liftCapacity: number
	surfaceCoefficient: number
}

export type AppState = Airship & {
	updateInput: (name: keyof Airship, value: number | string) => void
	calculate: () => void
}
