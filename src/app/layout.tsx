import { Metadata } from 'next'
import Navbar from '../components/Navbar'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.png" />
			</head>
			<body>
				<Navbar />
				{children}
			</body>
		</html>
	)
}

