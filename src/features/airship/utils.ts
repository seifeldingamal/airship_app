/**
 * Based on Gertler Series58 Model 4621 Spreadsheet
 * © 2023 [Author/Source]
 * License: [e.g. CC-BY-4.0 or MIT]
 */

import { inv, matrix, multiply } from "mathjs"
import { AppState, PatternPoint } from "../../models/Airship"
// --- Helper functions ---

// Calculate polynomial coefficients for the airship profile
export const calculateCoefficients = (state: AppState) => {
	const { m, ro, rl, Cp } = state.inputs!

	const r1 = Array(5).fill(0)
	const r2 = Array(6).fill(1)
	const r3 = Array.from({ length: 6 }, (_, i) => i + 2)
	const r4 = Array.from({ length: 6 }, (_, i) => Math.pow(m, i + 1))
	const r5 = Array.from({ length: 6 }, (_, i) => (i + 1) * Math.pow(m, i))
	const r6 = Array.from({ length: 6 }, (_, i) => 1 / (i + 2))

	const LHS = matrix([[1, ...r1], r2, r3, r4, r5, r6])

	const RHS = matrix([2 * ro, 0, -2 * rl, 1 / 4, 0, Cp / 4])

	return multiply(inv(LHS), RHS).toArray() as number[]
}

// Calculate performance metrics based on airship parameters
function calculateSummary(
	S: number,
	rhoS: number,
	V: number,
	L: number,
	D: number,
	PI: number
) {
	const envelopeWeight = S * (rhoS / 1000)
	const liftCapacity = V - envelopeWeight
	const surfaceCoefficient = S / (L * PI * D)
	return { envelopeWeight, liftCapacity, surfaceCoefficient }
}

// Calculate pattern points for the airship based on polynomial coefficients and other parameters
function calculatePatternPoints(
	a: number[],
	L: number,
	D: number,
	n: number,
	nG: number,
	PI: number
) {
	const patternPoints = initializePoints(n)

	calculatePhi(patternPoints, PI, n)
	calculateX2L(patternPoints, n)
	calculateR2D2(patternPoints, a, n)
	calculateR2D(patternPoints, n)
	calculateXR(patternPoints, L, D, n)
	calculateDeltas(patternPoints, n)
	calculateCumulativeS(patternPoints, n)
	calculateU(patternPoints, PI, nG, n)
	calculateDRDX(patternPoints, n)
	calculateH(patternPoints, n)
	calculateSPrime(patternPoints, n)
	calculateTheta(patternPoints, PI, n)
	calculateXYP(patternPoints, n)
	calculateDXP(patternPoints, n)

	const surfaceArea = calculateDSPrime(patternPoints, nG, n)
	const integratedVolume = calculateSegmentVolume(patternPoints, n)

	return {
		patternPoints,
		surfaceArea,
		integratedVolume: (PI / 3) * integratedVolume,
	}
}

function noNegativeZero(n: number) {
	const threshold = 1 / Math.pow(10, 12)
	if (Math.abs(n) < threshold && n !== 0) {
		return 0
	}
	return n + 0
}

function initializePoints(n: number) {
	const points = []
	for (let i = 0; i <= n; i++) {
		points.push({
			s: i,
			phi: 0,
			x2L: 0,
			r2D2: 0,
			r2D: 0,
			x: 0,
			r: 0,
			nr: 0,
			dx: 0,
			dr: 0,
			ds: 0,
			cumulativeS: 0,
			U: 0,
			nU: 0,
			drdx: 0,
			h: 0,
			sPrime: 0,
			theta: 0,
			thetaDegree: 0,
			xP: 0,
			yP: 0,
			nyP: 0,
			dxP: 0,
			dSPrime: 0,
			SV: 0,
		})
	}
	return points
}

function calculatePhi(points: PatternPoint[], PI: number, n: number) {
	for (let i = 0; i <= n; i++) {
		points[i].phi = (PI / n) * i
	}
}

function calculateX2L(points: PatternPoint[], n: number) {
	for (let i = 0; i <= n; i++) {
		points[i].x2L = (1 - Math.cos(points[i].phi)) / 2
	}
}

function calculateR2D2(points: PatternPoint[], a: number[], n: number) {
	for (let i = 0; i <= n; i++) {
		let r2D2 = 0
		for (let j = 0; j < 6; j++) {
			r2D2 += a[j] * Math.pow(points[i].x2L, j + 1)
		}
		points[i].r2D2 = noNegativeZero(r2D2)
	}
}

function calculateR2D(points: PatternPoint[], n: number) {
	for (let i = 0; i <= n; i++) {
		points[i].r2D = Math.sqrt(points[i].r2D2)
	}
}

function calculateXR(points: PatternPoint[], L: number, D: number, n: number) {
	for (let i = 0; i <= n; i++) {
		points[i].x = noNegativeZero(points[i].x2L * L)
		points[i].r = noNegativeZero(points[i].r2D * D)
		points[i].nr = noNegativeZero(-1 * points[i].r)
	}
}

function calculateDeltas(points: PatternPoint[], n: number) {
	for (let i = 0; i <= n; i++) {
		if (i == 0) continue
		const prev = points[i - 1]
		points[i].dx = noNegativeZero(points[i].x - prev.x)
		points[i].dr = noNegativeZero(points[i].r - prev.r)
		points[i].ds = noNegativeZero(
			Math.sqrt(points[i].dx * points[i].dx + points[i].dr * points[i].dr)
		)
	}
}

function calculateCumulativeS(points: PatternPoint[], n: number) {
	let cumulative = 0
	for (let i = 0; i <= n; i++) {
		if (i == 0) continue
		cumulative += points[i].ds
		points[i].cumulativeS = noNegativeZero(cumulative)
	}
}

function calculateU(points: PatternPoint[], PI: number, nG: number, n: number) {
	for (let i = 0; i <= n; i++) {
		points[i].U = noNegativeZero((PI * points[i].r) / nG)
		points[i].nU = noNegativeZero(-1 * points[i].U)
	}
}

function calculateDRDX(points: PatternPoint[], n: number) {
	for (let i = 0; i <= n; i++) {
		if (i == 0) continue
		const prev = points[i - 1]
		const curr = points[i]
		const next = points[i + 1]

		if (i == n) {
			curr.drdx =
				(prev.r - curr.r) / (prev.x - curr.x) -
				(prev.r - 0) / (prev.x - 0) +
				(curr.r - 0) / (curr.x - 0)
			continue
		}
		curr.drdx =
			(prev.r - curr.r) / (prev.x - curr.x) -
			(prev.r - next.r) / (prev.x - next.x) +
			(curr.r - next.r) / (curr.x - next.x)
	}
}

function calculateH(points: PatternPoint[], n: number) {
	for (let i = 0; i <= n; i++) {
		if (i == 0) continue
		const curr = points[i]
		curr.h = noNegativeZero(curr.r / curr.drdx)
	}
}

function calculateSPrime(points: PatternPoint[], n: number) {
	for (let i = 0; i <= n; i++) {
		if (i == 0) continue
		const curr = points[i]
		curr.sPrime =
			Math.sqrt(curr.r * curr.r + curr.h * curr.h) * Math.sign(curr.h)
	}
}

function calculateTheta(points: PatternPoint[], PI: number, n: number) {
	for (let i = 0; i <= n; i++) {
		if (i == 0) continue
		const curr = points[i]
		curr.theta = curr.U / curr.sPrime
		if (i == n) {
			curr.theta = 0
		}
		curr.thetaDegree = curr.theta / (PI * 180)
	}
}

function calculateXYP(points: PatternPoint[], n: number) {
	for (let i = 0; i <= n; i++) {
		const curr = points[i]
		curr.xP =
			curr.cumulativeS - curr.sPrime + curr.sPrime * Math.cos(curr.theta)
		curr.yP = curr.sPrime * Math.sin(curr.theta)
		curr.nyP = -1 * curr.yP
	}
}

function calculateDXP(points: PatternPoint[], n: number) {
	for (let i = 0; i < n; i++) {
		points[i].dxP = points[i + 1].xP - points[i].xP
	}
	points[n].dxP = 0
}

function calculateDSPrime(points: PatternPoint[], nG: number, n: number) {
	let surfaceArea = 0
	for (let i = 0; i < n; i++) {
		points[i].dSPrime =
			nG * points[i].dxP * (points[i + 1].yP + points[i].yP)
		surfaceArea += points[i].dSPrime
	}
	points[n].dSPrime = 0
	return surfaceArea
}

function calculateSegmentVolume(points: PatternPoint[], n: number) {
	let volume = 0
	for (let i = 0; i <= n; i++) {
		const curr = points[i]
		const next = points[i + 1]

		if (i == n) {
			points[i].SV =
				noNegativeZero(0 - curr.x) * (0 ** 2 + 0 * curr.r + curr.r ** 2)
			volume += points[i].SV
			continue
		}
		points[i].SV =
			noNegativeZero(next.x - curr.x) *
			(next.r ** 2 + next.r * curr.r + curr.r ** 2)
		volume += points[i].SV
	}
	return volume
}

function calculateCenterOfBuoyancy(a: number[], L: number) {
	let num = 0,
		den = 0
	for (let i = 0; i < 6; i++) {
		num += a[i] / (i + 3)
		den += a[i] / (i + 2)
	}
	return (num / den) * L
}

// --- Main function ---
export const calculateInitialState = (state: AppState) => {
	const PI = Math.PI

	const a = calculateCoefficients(state)
	const Cb = (state.inputs!.Cp * PI) / 4
	const V = state.inputs!.Vb * Cb
	const L = Math.pow(
		(V * Math.pow(state.inputs!.L2D, 2) * 4) / (state.inputs!.Cp * PI),
		1 / 3
	)

	const D = L / state.inputs!.L2D

	const xCB = calculateCenterOfBuoyancy(a, L)
	const n = state.inputs!.n
	const nG = Math.ceil((D * PI) / 0.8)

	const { patternPoints, surfaceArea, integratedVolume } =
		calculatePatternPoints(a, L, D, n, nG, PI)

	const summary = calculateSummary(
		surfaceArea,
		state.inputs!.rhoS,
		V,
		L,
		D,
		PI
	)

	const cost = calculateCost(nG, patternPoints[n])

	return {
		L,
		D,
		V,
		a,
		nG,
		xCB,
		summary: {
			...summary,
			surfaceArea,
			integratedVolume,
			cost,
		},
		patternPoints,
	}
}

const calculateCost = (nG: number, point: PatternPoint) => {
	const roundedS = Math.ceil(point.cumulativeS / 10) * 10
	return roundedS * nG * 11
}
