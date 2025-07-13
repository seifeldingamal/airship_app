import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Slider from "@mui/material/Slider"
import TextField from "@mui/material/TextField"

interface SliderProps {
	id: string
	label?: string
	value: number | number[]
	onChange: (
		event: Event | React.ChangeEvent<HTMLInputElement>,
		newValue: number | number[]
	) => void
	min?: number
	max?: number
	step?: number
	marks?: boolean | { value: number; label: string }[]
	disabled?: boolean
}

const getSmartMarks = (min: number, max: number, step: number) => {
	const count = Math.floor((max - min) / step) + 1
	if (count <= 6) {
		return Array.from({ length: count }, (_, i) => ({
			value: min + i * step,
			label: (min + i * step).toString(),
		}))
	}
	const marks = [{ value: min, label: min.toString() }]
	const intervals = 4
	for (let i = 1; i < intervals; i++) {
		const v = min + ((max - min) * i) / intervals
		marks.push({
			value: Math.round(v / step) * step,
			label: Number(Math.round(v / step) * step).toFixed(1) + "",
		})
	}
	marks.push({ value: max, label: max.toString() })
	return marks
}

const SliderField: React.FC<SliderProps> = ({
	id,
	label,
	value,
	onChange,
	min = 0,
	max = 100,
	step = 1,
	marks = false,
	disabled = false,
	...props
}) => {
	const marksArray = getSmartMarks(
		typeof min === "number" ? min : 0,
		typeof max === "number" ? max : 100,
		typeof step === "number" ? step : 1
	)

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = Number(e.target.value)
		if (!isNaN(newValue)) {
			onChange(e, newValue)
		}
	}

	return (
		<Box sx={{ width: "100%", paddingRight: 8 }}>
			{label && (
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						minHeight: 36,
						flexDirection: "column",
						gap: 1,
					}}
				>
					<Typography
						id={id}
						gutterBottom
						sx={{
							fontWeight: "bold",
							fontFamily: "monospace",
							color: "#222b3d",
							whiteSpace: "wrap",
						}}
					>
						{label}:
					</Typography>
					<TextField
						variant='standard'
						type='number'
						value={typeof value === "number" ? value : value[0]}
						onChange={handleInputChange}
						slotProps={{
							input: {
								inputProps: {
									min,
									max,
									step,
									style: {
										marginLeft: "10px",
										fontWeight: "bold",
										fontFamily: "monospace",
										color: "#1976d2",
										textAlign: "center",
										background: "transparent",
										fontSize: 14,
										width: `calc(${
											String(value).length * 2
										}ch)`,
										minWidth: 40,
										maxWidth: 80,
										transition: "width 0.2s",
									},
								},
							},
						}}
						sx={{
							"& .MuiInputBase-root": {
								fontFamily: "monospace",
								fontWeight: "bold",
								color: "#1976d2",
							},
							"& .MuiInput-underline:before": {
								borderColor: "#1976d2",
							},
							"& .MuiInput-underline:hover:before": {
								borderColor: "#1976d2",
							},
						}}
					/>
				</Box>
			)}
			<Slider
				{...props}
				marks={marksArray}
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={onChange}
				disabled={disabled}
				sx={{
					m: 1,
					color: "#1976d2",
					height: 8,
					"& .MuiSlider-thumb": {
						height: 20,
						width: 20,
						backgroundColor: "#fff",
						border: "2px solid currentColor",
						"&:hover, &.Mui-focusVisible": {
							boxShadow: "inherit",
						},
					},
					"& .MuiSlider-track": {
						height: 14,
					},
					"& .MuiSlider-rail": {
						height: 10,
					},
					"& .MuiSlider-markLabel": {
						fontFamily: "monospace",
					},
				}}
			/>
		</Box>
	)
}

export default SliderField
