
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
    {/* <html lang="en">
      <body> */}
        <h1>Auth Layout</h1>
        <div style={{background: 'red'}}>
          {children}
        </div>
        {/* </body>
    </html> */}
    </div>
  );
}
