import _ from 'lodash' 
import './styles.scss' 
import { MIDI } from './../MIDI.js'
import { load } from './load'
import { moveShapes } from './move-shapes'
import { emitSketchLayers } from './emit-sketch-layers'
import { playSound } from './play-sound'
import './learn-melody'
import { learnMelody } from './learn-melody'

// canvas UI
const undo = document.querySelector('#undo')
const redo = document.querySelector('#redo');
const saveBtn = document.querySelector('#save')
const deleteBtn = document.querySelector('#deleteBtn')
const canvasButtons = [undo, redo, saveBtn, deleteBtn]
// radio button UI
const radioBtns = document.querySelector('#radio-buttons')
const par1 = document.querySelector('#par1').classList
const par2 = document.querySelector('#par2').classList
// keyboard
const piano = document.getElementById('keyboard')


window.addEventListener('load', (event) => {  // may want to remove... 
  // global.MIDI = MIDI

  startup()

  async function startup() {
    await load(['sketch/min/sketch-api.min.css', 'sketch/min/app.min.css', 'sketch/babelHelpers.js', 'sketch/min/sketch-config.min.js', 'sketch/min/sketch-api.min.js'])
    window.sketchOnReady = async function () {
      const sketch = window.sketch;
      const sketchConfig = window.sketchConfig;
      const sketchContainer = document.querySelector('sketch-container')
      sketch.$container = sketchContainer;
      sketch.config(sketchConfig)
      await sketch.createDocument({
        element: sketchContainer
      })
      await sketch.setTool('select')
    }

    // canvas UI events
    undo.addEventListener('click', function() {
      sketch.doc.undo()
    })
    redo.addEventListener('click', function() {
      sketch.doc.redo();
    })
    saveBtn.addEventListener('click', function() {
    sketch.download.svg()
    })
    deleteBtn.addEventListener('click', function() {
      let result = confirm('Are you sure you want to delete? You will lose your work.')
      if(result) {
        sketch.doc.reset()
      } 
    })

    await MIDI.autoconnect()
    MIDI.channels = 1
    const { default: program } = await import('./../singingNotes/index.json')
    await MIDI.programs.load({
      programID: 0,
      program
    })
    await MIDI.jobs.wait()
  }

  // radio button UI events 
  radioBtns.addEventListener('click', function (event) {
    let checkedButton = event.target.value;
    if (checkedButton === 'free-play') {
      canvasButtons.forEach(function(btn) {
        btn.classList.remove('hidden')
      })
      par1.remove('toggleText2')
      par2.add('toggleText2')
    } else {
      let result = confirm('Changing modes will delete your artwork. Click okay to switch modes or cancel to stay in free-play and save your work before switching.')
      if(result) {
        sketch.doc.reset()
        par2.remove('toggleText2')
        par1.add('toggleText2')
        canvasButtons.forEach(function(btn) {
          btn.classList.add('hidden')
        })
        learnMelody()
      } else {
        document.getElementById('free-play').checked = true;
        document.getElementById('learn-melody').checked = false; 
      }
    }
  })

  // user interaction with keyboard based on mode
  piano.addEventListener('click', async function (event) {
    let checkedButton = document.querySelector('input[name="setting"]:checked').value;
    const keyPressed = event.target.textContent //gets actual text of clicked key
    if(checkedButton === 'free-play'){
      await playSound(keyPressed)
      await emitSketchLayers(keyPressed)
      await moveShapes()
    } 
  })
  // add ability for user to drag cursor up and down keyboard?
});

