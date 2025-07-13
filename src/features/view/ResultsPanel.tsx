import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Alert from "@mui/material/Alert"
import Stack from "@mui/material/Stack"
import useAirshipStore from "../airship/AirshipStore"
import { blue, green, blueGrey, yellow } from "@mui/material/colors"

export const ResultsPanel = () => {
	const { L, D, V, a, nG, xCB, summary } = useAirshipStore()

	return (
		<Box sx={{ p: 3, width: "100%" }}>
			<Typography variant='h5' fontWeight='bold' mb={1}>
				{" "}
				Design Results
			</Typography>
			<Grid container rowSpacing={4} columnSpacing={8} columns={12}>
				<Grid size={{ xs: 12, md: 6, lg: 6 }}>
					<Box>
						<Typography
							variant='h6'
							fontWeight='bold'
							mt={3}
							mb={1}
						>
							Primary Dimensions
						</Typography>
						<Stack spacing={1}>
							<ResultItem
								label='Length (L)'
								value={L.toFixed(3)}
								unit='m'
							/>
							<ResultItem
								label='Diameter (D)'
								value={D.toFixed(3)}
								unit='m'
							/>
							<ResultItem
								label='Volume (V)'
								value={V.toFixed(3)}
								unit='m³'
							/>
							<ResultItem
								label='Number of Gores (nG)'
								value={nG}
								unit='(-)'
							/>
							<ResultItem
								label='Center of Buoyancy (xCB)'
								value={xCB.toFixed(3)}
								unit='m from bow'
							/>
						</Stack>
					</Box>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 6 }}>
					<Box>
						<Typography
							variant='h6'
							fontWeight='bold'
							mt={3}
							mb={1}
						>
							Shape Coefficients
						</Typography>
						<Grid container spacing={2} columns={6}>
							{a.map((coeff, index) => (
								<Grid
									key={index}
									size={{ xs: 6, sm: 6, md: 3 }}
								>
									<Paper
										key={index}
										elevation={0}
										sx={{
											backgroundColor:
												blueGrey[
													`${
														600 - index * 100
													}` as keyof typeof blueGrey
												],
											p: 1,
											borderRadius: 1,
											textAlign: "center",
										}}
									>
										<Typography
											variant='body1'
											color='text.secondary'
										>
											a<sub>{index + 1}</sub>
										</Typography>
										<Typography
											variant='body2'
											fontWeight='bold'
											fontFamily='monospace'
											sx={{ mt: 0.5 }}
										>
											{coeff.toExponential(2)}
										</Typography>
									</Paper>
								</Grid>
							))}
						</Grid>
					</Box>
				</Grid>
				<Grid size={{ xs: 12, md: 6, lg: 6 }}>
					<Box>
						<Typography
							variant='h6'
							fontWeight='bold'
							mt={3}
							mb={1}
						>
							Performance
						</Typography>
						<Stack spacing={1}>
							<ResultItem
								label='Envelope Weight'
								value={summary.envelopeWeight.toFixed(3)}
								unit='kg'
							/>
							<ResultItem
								label='Lift Capacity'
								value={summary.liftCapacity.toFixed(3)}
								unit='kg'
							/>
						</Stack>
					</Box>
				</Grid>

				<Grid size={{ xs: 12, md: 6, lg: 6 }}>
					<Box sx={{ mt: 2 }}>
						<Typography
							variant='h6'
							fontWeight='bold'
							mt={3}
							mb={1}
						>
							Integration Results
						</Typography>
						<Grid container spacing={2} columns={12}>
							<Grid size={{ xs: 12, sm: 12, lg: 6 }}>
								<Paper
									elevation={0}
									sx={{
										p: 1.5,
										borderRadius: 1,
										backgroundColor: blue[50],
										textAlign: "center",
										display: "flex",
										flexDirection: "column",
										justifyContent: "space-around",
									}}
								>
									<Typography
										variant='body2'
										color='primary.main'
									>
										Surface Area
									</Typography>
									<Typography
										variant='body1'
										fontWeight='bold'
										fontFamily='monospace'
									>
										{summary.surfaceArea.toFixed(3)} m²
									</Typography>
								</Paper>
							</Grid>
							<Grid size={{ xs: 12, sm: 12, lg: 6 }}>
								<Paper
									elevation={0}
									sx={{
										height: "100%",
										p: 1.5,
										borderRadius: 1,
										backgroundColor: green[50],
										textAlign: "center",
										display: "flex",
										flexDirection: "column",
										justifyContent: "space-around",
									}}
								>
									<Typography
										variant='body2'
										color='success.main'
									>
										Volume (Integrated)
									</Typography>
									<Typography
										variant='body1'
										fontWeight='bold'
										fontFamily='monospace'
									>
										{summary.integratedVolume.toFixed(3)} m³
									</Typography>
								</Paper>
							</Grid>
							<Grid size={{ xs: 12, sm: 12, lg: 12 }}>
								<Paper
									elevation={0}
									sx={{
										p: 3,
										borderRadius: 1,
										backgroundColor: yellow[50],
										textAlign: "center",
										display: "flex",
										flexDirection: "column",
										justifyContent: "space-around",
									}}
								>
									<Typography
										variant='body2'
										color='success.main'
									>
										Cost excl. VAT (Estimation)
									</Typography>
									<Typography
										variant='body1'
										fontWeight='bold'
										fontFamily='monospace'
									>
										{summary.cost.toFixed(0)} €
									</Typography>
								</Paper>
							</Grid>
						</Grid>

						{Math.abs(summary.integratedVolume - V) > 0.01 && (
							<Alert severity='warning' sx={{ mt: 2 }}>
								Note: Integrated volume differs from theoretical
								volume by{" "}
								{(summary.integratedVolume - V).toFixed(3)} m³ (
								{Math.abs(
									((summary.integratedVolume - V) / V) * 100
								).toFixed(1)}
								%)
							</Alert>
						)}
					</Box>
				</Grid>
			</Grid>
		</Box>
	)
}

type ResultItemProps = {
	label: string
	value: string | number
	unit?: string
}

const ResultItem = ({ label, value, unit = "(-)" }: ResultItemProps) => (
	<Grid
		container
		spacing={2}
		alignItems='end'
		justifyContent='space-between'
		columns={2}
	>
		<Grid size={1}>
			<Typography variant='body1' color='text.secondary'>
				{label}:
			</Typography>
		</Grid>
		<Grid size={1}>
			<Typography variant='body1' fontWeight='500' fontFamily='monospace'>
				{value}{" "}
				{unit && (
					<Typography
						component='span'
						variant='body1'
						color='text.secondary'
					>
						{unit}
					</Typography>
				)}
			</Typography>
		</Grid>
	</Grid>
)
