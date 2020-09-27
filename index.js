import * as handTrack from 'handtrackjs';

const video = document.getElementById('video');
const audioAm = document.getElementById('audioAm');
const audioCm = document.getElementById('audioCm');

let stopDetection = false;
const stopButton = document.getElementById('stop');
const startButton = document.getElementById('start');

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let model;

// canvas element
function DrawRectWithBorder(X, Y,width,height,Color1, Color2) {

  //draw border
  context.fillStyle = Color1;
  context.fillRect(X, Y,width,height);

  //draw inside
  // context.fillStyle = Color2;
  // context.fillRect(X+1,Y+1,width-2,height-2);

}

const modelParams = {
    flipHorizontal: true,   // flip e.g for video 
    imageScaleFactor: 0.8,  // reduce input image size for gains in speed.
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.5,    // confidence threshold for predictions.
  }

  // x, y describes up-left corner of the rectangle
  let createChordButton = (x,y,width,height,text,textFont,strokeStyle,fillStyle) => {

    context.strokeStyle = strokeStyle;
    context.fillStyle = fillStyle;
    context.font = textFont;

    context.strokeRect(x, y, width, height);
    context.fillText(text,x + width/2 - width/4,y + height/1.6);
  }

  let runDetection = () => {
    model.detect(video).then(predictions => {
          let xCenter;
          let yCenter;
          model.renderPredictions(predictions, canvas, context, video);
          if(predictions.length !== 0){
            console.log('dot context')
            let x = predictions[0].bbox[0];
            let y = predictions[0].bbox[1];
            xCenter = predictions[0].bbox[0] + (predictions[0].bbox[2]/2);
            yCenter = predictions[0].bbox[1] + (predictions[0].bbox[3]/2);
            context.strokeRect(xCenter - 12.5 ,yCenter - 12.5,30,30);
            // audio.play();
          }

          //Am
          createChordButton(100,100,100,100,'Am','30px Arial',"#FF0000","#FF0000");
          //Dm
          createChordButton(450,100,100,100,'Cm','30px Arial',"#FF0000","#FF0000");


          if(xCenter >= 100 && xCenter <= 200 && yCenter >= 100 && yCenter <=200){
            audioCm.pause();
            audioCm.currentTime = 0;
            audioAm.play();
          }
          else if(xCenter >= 450 && xCenter <= 550 && yCenter >= 100 && yCenter <=200){
            audioAm.pause();
            audioAm.currentTime = 0;
            audioCm.play();
          }

          requestAnimationFrame(runDetection);
          console.log(predictions);
    });
  } 

  let startVideo = () => {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
            runDetection();
        })
        .catch(function (error) {
            console.log("Something went wrong! |" +error);
        });
    }
  }

  let createModelForDetection = () => {
    handTrack.load(modelParams).then((lmodel) => {
        model = lmodel;
        startVideo();
      });
  }

  // stopButton.addEventListener('click',()=>{
  //   stopDetection = true;
  // });

  // startButton.addEventListener('click',()=>{
  //   stopDetection = false;
  //   runDetection();
  // })

  createModelForDetection();

