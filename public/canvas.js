canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// canvas.width = '100vw';
// canvas.height ='100vh';

let pencilColorAll = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector("#pencil-width");

let eraserWidthElem = document.querySelector("#eraser-width");

let pencilColor = "red";
let eraserColor = "white";
let pencilWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

let undoRedoTracker = [canvas.toDataURL()];
let currState = 0;

let mouseDown = false;
let pencilIsActive = true;

//API
let tool = canvas.getContext("2d");

tool.strokeStyle = pencilColor;
tool.lineWidth = pencilWidth;

// mousedown -> start new path, mousemove -> path fill (graphics)
canvas.addEventListener("mousedown", (e) => {
  mouseDown = true;
  // beginPath({
  //     x: e.clientX,
  //     y: e.clientY
  // });
  let data = {
    x: e.clientX,
    y: e.clientY,
  };
  //send data to server
  socket.emit("beginPath", data);
});

canvas.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    let data = {
      x: e.clientX,
      y: e.clientY,
      color: pencilIsActive ? pencilColor : eraserColor,
      width: pencilIsActive ? pencilWidth : eraserWidth,
    };
    socket.emit("drawStroke", data);
  }
  // if(mouseDown) {
  //     drawStroke({
  //         x: e.clientX,
  //         y: e.clientY
  //     })
  // }
});

canvas.addEventListener("mouseup", (e) => {
  mouseDown = false;
  //undo redo
  let url = canvas.toDataURL();
  while (undoRedoTracker.length - 1 > currState) {
    undoRedoTracker.pop();
  }
  undoRedoTracker.push(url);
  currState = undoRedoTracker.length - 1;
  console.log(currState);
});

function beginPath(strokeObj) {
  tool.beginPath();
  tool.moveTo(strokeObj.x, strokeObj.y);
}
function drawStroke(strokeObj) {
  // if(pencilIsActive){
  //     pencilColor = strokeObj.color;
  //     tool.strokeStyle = pencilColor;

  //     pencilWidth = pencilWidthElem.value;
  //     tool.lineWidth = pencilWidth;
  //     console.log(tool.lineWidth);
  // }else{
  //     eraserWidth = eraserWidthElem.value;
  //     tool.lineWidth = eraserWidth;
  // }
  tool.strokeStyle = strokeObj.color;
  tool.lineWidth = strokeObj.width;
  tool.lineTo(strokeObj.x, strokeObj.y);
  tool.stroke();
}

pencilColorAll.forEach(function (colorElem) {
  colorElem.addEventListener("click", (e) => {
    let color = colorElem.classList[0];
    pencilColor = color;
    tool.strokeStyle = pencilColor;
  });
});
pencilWidthElem.addEventListener("change", (e) => {
  pencilWidth = pencilWidthElem.value;
  tool.lineWidth = pencilWidth;
});
eraserWidthElem.addEventListener("change", (e) => {
  eraserWidth = eraserWidthElem.value;
  tool.lineWidth = eraserWidth;
});

pencilBtn.addEventListener("click", (e) => {
  pencilIsActive = true;
  tool.strokeStyle = pencilColor;
  tool.lineWidth = pencilWidth;
});
eraserBtn.addEventListener("click", (e) => {
  pencilIsActive = false;
  tool.strokeStyle = eraserColor;
  tool.lineWidth = eraserWidth;
});

undoBtn.addEventListener("click", (e) => {
  if (currState - 1 >= 0) currState--;
  let trackerObj = {
    currState: currState,
    undoRedoTracker,
  };
  // currentStateSetter(trackerObj);
  socket.emit("redoUndo", trackerObj);
});
redoBtn.addEventListener("click", (e) => {
  if (currState + 1 < undoRedoTracker.length) currState++;
  let trackerObj = {
    currState: currState,
    undoRedoTracker,
  };
  // currentStateSetter(trackerObj);
  socket.emit("redoUndo", trackerObj);
});

function currentStateSetter(trackerObj) {
  currState = trackerObj.currState;
  console.log(currState);
  undoRedoTracker = trackerObj.undoRedoTracker;

  let img = new Image();
  img.src = undoRedoTracker[currState];
  // console.log(img.src);
  img.onload = (e) => {
    tool.clearRect(0, 0, canvas.width, canvas.height);
    tool.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
}
document.addEventListener("keydown", function (event) {
  if (event.which === 90 && event.ctrlKey && event.shiftKey) {
    redoBtn.click();
  } else if (event.ctrlKey && event.key == "z") {
    undoBtn.click();
  }
});
socket.on("beginPath", (data) => {
  // data = data from the server (digesting the information)
  beginPath(data);
});
socket.on("drawStroke", (data) => {
  drawStroke(data);
});
socket.on("redoUndo", (data) => {
  currentStateSetter(data);
});
