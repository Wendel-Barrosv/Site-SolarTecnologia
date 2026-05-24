'use client'

export default function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5585987217973'
  const message = encodeURIComponent('Olá! Gostaria de falar com um especialista sobre o Solar Wave ERP.')
  const href = `https://wa.me/${phone}?text=${message}`

  return (
    <a
      className="wa-float"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale com um especialista pelo WhatsApp"
      aria-describedby="whatsapp-tooltip"
    >
      <span className="wa-tooltip" id="whatsapp-tooltip" role="tooltip">Fale com um especialista</span>
      <span className="wa-orb" aria-hidden="true">
        {/* WhatsApp official logo mark — 2024 brand */}
        <svg className="wa-icon" viewBox="0 0 48 48" fill="none" focusable="false">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M24 4C13.0 4 4 13.0 4 24c0 3.55.97 6.88 2.66 9.73L4 44l10.55-2.62A19.93 19.93 0 0 0 24 44c10.99 0 20-9.01 20-20S34.99 4 24 4z"
            fill="white"
            fillOpacity="0.18"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M24 7.5C14.84 7.5 7.5 14.84 7.5 24c0 3.18.88 6.16 2.41 8.7l.38.64-1.6 5.82 5.98-1.56.62.37A16.43 16.43 0 0 0 24 40.5c9.15 0 16.5-7.35 16.5-16.5S33.15 7.5 24 7.5zm9.44 22.84c-.38.96-1.9 1.85-2.71 1.96-.78.1-1.76.15-2.84-.18-.65-.21-1.5-.48-2.57-.95-4.52-1.96-7.47-6.5-7.7-6.8-.22-.3-1.8-2.4-1.8-4.58 0-2.18 1.14-3.25 1.54-3.7.4-.44.88-.55 1.17-.55h.84c.27 0 .64-.1.99.76.38.9 1.3 3.17 1.41 3.4.11.22.18.48.04.77-.15.3-.22.48-.43.74-.22.26-.46.58-.65.78-.22.22-.44.45-.19.88.25.43 1.12 1.85 2.4 2.99 1.65 1.47 3.04 1.92 3.47 2.14.44.22.69.18.94-.1.26-.28 1.1-1.28 1.39-1.72.29-.43.58-.36.97-.22.4.15 2.53 1.19 2.97 1.41.43.22.72.33.83.51.1.18.1 1.04-.27 2z"
            fill="white"
          />
        </svg>
      </span>
    </a>
  )
}
