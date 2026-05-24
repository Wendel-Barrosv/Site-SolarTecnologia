'use client'

import { useEffect, useRef, useState } from 'react'

type MapStatus = 'loading' | 'ready' | 'error'

const monitoredPlants = [
  { name: 'Fortaleza', state: 'CE', coordinates: [-3.7319, -38.5267] as [number, number] },
  { name: 'Natal', state: 'RN', coordinates: [-5.7945, -35.211] as [number, number] },
  { name: 'Recife', state: 'PE', coordinates: [-8.0476, -34.877] as [number, number] },
  { name: 'Salvador', state: 'BA', coordinates: [-12.9777, -38.5016] as [number, number] },
  { name: 'João Pessoa', state: 'PB', coordinates: [-7.1153, -34.861] as [number, number] },
  { name: 'Teresina', state: 'PI', coordinates: [-5.0892, -42.8019] as [number, number] },
  { name: 'São Luís', state: 'MA', coordinates: [-2.5307, -44.3068] as [number, number] },
]

const imageryTiles = 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
const blankErrorTile =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22256%22 height=%22256%22%3E%3Crect width=%22256%22 height=%22256%22 fill=%22%23132435%22/%3E%3C/svg%3E'

export default function NordesteMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import('leaflet').Map | null>(null)
  const [status, setStatus] = useState<MapStatus>('loading')
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    let disposed = false
    let loadTimeout: number | undefined

    setStatus('loading')

    import('leaflet')
      .then((L) => {
        if (!containerRef.current || disposed) return

        mapRef.current?.remove()
        mapRef.current = null

        const map = L.map(containerRef.current, {
          center: [-8.8, -40.1],
          zoom: 5,
          zoomControl: false,
          scrollWheelZoom: false,
          dragging: false,
          touchZoom: false,
          doubleClickZoom: false,
          keyboard: false,
          boxZoom: false,
          attributionControl: true,
        })

        let loadedTiles = 0
        let failedTiles = 0
        loadTimeout = window.setTimeout(() => {
          if (!disposed && loadedTiles === 0) setStatus('error')
        }, 9000)
        const imagery = L.tileLayer(imageryTiles, {
          minZoom: 3,
          maxZoom: 19,
          errorTileUrl: blankErrorTile,
          attribution: '&copy; Esri World Imagery',
        })

        imagery.on('tileload', () => {
          loadedTiles += 1
          if (loadTimeout !== undefined) window.clearTimeout(loadTimeout)
          if (!disposed) setStatus('ready')
        })

        imagery.on('tileerror', () => {
          failedTiles += 1
          if (!disposed && failedTiles >= 3 && loadedTiles === 0) setStatus('error')
        })

        imagery.addTo(map)

        const plantIcon = L.divIcon({
          className: 'plant-pin-shell',
          html: '<span class="plant-pin"><i></i></span>',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -14],
        })

        monitoredPlants.forEach((plant) => {
          L.marker(plant.coordinates, { icon: plantIcon })
            .addTo(map)
            .bindPopup(
              `<strong>${plant.name} / ${plant.state}</strong><span>Unidade monitorada</span>`,
              { closeButton: false, offset: [0, -2] }
            )
        })

        mapRef.current = map
      })
      .catch(() => {
        if (!disposed) setStatus('error')
      })

    return () => {
      disposed = true
      if (loadTimeout !== undefined) window.clearTimeout(loadTimeout)
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [retryToken])

  return (
    <div className="nordeste-map-container">
      <div ref={containerRef} className="nordeste-map-canvas" aria-label="Mapa satélite da Região Nordeste com usinas monitoradas" />

      {status === 'loading' && (
        <div className="map-feedback map-loading" aria-live="polite">
          <span className="map-spinner" />
          <span>Carregando imagem de satélite...</span>
        </div>
      )}

      {status === 'error' && (
        <div className="map-feedback map-error" role="status">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3.5 18.5 8.5 13l3.3 3.1 3.4-4.2 5.3 6.6M4 5.5h16v13H4z" />
            <path d="M16.5 7.5h.01" />
          </svg>
          <strong>Imagem de satélite indisponível</strong>
          <span>Os pontos monitorados continuam representados nesta cobertura regional.</span>
          <button type="button" onClick={() => setRetryToken((value) => value + 1)}>
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  )
}
