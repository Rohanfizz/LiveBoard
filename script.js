let menuBtn = document.querySelector('.menu-btn');
let menuContainer = document.querySelector('.menu');
let burgerIcon = document.querySelector('.menu-icon-burger')
let crossIcon = document.querySelector('.menu-icon-cross')

let pencilBtn = document.querySelector('.pencil-btn');
let pencilDropDownMain = document.querySelectorAll('.pencil-drop-down');
let pencilDropDown = document.querySelector('.pencil-drop-down#pend');
let pencilDropUp = document.querySelector('.pencil-drop-down#penu');
let pencilOptions = document.querySelector('.pencil-options');

let eraserBtn = document.querySelector('.eraser-btn');
let eraserDropDownMain = document.querySelectorAll('.eraser-drop-down');
let eraserDropDown = document.querySelector('.eraser-drop-down#erd');
let eraserDropUp = document.querySelector('.eraser-drop-down#eru');
let eraserOptions = document.querySelector('.eraser-options');

let stickyBtn = document.querySelector('.sticky-btn');
let stickyNoteContainer = document.querySelector('.sticky-note-container');

let uploadBtn = document.querySelector('.upload-btn');


let menuVisible = true;
let pencilOptionVisible = false;
let eraserOptionVisible = false;


menuBtn.addEventListener('click',(e)=>{
    menuVisible = !menuVisible;
    if(menuVisible){
        burgerIcon.style.display = 'none';
        crossIcon.style.display = 'flex';
        menuContainer.style.display = 'flex';
    }else{
        crossIcon.style.display = 'none';
        burgerIcon.style.display = 'flex';
        menuContainer.style.display = 'none';
        if(pencilOptionVisible) pencilDropUp.click();
        if(eraserOptionVisible) eraserDropUp.click();
    }
})

pencilDropDownMain.forEach(function(btn){
    btn.addEventListener('click',(e)=>{
        pencilOptionVisible = !pencilOptionVisible;
        if(pencilOptionVisible){
            pencilOptions.style.display = 'flex';
            pencilDropUp.style.display = 'flex';
            pencilDropDown.style.display = 'none';
        }else{
            pencilOptions.style.display = 'none';
            pencilDropUp.style.display = 'none';
            pencilDropDown.style.display = 'flex';
        }
    })
})

eraserDropDownMain.forEach(function(btn){
    btn.addEventListener('click',(e)=>{
        eraserOptionVisible = !eraserOptionVisible;
        if(eraserOptionVisible){
            eraserOptions.style.display = 'flex';
            eraserDropUp.style.display = 'flex';
            eraserDropDown.style.display = 'none';
        }else{
            eraserOptions.style.display = 'none';
            eraserDropUp.style.display = 'none';
            eraserDropDown.style.display = 'flex';
        }
    })
})

// pencilOptions.addEventListener('mouseup',(e)=>{
//     pencilOptions.style.display = 'none';
// })
// eraserOptions.addEventListener('mouseup',(e)=>{
//     eraserOptions.style.display = 'none';
// })

stickyBtn.addEventListener('click',(e)=>{
    let sticky = document.createElement('div');
    sticky.className = 'sticky';
    let myId = shortid();
    sticky.setAttribute('id', myId);
    sticky.innerHTML = `
        <div class="sticky-id">${'#'+myId}
            <div class="sticky-minimize"></div>
            <div class="sticky-close"></div>
        </div>
        <div class="sticky-media">
            <textarea spellcheck='false' class='sticky-text'></textarea>
        </div>`;
    
    let idele = sticky.querySelector('.sticky-id');
    let minimize = idele.querySelector('.sticky-minimize');
    let close = idele.querySelector('.sticky-close');
    dragElement(idele);
    minimize.addEventListener('click',minimizeFunction)
    close.addEventListener('click',closeFunction);
    stickyNoteContainer.appendChild(sticky);
})

// DRAG ITEM

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      let ep = elmnt.parentNode;
      ep.style.top = (ep.offsetTop - pos2) + "px";
      ep.style.left = (ep.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

function minimizeFunction(e) {
    let mediaArea = e.target.parentNode.parentNode.querySelector('.sticky-media');
    let display = getComputedStyle(mediaArea).getPropertyValue('display');
    if(display == 'none') mediaArea.style.display = 'flex';
    else mediaArea.style.display ='none';
}
function closeFunction(e) {
    e.target.parentNode.parentNode.remove();
}

uploadBtn.addEventListener('click', (e)=> {
    let input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    input.addEventListener('change', (e)=> {
        let file = input.files[0];
        let url = URL.createObjectURL(file);
        
        let sticky = document.createElement('div');
        sticky.className = 'sticky';
        let myId = shortid();
        sticky.setAttribute('id', myId);
        sticky.innerHTML = `
            <div class="sticky-id">${'#'+myId}
                <div class="sticky-minimize"></div>
                <div class="sticky-close"></div>
            </div>
            <div class="sticky-media">
                <img class='sticky-img' src='${url}'/>
            </div>`;
        
        let idele = sticky.querySelector('.sticky-id');
        let minimize = idele.querySelector('.sticky-minimize');
        let close = idele.querySelector('.sticky-close');
        dragElement(idele);
        minimize.addEventListener('click',minimizeFunction)
        close.addEventListener('click',closeFunction);
        stickyNoteContainer.appendChild(sticky);
    })
})