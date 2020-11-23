export async function showSyllable(syllable){
  const doc = sketch.doc
  let layers = sketch.layers
  await doc.addLayer({
    type: 'fancyText',  // [shapes[A]]
    fontFamily: 'freckle-face',
    fill: '#000',
    textAlign: 'center',
    fontSize: 50,
    content: `${syllable}`,
    x: 200,
    y: 30,
    opacity: 1,
  })
  layers.forEach(function(layer){
    layer.x -= 50,
    layer.y += 30,
    sketch.doc.render
  })
  
}


