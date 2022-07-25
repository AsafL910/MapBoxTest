import MapboxDraw from '@mapbox/mapbox-gl-draw'

const MapDraw = (map) => {
  console.log(map)
  var draw = new MapboxDraw()
  map.addControl(draw, 'top-left')
  const entityCreated = (e) => {
    alert(MapDraw())
    var data = draw.getAll()
    if (data.features.length > 0) {
      console.log(JSON.stringify(data.features))
    }
  }
  map.on('draw.create', entityCreated)
  map.on('draw.update', () => console.log('draw.update'))
  map.on('draw.delete', () => console.log('draw.delete'))
}

export default MapDraw
