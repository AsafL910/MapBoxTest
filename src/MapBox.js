import maplibregl from 'maplibre-gl' // eslint-disable-line import/no-webpack-loader-syntax
import { useState, useEffect, useRef } from 'react'
import 'maplibre-gl/dist/maplibre-gl.css'
import './MapBox.css'
import AdjustIcon from '@mui/icons-material/Adjust'
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive'
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports'
import PlaneCounter from './components/PlaneCounter'
import ExploreIcon from '@mui/icons-material/Explore'
import MapIcon from '@mui/icons-material/Map'

const Map = ({ setMousePosition }) => {
  const [isFetchingSelfData, setIsFetchingSelfData] = useState(false)
  const [map, setMap] = useState()
  const [refreshIntervalId, setRefreshIntervalId] = useState()
  const mapRef = useRef()
  mapRef.current = map
  const isCenter = useRef(false)
  const mapElement = useRef()
  const [planeCount, setPlaneCount] = useState(0)
  const pitch = useRef(0)

  useEffect(() => {
    const initMap = new maplibregl.Map({
      container: mapElement.current,
      style: 'http://localhost:3650/api/maps/israel_1/style.json',
      center: [35, 32],
      zoom: 9,
      pitch: 0,
    })

    initMap.on('load', () => initMap.resize())
    initMap.on('mousemove', (e) =>
      setMousePosition({ lng: e.lngLat.lng, lat: e.lngLat.lat }),
    )

    initMap.on('drag', () => {
      isCenter.current = false
    })

    initMap.on('mousedown', () => {
      isCenter.current = false
    })

    initMap.on('wheel', () => {
      isCenter.current = false
    })

    initMap.loadImage(require('./assets/map-marker-icon.png'), function (error, image) {
      if (error) throw error
      initMap.addImage('mapMarker', image)

      initMap.addSource('obstacleData', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      })

      initMap.addLayer({
        id: 'obstacleData',
        type: 'symbol',
        source: 'obstacleData',
        layout: {
          'icon-allow-overlap': true,
          'icon-image': 'mapMarker',
          'icon-size': 0.03,
        },
      })
    })

    initMap.loadImage(require('./assets/Plane2.png'), function (error, image) {
      if (error) throw error
      initMap.addImage('selfPlane', image)

      initMap.addSource('selfData', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [],
          },
          properties: {},
        },
      })

      initMap.addLayer({
        id: 'selfData',
        type: 'symbol',
        source: 'selfData',
        layout: {
          'icon-allow-overlap': true,
          'icon-rotation-alignment': 'map',
          'icon-rotate': ['get', 'trueTrack'],
          'icon-image': 'selfPlane',
          'icon-size': 0.1,
        },
      })
    })

    initMap.loadImage(require('./assets/Plane2.png'), function (error, image) {
      if (error) throw error
      initMap.addImage('selfDataIcon', image)

      initMap.addSource('otherPlanesData', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      })
      initMap.addLayer({
        id: 'otherPlanes',
        type: 'symbol',
        source: 'otherPlanesData',
        layout: {
          'icon-image': 'selfDataIcon',
          'icon-size': 0.075,
          'icon-allow-overlap': true,
          'icon-rotation-alignment': 'map',
          'icon-rotate': ['get', 'trueTrack'],
        },
      })

      initMap.on('click', 'otherPlanes', (e) =>
        alert(e.features[0].properties.callSign),
      )
      initMap.on(
        'mouseenter',
        'otherPlanes',
        () => (initMap.getCanvas().style.cursor = 'pointer'),
      )
      initMap.on(
        'mouseleave',
        'otherPlanes',
        () => (initMap.getCanvas().style.cursor = ''),
      )
    })

    setMap(initMap)
  }, [])

  const fetchForSelfData = async () => {
    if (!isFetchingSelfData) {
      setIsFetchingSelfData(true)
      setInterval(async () => {
        const data = await (
          await fetch('https://localhost:6001/self-position')
        ).json()
        mapRef.current.getSource('selfData').setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [data.position.longitude, data.position.latitude],
          },
          properties: {
            callSign: data.callSign,
            trueTrack: data.trueTrack,
          },
        })
        if (isCenter.current) {
          center()
        }
      }, 33)
    }
  }

  const center = () => {
    const coordinates = mapRef.current.getSource('selfData')._data.geometry
      .coordinates
    setMapRotation(
      mapRef.current.getSource('selfData')._data.properties.trueTrack,
    )
    mapRef.current.flyTo({ center: coordinates, zoom: 12, duration: 0 })
  }

  const fetchForOtherPlanes = async () => {
    clearInterval(refreshIntervalId)

    const intervalId = setInterval(async () => {
      const data = await (
        await fetch(`https://localhost:6001/multi-position/${planeCount}`)
      ).json()
      const parsedData = data.map((a) => {
        return {
          type: 'Feature',
          properties: {
            callSign: a.callSign,
            trueTrack: a.trueTrack,
          },
          geometry: {
            type: 'Point',
            coordinates: [a.position.longitude, a.position.latitude],
          },
        }
      })

      mapRef.current.getSource('otherPlanesData').setData({
        type: 'FeatureCollection',
        features: [...parsedData],
      })
    }, 100)

    setRefreshIntervalId(intervalId)
  }

  const fetchForObstacles = async () => {
      const data = await (
        await fetch(`https://localhost:6001/obstacles/${100}`)
      ).json()
      const parsedData = data.map((a) => {
        return {
          type: 'Feature',
          properties: {
            callSign: a.name,
            description: a.description,
            heightMeters: a.heightMeters
          },
          geometry: {
            type: 'Point',
            coordinates: [a.position.longitude, a.position.latitude],
          },
        }
      })

      mapRef.current.getSource('obstacleData').setData({
        type: 'FeatureCollection',
        features: [...parsedData],
      })
  }

  const sideBarBtns = [
    {
      key: 'selfFetch',
      icon: <AirplanemodeActiveIcon fontSize="large" alt="f" />,
      onClick: fetchForSelfData,
      des: 'Fetch Self data',
      enable: !isFetchingSelfData,
    },
    {
      key: 'multiFetch',
      icon: <ConnectingAirportsIcon fontSize="large" />,
      onClick: () => {
        if (planeCount > 0) fetchForOtherPlanes()
      },
      des: 'Fetch multi data',
      enable: planeCount > 0,
    },
    {
      key: 'center',
      icon: <AdjustIcon fontSize="large" />,
      onClick: () => (isCenter.current = !isCenter.current),
      des: 'Center Plane',
      enable: !isCenter.current && isFetchingSelfData,
    },
    {
      key: 'north',
      icon: <ExploreIcon fontSize="large" />,
      onClick: () => setMapRotation(0),
      des: 'North Plane',
      enable: !isCenter.current,
    },
    {
      key: 'pitch',
      icon: <MapIcon fontSize="large" />,
      onClick: () => setMapPitch(pitch.current != 0 ? 0 : 40),
      des: 'Pitch Map',
      enable: true,
    },
    {
      key: 'obstacles',
      icon: <MapIcon fontSize="large" />,
      onClick: fetchForObstacles,
      des: 'Fetch obstacles',
      enable: true,
    },
  ]

  const setMapRotation = (ang) => {
    mapRef.current.rotateTo(ang, { duration: 0 })
  }

  const setMapPitch = (dgr) => {
    console.log(dgr)
    mapRef.current.setPitch(dgr)
    pitch.current = dgr
  }

  return (
    <div className="map-win">
      <div ref={mapElement} className="map-container" />
      <div className="left-side-bar">
        {sideBarBtns.map((btn) => (
          <div
            key={btn.key}
            onClick={() => {
              if (btn.enable) btn.onClick()
            }}
            className={`icon-frame${!btn.enable ? ' disabled' : ''}`}
          >
            {btn.icon}
          </div>
        ))}
      </div>
      <div className="right-side-bar">
        <PlaneCounter planeCount={planeCount} setPlaneCount={setPlaneCount} />
      </div>
    </div>
  )
}

export default Map
