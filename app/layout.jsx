export const metadata = {
  title: 'Hans Dampf Cloud',
  description: 'Die KI mit echtem Backend',
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
        {children}
      </body>
    </html>
  )
}
