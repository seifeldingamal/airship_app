import { ChangeEvent, useMemo } from "react"
import useAirshipStore from "../airship/AirshipStore"
import { Airship } from "../../models/Airship"
import SliderField from "@/components/ui/SliderField"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"

export const InputPanel: React.FC = () => {
	const {
		inputs: { L2D, Vb, m, ro, rl, Cp, rhoS },
		updateInput,
	} = useAirshipStore()

	const handleNumberInput = (key: keyof Airship, value: string) => {
		const numValue = Number(value)
		if (!isNaN(numValue)) {
			updateInput(key, numValue)
		}
	}

	const shapeCoefficients = useMemo(
		() => [
			{
				id: "m",
				label: "Max Thickness Position",
				value: m,
				step: 0.01,
				min: 0.2,
				max: 0.78,
				type: "number",
			},
			{
				id: "rhoS",
				label: "Envelope Material Weight (g/m²)",
				value: rhoS,
				type: "number",
				step: 1,
				min: 10,
				max: 100,
			},
			{
				id: "ro",
				label: "Bow Radius",
				value: ro,
				step: 0.1,
				min: 0,
				max: 2,
				type: "number",
			},
			{
				id: "rl",
				label: "Stern Radius",
				value: rl,
				step: 0.1,
				min: 0,
				max: 1,
				type: "number",
			},
			{
				id: "Cp",
				label: "Prismatic Coefficient",
				value: Cp,
				step: 0.01,
				min: 0.5,
				max: 5,
				type: "number",
			},
		],
		[m, ro, rl, Cp, rhoS]
	)

	const mainInputs = [
		{
			id: "L2D",
			label: "L/D Ratio",
			value: L2D,
			type: "number",
			step: 0.1,
			min: 1,
			max: 10,
		},
		{
			id: "Vb",
			label: "Block Volume (m³)",
			value: Vb,
			type: "number",
			step: 0.1,
			min: 0.1,
			max: 10,
		},
	]

	return (
		<>
			<Box mb={4}>
				<Card
					sx={{
						bgcolor: "white",
						p: 3,
						borderRadius: 3,
						boxShadow: 3,
					}}
				>
					<CardContent>
						<Typography variant='h5' fontWeight='bold' mb={3}>
							Design Parameters
						</Typography>
						<Grid
							container
							rowSpacing={3}
							columnSpacing={2}
							mb={2}
							columns={12}
						>
							{mainInputs.map((input) => (
								<Grid
									size={{ xs: 12, sm: 12, md: 6 }}
									key={input.id}
								>
									<Box width='100%'>
										<SliderField
											id={input.id}
											label={input.label}
											value={Number(input.value)}
											step={input.step}
											min={input.min}
											max={input.max}
											onChange={(
												_event:
													| Event
													| ChangeEvent<HTMLInputElement>,
												newValue: number | number[]
											) =>
												handleNumberInput(
													input.id as keyof Airship,
													Array.isArray(newValue)
														? String(newValue[0])
														: String(newValue)
												)
											}
										/>
									</Box>
								</Grid>
							))}
						</Grid>
					</CardContent>
				</Card>
			</Box>
			<Box mb={4}>
				<Card
					sx={{
						bgcolor: "white",
						p: 3,
						borderRadius: 3,
						boxShadow: 3,
					}}
				>
					<CardContent>
						<Typography variant='h5' fontWeight='bold' mb={3}>
							Shape Coefficients
						</Typography>
						<Grid
							container
							rowSpacing={3}
							columnSpacing={2}
							mb={2}
							columns={12}
						>
							{shapeCoefficients.map((item) => (
								<Grid
									size={{ xs: 12, sm: 12, md: 6 }}
									key={item.id}
								>
									<Box width='100%'>
										<SliderField
											id={item.id}
											label={item.label}
											value={Number(item.value)}
											step={item.step}
											min={item.min}
											max={item.max}
											onChange={(
												_event:
													| Event
													| ChangeEvent<HTMLInputElement>,
												newValue: number | number[]
											) =>
												handleNumberInput(
													item.id as keyof Airship,
													Array.isArray(newValue)
														? String(newValue[0])
														: String(newValue)
												)
											}
										/>
									</Box>
								</Grid>
							))}
						</Grid>
					</CardContent>
				</Card>
			</Box>
		</>
	)
}
