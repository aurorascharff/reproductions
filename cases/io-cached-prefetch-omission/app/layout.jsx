import './globals.css'

export const metadata = {
  title: 'io() prefetch repro',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
