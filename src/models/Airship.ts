export interface Airship {
	inputs: Inputs
	a: number[] // Polynomial coefficients [a1, a2, a3, a4, a5, a6]
	// Outputs
	L: number
	D: number
	V: number
	nG: number
	xCB: number
	patternPoints: PatternPoint[]
	summary: Summary
}

interface Inputs {
	n: number
	L2D: number
	Vb: number
	m: number
	ro: number
	rl: number
	Cp: number
	rhoS: number
}

export interface PatternPoint {
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
	thetaDegree: number
	xP: number
	yP: number
	nyP: number
	dxP: number
	dSPrime: number
	SV: number
}

interface Summary {
	envelopeWeight: number
	liftCapacity: number
	surfaceCoefficient: number
	surfaceArea: number
	integratedVolume: number
	cost: number
}

export type AppState = Airship & {
	updateInput: (name: keyof Airship, value: number | string) => void
	calculate: () => void
}
