import { lazy, memo, Suspense } from "react"
import { InputPanel } from "./features/view/InputPanel"
import { ResultsPanel } from "./features/view/ResultsPanel"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import Divider from "@mui/material/Divider"
import { AirshipGraph } from "./features/airship/AirshipGraph"
import Footer from "./components/Footer"
import CircularProgress from "@mui/material/CircularProgress"
import RedirectComponent from "./components/ui/RedirectButton"
import ContactForm from "./components/ContactForm"

const Airship3DView = lazy(() => import("./features/airship/Airship3DView"))

const MemoizedInputPanel = memo(InputPanel)
const MemoizedResultsPanel = memo(ResultsPanel)
const MemoizedAirship3DView = memo(Airship3DView)
const MemoizedAirshipGraph = memo(AirshipGraph)

export default function App() {
	console.log("Environment Variables:")
	console.log("BASE_URL:", import.meta.env.BASE_URL)
	console.log("MODE:", import.meta.env.MODE)
	console.log("DEPLOY_URL:", import.meta.env.VITE_DEPLOY_URL)
	return (
		<Container
			sx={{
				minHeight: "100vh",
				minWidth: "90vw",
				bgcolor: "#f9fafb",
				paddingTop: 4,
			}}
		>
			<Box component='header' mb={4} textAlign='center'>
				<Typography
					variant='h3'
					fontWeight='bold'
					color='text.primary'
					gutterBottom
				>
					Airship Design Calculator
				</Typography>
				<Typography variant='subtitle1' color='text.secondary'>
					Gertler Shape Model
				</Typography>

				<RedirectComponent />
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
						<Suspense fallback={<CircularProgress />}>
							<MemoizedAirship3DView />
						</Suspense>
					</Box>
					<Box mb={4}>
						<MemoizedAirshipGraph />
					</Box>
					<Box>
						<ContactForm />
					</Box>
				</Grid>
			</Grid>

			<Divider sx={{ my: 6 }} />

			<Footer />
		</Container>
	)
}
