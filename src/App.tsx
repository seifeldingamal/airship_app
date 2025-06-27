import { memo } from "react"
import { InputPanel } from "./features/view/InputPanel"
import { ResultsPanel } from "./features/view/ResultsPanel"
import { Airship3DView } from "./features/airship/Airship3DView"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import Divider from "@mui/material/Divider"
import { AirshipGraph } from "./features/airship/AirshipGraph"
import Footer from "./components/Footer"

const MemoizedInputPanel = memo(InputPanel)
const MemoizedResultsPanel = memo(ResultsPanel)
const MemoizedAirship3DView = memo(Airship3DView)
const MemoizedAirshipGraph = memo(AirshipGraph)

export default function App() {
	return (
		<Container
			sx={{
				minHeight: "100vh",
				minWidth: "90vw",
				bgcolor: "#f9fafb",
				paddingTop: 4,
			}}
		>
			<Box component='header' mb={8} textAlign='center'>
				<Typography
					variant='h3'
					fontWeight='bold'
					color='text.primary'
					gutterBottom
				>
					Airship Design Calculator
				</Typography>
				<Typography variant='subtitle1' color='text.secondary'>
					Gertler 4621 Shape Model
				</Typography>
			</Box>

			<Grid container columnSpacing={3} rowSpacing={4} mb={2}>
				<Grid size={{ xs: 12, md: 12, lg: 6 }}>
					<MemoizedInputPanel />

					<Card
						sx={{
							bgcolor: "white",
							p: 3,
							borderRadius: 3,
							boxShadow: 3,
						}}
					>
						<MemoizedResultsPanel />
					</Card>
				</Grid>
				<Grid size={{ xs: 12, md: 12, lg: 6 }}>
					<Box mb={4}>
						<MemoizedAirship3DView />
					</Box>
					<Box mb={4}>
						<MemoizedAirshipGraph />
					</Box>
				</Grid>
			</Grid>

			<Divider sx={{ my: 6 }} />

			<Footer />
		</Container>
	)
}
