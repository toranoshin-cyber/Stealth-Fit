export const metadata = {
  title: "Train-ing",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body
        style={{
          margin: 0,
          padding: 0,
          touchAction: "manipulation",
        }}
      >
        {children}
      </body>
    </html>
  );
}