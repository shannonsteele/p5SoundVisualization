//3 Graphic Visualizers with Sound Input

//let song;
let data =[];
let source = null;
let fft = null;
let level = null;
let volhistory = [];
let button;
let Silence = 0.07;
let listening = false;
let analyzed = true;
let trans = false;
let binOut = "";
let total = 0.0;
let noise = null;
let circleFill = 'black';

//GUI
// let myColor = '#FFFFFF';
// let visible = true;
// let guivar;


// function preload() {
//   //song = loadSound('underwater.mp3');
//   }

 function touchStarted() {
   getAudioContext().resume();
 }

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  // Create an Audio input
  source = new p5.AudioIn();
    // start the Audio Input.
 // By default, it does not .connect() (to the computer speakers)
  button = createButton('Record');
  fill(255);
  button.mousePressed(toggleRecord);

  source.start();
  // // create a new Amplitude analyzer

  // Patch the input to an volume analyze
  fft = new p5.FFT(.8,1024);
  fft.setInput(source);

  level = new p5.Amplitude();
  level.setInput(source);

  // gui();
}

// function gui(){
//   sliderRange(0,255,1)
//   guivar = createGui('Visualizers');
//   guivar.addGlobals('myColor','zoom');
//
//   noLoop();
// }

function toggleRecord(){
  if (listening) {
      listening = false;
      source.stop();
      if(canTrans()){ //************
        print(getText());//************
      } else {//************
        print("Cannot be translated");//************
      }
  }
  else {
    listening = true;
    source.start();
  }
}

function draw(){
  background(0);
  drawWaveForm();
  drawCircAmp();
  drawAmphistory();
  recordData();

}

function drawWaveForm() {
  // Extract the spectrum from the time domain
  const wave = fft.waveform(source)
  // Set the stroke color to white
  stroke(255);
  // Turn off fill
  noFill()
  // Start drawing a shape
  beginShape()
  // Create a for-loop to draw a the connecting points of the shape of the input sound
	wave.forEach(function (amp, i) {
		const x = i / wave.length * width
		const y = map(wave[i], -1, 1, 0, (height/2))
		vertex(x, y)
	})
  // End the shape
  endShape()
}

function drawCircAmp(){
    stroke(255)
    let vol = level.getLevel();
    fill(circleFill);
    //beginShape()
      var y = map(vol,0,1,(height/2)-50,0)
      ellipse(width/2,height/2,y, y)
    //endShape()
}

function drawAmphistory(){
  var vol = source.getLevel();
  volhistory.push(vol);
  //console.log(volhistory);

  stroke(255);
  beginShape();
  noFill();
  push();
  var y = map(vol,0,1,height,0)
  for (var i = 0; i < volhistory.length; i++) { //  for(var i = 0; i<innerWidth i++){
    var y = map(volhistory[i],0,1,height,0)
    vertex(i,y);
  endShape();

  if(volhistory.length > (innerWidth-50)){
    volhistory.splice(0,1);
    }
  }
}

function recordData(){
  noise = level.getLevel();
  if (noise > Silence) {
    data.push(noise);
    console.log(noise);
    analyzed = false;
  }
  else if (analyzed === false) {
    analyzeNoise();
    analyzed = true;
  }
}

function canTrans(){//************
    trans = false;
    if (binOut.length % 8 === 0) {//************
        trans = true;//************
    }
    return trans;//************
}

function getText(){
  let word = "";
  for (let i =0; i < binOut.length; i+=8){
    let str = binOut.substring(i, i+8);
    let num = parseInt(str,2);
    word += char(num);
    print(word);
  }
  return word;
}

function analyzeNoise(){
  if (listening){
    for (var i = 0; i < data.length; i=0) {
      total += data[i];
      console.log(total)
      data.shift(i);
    }
    print("total:" + total)
  }
  if (total < 1){
    binOut+= "0";
    print(0);
    circleFill = 'black';
  }

  if (total > 1){
    binOut+= "1";
    print(1);
    circleFill = 'white';
  }
  total = 0
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

// function keyPressed(e) {
//   // spacebar pauses
//   if (e.keyCode == 32) {
//     //var context = new AudioContext();
//     if (song.isPlaying()) {
//       song.pause();
//     } else {
//       song.play();
//     }
//   }
// }
