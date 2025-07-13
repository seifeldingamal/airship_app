import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Typography,
} from "@mui/material"
import EmailIcon from "@mui/icons-material/Email"
import { useState } from "react"
import useAirshipStore from "@/features/airship/AirshipStore"

const ContactForm = () => {
	const urlParams = new URLSearchParams(window.location.search)
	const contactEmail = urlParams.get("email") // e.g., ?email=support@example.com
	const { inputs } = useAirshipStore()

	const [open, setOpen] = useState(false)
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	})

	const handleOpen = () => setOpen(true)
	const handleClose = () => {
		setOpen(false)
		// Reset form when closing
		setFormData({
			name: "",
			email: "",
			subject: "",
			message: "",
		})
	}

	const handleInputChange =
		(field: keyof typeof formData) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setFormData((prev) => ({
				...prev,
				[field]: event.target.value,
			}))
		}

	const handleSubmit = () => {
		// Create mailto link with form data
		const subject = encodeURIComponent(
			formData.subject || "Airship Design Calculator Inquiry"
		)
		const body = encodeURIComponent(
			`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
		)

		// Open default email client
		window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`

		handleClose()
	}

	const generateReportFile = () => {
		const data = {
			...formData,
			...inputs,
		}

		const blob = new Blob([JSON.stringify(data, null, 2)], {
			type: "application/json",
		})
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = "airship-calculator-report.json"
		a.click()
		URL.revokeObjectURL(url)
	}

	const isFormValid =
		formData.name.trim() && formData.email.trim() && formData.message.trim()

	if (!contactEmail) {
		return null
	}

	return (
		<Box align='center' pt={4}>
			<Button
				variant='outlined'
				color='primary'
				size='large'
				onClick={handleOpen}
				startIcon={<EmailIcon />}
				sx={{ borderRadius: 2 }}
			>
				{`Contact Us`}
			</Button>

			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth='sm'
				fullWidth
				sx={{ borderRadius: 3 }}
			>
				<DialogTitle>
					<Typography variant='h6' component='div' mb={1}>
						Get in Touch
					</Typography>
					<Typography variant='body2' color='text.secondary'>
						We'd love to hear from you. Send us a message and we'll
						respond as soon as possible.
					</Typography>
				</DialogTitle>

				<DialogContent>
					<Box component='form' sx={{ mt: 1 }}>
						<TextField
							autoFocus
							fullWidth
							label='Name'
							margin='normal'
							variant='outlined'
							value={formData.name}
							onChange={handleInputChange("name")}
							error={formData.name.trim().length === 0}
							required
						/>
						<TextField
							fullWidth
							label='Email'
							type='email'
							margin='normal'
							variant='outlined'
							value={formData.email}
							onChange={handleInputChange("email")}
							error={formData.email.trim().length === 0}
							required
						/>
						<TextField
							fullWidth
							label='Subject'
							margin='normal'
							variant='outlined'
							value={formData.subject}
							onChange={handleInputChange("subject")}
							placeholder='Airship Design Inquiry'
						/>
						<TextField
							fullWidth
							label='Message'
							multiline
							rows={4}
							margin='normal'
							variant='outlined'
							value={formData.message}
							onChange={handleInputChange("message")}
							placeholder='Tell us about your project or question...'
							error={formData.message.trim().length === 0}
							required
						/>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<Typography
								mt={2}
								maxWidth='70%'
								variant='subtitle1'
								color='text.secondary'
								whiteSpace='wrap'
							>
								*Want to request a quote? Please download this
								file and attach to your email.
							</Typography>
							<Button
								variant='outlined'
								size='small'
								onClick={generateReportFile}
								disabled={!isFormValid}
								sx={{
									maxHeight: 60,
								}}
							>
								Download
							</Button>
						</Box>
					</Box>
				</DialogContent>

				<DialogActions sx={{ px: 3, pb: 3 }}>
					<Button onClick={handleClose} color='inherit'>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						variant='contained'
						disabled={!isFormValid}
						sx={{ borderRadius: 2 }}
					>
						Send Message
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	)
}

export default ContactForm
