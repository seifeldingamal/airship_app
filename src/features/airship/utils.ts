/**
 * Based on Gertler Series58 Model 4621 Spreadsheet
 * © 2023 [Author/Source]
 * License: [e.g. CC-BY-4.0 or MIT]
 */

import { inv, matrix, multiply } from "mathjs"
import { AppState } from "../../models/Airship"

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
function calculatePerformance(
	S: number,
	rhoS: number,
	V: number,
	L: number,
	D: number,
	PI: number
) {
	const envelopeWeight = S * rhoS
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
	const patternPoints = []
	let cumulativeS = 0
	let surfaceArea = 0
	let integratedVolume = 0
	let prevPoint: any = null

	for (let i = 0; i < n; i++) {
		const phi = (PI / n) * i
		const x2L = (1 - Math.cos(phi)) / 2

		let r2D2 = 0
		for (let j = 0; j < 6; j++) r2D2 += a[j] * Math.pow(x2L, j + 1)

		const r2D = Math.sqrt(Math.max(0, r2D2))
		const x = x2L * L
		const r = r2D * D
		const nr = -r

		let dx = 0,
			dr = 0,
			ds = 0,
			U = 0,
			nU = 0,
			h = 0,
			sPrime = 0,
			theta = 0,
			xP = 0,
			yP = 0,
			nyP = 0

		if (prevPoint) {
			dx = x - prevPoint.x
			dr = r - prevPoint.r
			ds = Math.sqrt(dx * dx + dr * dr)
			cumulativeS += ds

			const dS = dx * nG * (prevPoint.U + U)
			surfaceArea += dS

			const dV =
				dx * (prevPoint.r * prevPoint.r + prevPoint.r * r + r * r)
			integratedVolume += dV

			const drdx = dr / dx
			h = r / drdx
			sPrime = Math.sqrt(r * r + h * h) * Math.sign(h)
			U = (PI * r) / nG
			nU = -U
			theta = U / (2 * sPrime)

			xP = cumulativeS - sPrime + sPrime * Math.cos(theta)
			yP = sPrime * Math.sin(theta)
			nyP = -yP
		}

		const point = {
			s: i,
			phi,
			x2L,
			r2D2,
			r2D,
			x,
			r,
			nr,
			dx,
			dr,
			ds,
			cumulativeS,
			U,
			nU,
			drdx: 0,
			h,
			sPrime,
			theta,
			xP,
			yP,
			nyP,
			dxP: 0,
			dSPrime: 0,
		}

		patternPoints.push(point)
		prevPoint = point
	}

	// Calculate differentials after all points are generated
	for (let i = 0; i < patternPoints.length - 1; i++) {
		if (i !== 0) {
			const prev = patternPoints[i - 1]
			const curr = patternPoints[i]
			const next = patternPoints[i + 1]
			curr.drdx =
				(prev.r - curr.r) / (prev.x - curr.x) -
				(prev.r - next.r) / (prev.x - next.x) +
				(curr.r - next.r) / (curr.x - next.x)
		}
		patternPoints[i].dxP = patternPoints[i + 1].xP - patternPoints[i].xP
		patternPoints[i].dSPrime =
			nG *
			patternPoints[i].dxP *
			(patternPoints[i + 1].yP + patternPoints[i].yP)
	}

	// Handle first and last point
	patternPoints[0].drdx =
		(patternPoints[1].r - patternPoints[0].r) /
		(patternPoints[1].x - patternPoints[0].x)

	const lastIdx = patternPoints.length - 1
	patternPoints[lastIdx].drdx =
		(patternPoints[lastIdx].r - patternPoints[lastIdx - 1].r) /
		(patternPoints[lastIdx].x - patternPoints[lastIdx - 1].x)
	const lastPoint = patternPoints[lastIdx]
	lastPoint.dxP = 0
	lastPoint.dSPrime = 0

	integratedVolume = (PI / 3) * integratedVolume

	return { patternPoints, surfaceArea, integratedVolume }
}

function calculateCenterOfBuoyancy(a: number[], L: number) {
	let num = 0,
		den = 0
	for (let i = 0; i < 6; i++) {
		num += a[i] / (i + 2)
		den += a[i] / (i + 1)
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
	const S = 2 * PI * Math.pow(D / 2, 2) + PI * D * L

	const xCB = calculateCenterOfBuoyancy(a, L)
	const performance = calculatePerformance(S, state.inputs!.rhoS, V, L, D, PI)
	const n = state.inputs!.n
	const nG = state.inputs!.nG

	const { patternPoints, surfaceArea, integratedVolume } =
		calculatePatternPoints(a, L, D, n, nG, PI)

	const cost = calculateCost(nG, L)

	return {
		L,
		D,
		V,
		S,
		a,
		xCB,
		performance,
		patternPoints,
		surfaceArea,
		integratedVolume,
		cost,
	}
}

const calculateCost = (nG: number, L: number) => {
	return nG * L * 11
}
