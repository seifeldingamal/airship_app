import { useRef, useEffect } from "react"
import useAirshipStore from "../airship/AirshipStore"
import { select, scaleLinear, axisBottom, axisLeft, line } from "d3"
import Card from "@mui/material/Card"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import CardContent from "@mui/material/CardContent"
import { blue, red } from "@mui/material/colors"

export const AirshipGraph = () => {
	const { patternPoints, xCB } = useAirshipStore()
	const svgRef = useRef<SVGSVGElement>(null)

	const width = 600
	const height = 250
	const margin = { top: 20, right: 20, bottom: 40, left: 40 }

	useEffect(() => {
		if (!svgRef.current || !patternPoints.length) return

		const svg = select(svgRef.current)
		svg.selectAll("*").remove()

		// Calculate min/max for x and y
		const minX = 0
		const maxX = 5
		const minY = -1
		const maxY = 1

		// Add padding (10% on each side)
		const xPad = (maxX - minX) * 0.3
		const yPad = (maxY - minY) * 0.3

		const x = scaleLinear()
			.domain([minX - xPad, maxX + xPad])
			.range([margin.left, width - margin.right])
		const y = scaleLinear()
			.domain([minY - yPad, maxY + yPad])
			.range([height - margin.bottom, margin.top])

		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(axisBottom(x))

		svg.append("g")
			.attr("transform", "translate(" + margin.left + ",0)")
			.call(axisLeft(y))

		const lineUpper = line<{ x: number; r: number }>()
			.x((d) => x(d.x))
			.y((d) => y(d.r))

		svg.append("path")
			.datum(patternPoints)
			.attr("fill", "none")
			.attr("stroke", blue[300])
			.attr("stroke-width", 2)
			.attr("stroke-dasharray", "4 2")
			.attr("d", lineUpper)

		const lineLower = line<{ x: number; nr: number }>()
			.x((d) => x(d.x))
			.y((d) => y(d.nr))

		svg.append("path")
			.datum(patternPoints)
			.attr("fill", "none")
			.attr("stroke", blue[300])
			.attr("stroke-width", 2)
			.attr("stroke-dasharray", "4 2")
			.attr("d", lineLower)

		svg.append("g")
			.selectAll("circle")
			.data(patternPoints)
			.enter()
			.append("circle")
			.attr("cx", (d) => x(d.x))
			.attr("cy", (d) => y(d.nr))
			.attr("r", 2)
			.attr("fill", blue[500])

		svg.append("g")
			.selectAll("circle")
			.data(patternPoints)
			.enter()
			.append("circle")
			.attr("cx", (d) => x(d.x))
			.attr("cy", (d) => y(d.r))
			.attr("r", 2)
			.attr("fill", blue[500])

		svg.append("circle")
			.attr("cx", x(xCB))
			.attr("cy", y(0))
			.attr("r", 2)
			.attr("fill", red[300])

		svg.append("text")
			.attr("x", x(xCB) + 5)
			.attr("y", y(0) - 5)
			.text("xCB")
			.attr("fill", red[300])
			.attr("font-size", "8px")
	}, [patternPoints, xCB])

	return (
		<Card sx={{ bgcolor: "white", p: 3, borderRadius: 3, boxShadow: 3 }}>
			<CardContent>
				<Typography variant='h5' fontWeight='bold' mb={3}>
					Envelope Pattern Development
				</Typography>
				<Box mb={4}>
					<svg
						ref={svgRef}
						width='100%'
						height='600'
						viewBox={`0 0 ${width} ${height}`}
						preserveAspectRatio='xMidYMid meet'
					/>
				</Box>
			</CardContent>
		</Card>
	)
}
