const minimumWidth = 600;
const minHeight = 600;
const maxRuns = 5;
let runs = 0;

let firstRun = true;

let VT323;
let logo, refresh;

const timerMax = 10;
let timer = timerMax;

let sessionID = 0;
let index = 1;

var started = false;

let inkOnScreen = 0;

let city,region;



function preload() {
  VT323 = loadFont('assets/VT323-Regular.ttf');
  logo = loadImage('assets/central.png');
  refresh = loadImage('assets/refresh.png');
  getSessionID(); //sessionID is only generated ONCE
  getIPLocation();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  textFont(VT323);
  
}

function draw() {
  if (windowWidth > minimumWidth && runs < 1){
    if (mouseIsPressed){
      started = true;
    }
    sketchPad();
  } else if (windowWidth < minimumWidth) {
    clearScreen();
    
    noStroke();
    textSize(16);
    textAlign(CENTER);
    text('*This application is not suitable for mobile devices*\nIncrease Window Size (and refresh page) ', windowWidth/2, windowHeight/3);
  } else {
    topBar();
    textAlign(CENTER);
    let s = 'Thank you! This window can now be closed, or you can refresh above to try again :-)\n\n ©2021 Central Institute';
    fill(0);
    text(s, 30, 200, windowWidth-60, height);

    if (mouseIsPressed === true && mouseY < 60 && mouseX < (width-100) && mouseX > (width-145)){
      refreshCanvas();
    } //checks if refresh button has been pressed
  }
  
}



function sketchPad() {
  topBar();
    
  stroke(0); 
  strokeWeight(3);
  if (mouseIsPressed === true && mouseY > 60 && timer > 0) {
    line(mouseX, mouseY, pmouseX, pmouseY);
    inkOnScreen++;
    timerCheck()
    
  } else {
    timerCheck();
  }
  if (mouseIsPressed === true && mouseY < 60 && mouseX < (width-100) && mouseX > (width-145)){
    refreshCanvas();
  }
}

function clearScreen(){
  background(255);
}

function timerCheck(){
  if (started == true){
    if (frameCount % 60 == 0 && timer > 0){ // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
      timer --;
    }   
    if (timer == 0) {
      makeScreenshot();
    }
  }
}

function topBar(){
  textSize(40);
  textAlign(LEFT);
  noStroke();
  fill('#FFFF00');
  rect(0,0,width,70);

  image(logo, 20, 10, 70, 50); //CENTRAL Logo
  
  fill(0);
  text("Image Drawing Pad (" + sessionID + ")", 115,45);

  image(refresh,width-145,10,45,40);

  if (runs < 1){
    textSize(70); //larger text for timer
    text(timer, width-80, 50);
  } else {
    textSize(70); //larger text for timer
    text('0', width-80, 50);
  }
}

function removeTopBar(){
  noStroke();
  fill(255);
  rect(0,0,width,70);
}

function resetCanvas(){
  started = false;
  timer = timerMax;
  runs++;
}

function refreshCanvas(){
  clearScreen();
  topBar();
  inkOnScreen = 0;
  started = false;
  timer = timerMax;
  runs = 0;
}

function getSessionID(){
  while (sessionID < 1000000){
    sessionID = Math.floor(Math.random() * 9999999);
  }
}

function getIPLocation(){
  fetch('https://ipapi.co/json/')
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    //console.log(data.city);
    city = data.city;
    region = data.region; 
    
  });
}

function makeScreenshot(){
  


  removeTopBar();
  var canvas = $('canvas')[0];
  var data = canvas.toDataURL('image/png').replace(/data:image\/png;base64,/, '');

  //REMOVE IF NECCESSARY
  //preload2();
  //gogogo();

  //END
 
  // naming png file 6949382-1-564.png example
  //var iname = sessionID + '-' + index + '-' + inkOnScreen + '.png'; 
  
  var iname = region + '-' + city + '-' + sessionID + '-' + index + '-' + inkOnScreen + '.jpg'; 
  $('canvas').remove();
  
  //post to php folder in image_saves
  $.post('image_saves/save.php',{data: data, iname });
  
  // update runs
  runs ++;
  index ++;
  resetCanvas();
  
  //restart sketch
  setup();
}

// 22/06/2021 IMAGE CLASSIFIER  -  START


const classifier = ml5.imageClassifier('MobileNet', modelReady);



// A variable to hold the image we want to classify
let img;
let finalWord = '';


function preload2(){
  // Load the image
  //img = createImg(canvas,'analysis');
  img = canvas
  //img = createImg("https://i.ytimg.com/vi/vOb7HRkYB6s/maxresdefault.jpg");
  img.elt.crossOrigin = "Anonymous";
  //img.size(400, 400);
  img.hide();
}

// function setup() {
//   noCanvas();
// }

// Change the status when the model loads.
function modelReady() {
  //select('#status').html('Model Loaded')
  classifier.predict(img, gotResult);
}


// A function to run when we get any errors and the results
function gotResult(err, results) {
  //console.log(results);
  console.log(results[0].className);
  oneWord(results[0].className);
  // Display error in the console
  if (err) {
    console.error(err);
  }
  // The results are in an array ordered by probability.
  //select('#result').html(results[0].className);
  //select('#probability').html(nf(results[0].probability, 0, 2));
}

function oneWord(letter){
  var n = letter.length;
  
  for (let i = 0; i< n;i++){
    if (letter.charAt(i) != ','){
      finalWord = finalWord + letter.charAt(i);
    } else if (letter.charAt(i) == ','){
      i = n
    }
  }
  console.log(finalWord);
}



// 22/06/2021 IMAGE CLASSIFIER  -  END