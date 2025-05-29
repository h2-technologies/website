import { Metadata } from 'next'
import Navbar from '../components/Navbar'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.png" />
			</head>
			<body className="bg-[#1e2329]">
				<div className="h-screen w-full min-w-fit overflow-x-hidden">
					<div>
						<Navbar />
					</div>
					<main className="font-roboto flex-col items-center justify-center text-center text-slate-800 bg-[#1e2329]">
						{children}
					</main>
					<footer className="w-full bottom-0 text-start p-4 justify-center bg-slate-800 text-slate-100 text-md">
						<p>&copy;{new Date().getFullYear()} H2 Technologies. All rights reserved.</p>
					</footer>
				</div>
			</body>
		</html>
	)
}

