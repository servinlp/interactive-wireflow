var i, u, q, pos = [[0,0], [0,0], 1],
    container = document.querySelector(".wireflow"),
    body = document.querySelector("body"),
    header = document.querySelector("header.stats"),
    firstPspan = header.querySelectorAll("p:first-child span")[0],
    lastPspan = header.querySelectorAll("p:last-child span")[0],
    eve = [0,0],
    map = {},
    range = [document.querySelectorAll("aside div input[type='range']")[0], 0];

function startBegin(){
  var start = document.querySelector(".begin"),
  widthWith = container.clientWidth,
  heightWith = container.clientHeight,
  getStyle = window.getComputedStyle(start, null),
  containerStyle = window.getComputedStyle(container, null),
  padding = parseInt(containerStyle.getPropertyValue("padding")),
  startWidth = getStyle.getPropertyValue("width"),
  posX = (widthWith / 2) - (parseInt(startWidth) / 2);

  start.style.left = posX + "px";

  setStates(start, padding);
  dragNavigation();
  createConnection();
  controlles();
}
startBegin();

function setStates(begin, padding){
  var allItems = document.querySelectorAll(".item:not(.begin)"),
  x,
  y;

  for (i = 0; i < allItems.length; i++) {
    x = allItems[i].getAttribute("data-x");
    y = allItems[i].getAttribute("data-y");

    // console.log(parseInt(x));
    // console.log(padding);
    // q = parseInt(x) >= padding ? padding : x;
    allItems[i].style.left = parseInt(x) + "px";

    // q = parseInt(y) <= padding ? padding : y;
    allItems[i].style.top = parseInt(y) + "px";
  }
  container.classList.add("active");
}

function dragNavigation(){
  var containerStyle = window.getComputedStyle(container, null),
  padding = parseInt(containerStyle.getPropertyValue("padding"));

  body.addEventListener("mousedown", function(event){
    pos[1][0] = event.screenX + negToggle(pos[0][0]);
    pos[1][1] = event.screenY + negToggle(pos[0][1]);
    // this.classList.add("drag");
    this.addEventListener("mousemove", onDrag);
  });
  body.addEventListener("mouseup", function(event){
    // this.classList.remove("drag");
    this.removeEventListener("mousemove", onDrag);
  });

  // TOUCH EVENTS
  body.addEventListener("touchstart", function(event){
    pos[1][0] = event.screenX + negToggle(pos[0][0]) || event.touches[0].clientX + negToggle(pos[0][0]);
    pos[1][1] = event.screenY + negToggle(pos[0][1]) || event.touches[0].clientY + negToggle(pos[0][1]);
    this.addEventListener("touchmove", onDrag);
  });
  body.addEventListener("touchend", function(event){
    this.removeEventListener("touchmove", onDrag);
    this.removeEventListener("touchend", onDrag);
  });
}

function onDrag(e){
  eve[0] = e.screenX || e.touches[0].clientX;
  eve[1] = e.screenY || e.touches[0].clientY;

  pos[0][0] = pos[1][0] == eve[0] ? pos[0][0] : eve[0] - pos[1][0];
  pos[0][1] = pos[1][1] == eve[1] ? pos[0][1] : eve[1] - pos[1][1];

  firstPspan.innerHTML = pos[1][0];
  lastPspan.innerHTML = pos[1][1];

  container.style.transform = "matrix("+pos[2]+", 0, 0, "+pos[2]+", "+pos[0][0]+", "+pos[0][1]+")";
  // console.log(pos);
}
// function onDrag(e){
//   // console.log(e);
//   // console.log(e.movementX);
//   // console.log(e.movementY);
//   // console.log(pos[0][0]);
//   // console.log(" ");
//   // eve[0] = e.screenX || e.touches[0].clientX;
//   // eve[1] = e.screenY || e.touches[0].clientY;
//
//   pos[0][0] += e.movementX;
//   pos[0][1] += e.movementY;
//
//   // firstPspan.innerHTML = pos[1][0];
//   // lastPspan.innerHTML = pos[1][1];
//
//   container.style.transform = "matrix("+pos[2]+", 0, 0, "+pos[2]+", "+pos[0][0]+", "+pos[0][1]+")";
//   // console.log(pos);
// }

function negToggle(num){
  return num <= 0 ? Math.abs(num) : -Math.abs(num);
}

onkeydown = onkeyup = function(e) {
  e = e || event;
  map[e.keyCode] = e.type == "keydown";
  // console.log(map);
  if (map[17] && map[187]) {
    e.preventDefault();
    zoom(true, false);
    range[1] += 1;
    range[0].value = range[1];
  }

  if (map[17] && map[189]) {
    e.preventDefault();
    zoom(false, false);
    range[1] -= 1;
    range[0].value = range[1];
  }
  if (map[17] && map[48]) {
    e.preventDefault();
    zoom(false, true);
    range[0].value = 0;
    range[1] = 0;
  }
}

function zoom(zoom, full, numOf) {
  var zoomSize = numOf * 0.25 || 0.25;
  if (full) {
    pos[2] = 1;
    container.style.transform = "matrix("+pos[2]+", 0, 0, "+pos[2]+", "+pos[0][0]+", "+pos[0][1]+")";
    return;
  }
  if (pos[2] == 0.25 && !zoom || pos[2] == 1.75 && zoom) {
    return;
  }
  var zoomLevel = typeof numOf == "number" ? numOf * 0.25 : zoom ? 0.25 : -0.25,
  currStyle = window.getComputedStyle(container, null),
  transform = currStyle.getPropertyValue("transform");

  pos[2] = typeof numOf == "number" ? zoomLevel + 1 : pos[2] + zoomLevel;
  container.style.transform = "matrix("+pos[2]+", 0, 0, "+pos[2]+", "+pos[0][0]+", "+pos[0][1]+")";
}

function createConnection(){
  var allStart = document.querySelectorAll("[data-begin]"),
  id, curr, numbers, svg, line, boundingBox = [0,0], plusOr = [false, false],
  WIDTH = [0,0], HEIGHT = [0,0];
  for (i = 0; i < allStart.length; i++) {
    numbers = [];
    allStart[i].getAttribute("data-begin").replace(/(\d[\d\.]*)/g, function( x ) {
      var n = Number(x); if (x == n) { numbers.push(parseInt(x)); }
    });

    for (u = 0; u < numbers.length; u++) {
      id = numbers[u];
      boundingBox[0] = allStart[i].getBoundingClientRect();
      WIDTH[0] = allStart[i].clientWidth;
      HEIGHT[0] = allStart[i].clientHeight;

      curr = document.querySelector("[data-end='"+id+"']");
      boundingBox[1] = curr.getBoundingClientRect();
      WIDTH[1] = curr.clientWidth;
      HEIGHT[1] = curr.offsetHeight;

      WIDTH[2] = Math.abs((boundingBox[0].left + (WIDTH[0] / 2)) - (boundingBox[1].left + (WIDTH[1] / 2)));
      HEIGHT[2] = Math.abs((boundingBox[1].top - boundingBox[0].top) - (HEIGHT[0] / 2));

      plusOr[0] = boundingBox[0].top < boundingBox[1].top ? true : false;
      plusOr[1] = boundingBox[0].left < boundingBox[1].left ? true : false;

      svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", WIDTH[2]);
      svg.setAttribute("height", HEIGHT[2]);
      svg.setAttribute("version", "1.1");
      svg.setAttribute("data-connecter", id);

      line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("stroke", "black");
      line.setAttribute("stroke-width", "2");
      line.setAttribute("stroke-linecap", "round");
      line.setAttribute("x1", plusOr[1] ? 0 : WIDTH[2]);
      line.setAttribute("y1", plusOr[0] ? 0 : HEIGHT[2]);
      line.setAttribute("x2", plusOr[1] ? WIDTH[2] : 0);
      line.setAttribute("y2", plusOr[0] ? HEIGHT[2] : 0);
      svg.appendChild(line);

      container.appendChild(svg);

      svg.style.position = "absolute";
      svg.style.top = plusOr[0] ? (boundingBox[0].top + (HEIGHT[0] / 2)) : (boundingBox[1].top);
      svg.style.left = plusOr[1] ? (boundingBox[0].left + (WIDTH[0] / 2)) : (boundingBox[1].left + (WIDTH[1] / 2));
    }
  }
}

function controlles() {
  var defaultUse = document.querySelectorAll("aside div button, aside div input"),
  zoomButtons = document.querySelectorAll("aside div button"),
  rangeDirection;
  for (i = 0; i < defaultUse.length; i++) {
    defaultUse[i].addEventListener("mousedown", function(event){
      event.stopPropagation();
    }, false);
  }

  zoomButtons[0].addEventListener("click", function(){
    if (range[1] == 3) {
      return;
    }
    zoom(true, false);
    range[1] += 1;
    range[0].value = range[1];
  });

  zoomButtons[1].addEventListener("click", function(){
    if (range[1] == -3) {
      return;
    }
    zoom(false, false);
    range[1] -= 1;
    range[0].value = range[1];
  });

  range[0].addEventListener("change", function(){
    if (parseInt(range[0].value) > range[1]) {
      zoom(true, false, parseInt(range[0].value));
      range[0].setAttribute("value", parseInt(range[0].getAttribute("value")) + 1);
    } else {
      zoom(false, false, parseInt(range[0].value));
      range[0].setAttribute("value", parseInt(range[0].getAttribute("value")) - 1);
    }
    range[1] = parseInt(range[0].value);
  });

}





//
