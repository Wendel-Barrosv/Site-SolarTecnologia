import type { Metadata, Viewport } from 'next'
import './globals.css'
import 'leaflet/dist/leaflet.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  title: 'Solar Tecnologia LTDA',
  description: 'Solar Wave é o ERP para monitoramento inteligente, gestão financeira e operação comercial de usinas solares, com atuação em expansão no Nordeste.',
  keywords: 'energia solar, gestão de usinas, ERP solar, monitoramento solar, Solar Wave, Nordeste',
  authors: [{ name: 'Solar Tecnologia LTDA' }],
  openGraph: {
    title: 'Solar Wave ERP | Solar Tecnologia',
    description: 'Controle operacional, financeiro e comercial para integradores, investidores e operadores solares.',
    url: 'https://www.solartecnologia.com.br',
    siteName: 'Solar Tecnologia',
    locale: 'pt_BR',
    type: 'website',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.solartecnologia.com.br'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
