import Image from "next/image";
import Link from "next/link";

import logo from '@/public/whitelogo.png';

const navLinks = [
  { text: 'Home', href: '/' },
  { text: 'About', href: '/about' },
  { text: 'Contact', href: '/contact' },
];

export default function Navbar() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="logo">
          <Link href="/" className="flex items-center">
            <Image src={logo} alt="Company Logo" className="h-8 mr-2" width={35} height={2000} />
            <span className="font-bold text-xl text-gray-800 dark:text-white">H2 Technologies</span>
          </Link>
        </div>

        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="buttons flex gap-4">
          <Link href='/quote' className="primary-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-md transition-colors">
            Get a Quote
          </Link>
        </div>

        <button id="mobile-menu-button" className="md:hidden text-gray-700 dark:text-gray-200 focus:outline-none" aria-label="Toggle Mobile Menu">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      <div id="mobile-menu" className="hidden md:hidden bg-gray-100 dark:bg-gray-800">
        <div className="px-2 pt-2 pb-3 sm:px-3">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              >{link.text}</Link>
          ))}
        </div>
        <div className="px-4 py-3">
          <Link href='/quote' className="block w-full text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-md transition-colors">
            Get a Quote
          </Link>
        </div>
      </div>
    </header>
  )
}