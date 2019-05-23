//let song;
let data =[];
let source = null;
let fft = null;
let level = null;
let volhistory = [];
let button;
let Silence = 0.07;
let listening = false;
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
  button = createButton('record');
  fill(255);
  button.mousePressed(toggleRecord);

  source.start();
  // // create a new Amplitude analyzer

  // Patch the input to an volume analyze
  fft = new p5.FFT(.8,1024);
  fft.setInput(source);

  level = new p5.Amplitude();
  level.setInput(source);

}

function toggleRecord(){
  if (listening) {
      source.stop();
      listening = false;
  }
  else {
    source.start();
    listening = true;
  }
}

function draw(){
  background(0);
  drawWaveForm();
  drawCircAmp();
  drawAmphistory();
  recordData();
  // Get the overall volume (between 0 and 1.0)
  //var vol = analyzer.getLevel();
  // let vol = mic.getLevel();
  // //volhistory.push(vol);
  // //console.log(volhistory);
  // stroke(255);
  //
  // beginShape();
  // noFill();
  // //for(var i = 0; i<volhistory.length; i++){ //  for(var i = 0; i<volhistory.length; i++){
  // var y = map(vol,0,1,height,0)
  //   vertex(50,y);
  // endShape();

  // if(volhistory.length > (width-50)){
  //   volhistory.splice(0,1);
  //}
  // Draw an ellipse with height based on volume
  //var h = map(vol, 0, 0.5, height, 0);
  //ellipse(width/2, h - 25, 50, 50);

}

function drawWaveForm() {
  // Extract the spectrum from the time domain
  const wave = fft.waveform(source)
  // Set the stroke color to white
  stroke(255)
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
    noFill()
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
  let noise = level.getLevel();
  if (noise > Silence) {
    data.push(noise);
    console.log(noise);
  }
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
