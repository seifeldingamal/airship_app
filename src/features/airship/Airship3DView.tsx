import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { useMemo } from "react"
import { BufferGeometry, Float32BufferAttribute, TextureLoader } from "three"
import useAirshipStore from "./AirshipStore"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { useLoader } from "@react-three/fiber"

const texturePath =
	process.env.NODE_ENV === "production"
		? "/airship_app/assets/metallic-texture.jpg"
		: "./src/assets/metallic-texture.jpg"

const Pattern2DView = () => {
	const { patternPoints, xCB } = useAirshipStore()
	const angleStep = 5 // degrees
	const angleCount = Math.floor(360 / angleStep)

	const geometry = useMemo(() => {
		if (!patternPoints.length) return null

		const vertices: number[] = []
		const indices: number[] = []

		// Generate vertices, centering the model
		for (let i = 0; i < patternPoints.length; i++) {
			const { x, r } = patternPoints[i]
			const centeredX = x - xCB
			for (let j = 0; j < angleCount; j++) {
				const theta = (j * angleStep * Math.PI) / 180
				const y = r * Math.cos(theta)
				const z = r * Math.sin(theta)
				vertices.push(centeredX, y, z)
			}
		}

		// Generate faces (indices)
		for (let i = 0; i < patternPoints.length - 1; i++) {
			for (let j = 0; j < angleCount; j++) {
				const current = i * angleCount + j
				const next = current + angleCount
				const nextJ = (j + 1) % angleCount
				const currentNext = i * angleCount + nextJ
				const nextNext = currentNext + angleCount

				// Two triangles per quad
				indices.push(current, next, currentNext)
				indices.push(currentNext, next, nextNext)
			}
		}

		const bufferGeometry = new BufferGeometry()
		bufferGeometry.setAttribute(
			"position",
			new Float32BufferAttribute(vertices, 3)
		)
		bufferGeometry.setIndex(indices)
		bufferGeometry.computeVertexNormals()
		return bufferGeometry
	}, [patternPoints])

	const texture = useLoader(TextureLoader, texturePath)

	if (!geometry) return null

	return (
		<mesh geometry={geometry}>
			<meshPhysicalMaterial
				color='#b0b0b0'
				metalness={0.9}
				roughness={0.4}
				clearcoat={0.6}
				reflectivity={0.8}
				map={texture} // Uncomment if using a texture
			/>
		</mesh>
	)
}

const Airship3DView = () => {
	const { L } = useAirshipStore()
	const cameraPosition: [number, number, number] = [L / 2, 0, L * 1.5]

	return (
		<Card sx={{ bgcolor: "white", p: 3, borderRadius: 3, boxShadow: 3 }}>
			<CardContent>
				<Typography variant='h5' fontWeight='bold' mb={3}>
					Envelope Pattern Development
				</Typography>
				<Box
					sx={{
						height: 384,
						width: "100%",
						background:
							"linear-gradient(135deg, #e0f7fa 0%, #222b3d 80%)",
						border: "1px solid #444",
						borderRadius: 2,
						overflow: "hidden",
					}}
				>
					<Canvas
						camera={{
							position: cameraPosition,
							fov: 35,
							near: 0.1,
							far: L * 3,
						}}
					>
						{/* Lights and controls */}
						<ambientLight intensity={0.3} />
						<directionalLight position={[0, 5, 10]} intensity={1} />
						<Pattern2DView />
						<OrbitControls
							enablePan={true}
							enableZoom={true}
							minDistance={L * 0.8}
							maxDistance={L * 3}
						/>
						<Environment preset='sunset' />
					</Canvas>
				</Box>
			</CardContent>
		</Card>
	)
}

export default Airship3DView
