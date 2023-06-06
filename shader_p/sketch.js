let img;
let shaderProgram;
let currentEffect = 'vignette';
let toggleButton;
let intervalId; // Variable para almacenar el ID del intervalo

let vertices = [];
let interval = 1000;

function preload() {
  shaderProgram = loadShader('shaders/shader.vert', 'shaders/vignette.frag');
}

function setup() {
  createCanvas(400, 400, WEBGL);
  noLoop();

  toggleButton = createButton('Cambiar efecto');
  toggleButton.position(10, height + 10);
  toggleButton.mousePressed(toggleEffect);

  reloadButton = createButton('Recargar imagen');
  reloadButton.position(130, height + 10);
  reloadButton.mousePressed(reloadImageAndApplyEffect);

  intervalId = setInterval(changeVertexValues, interval);

  // Inicializa los vértices del dibujo con valores aleatorios
  for (let i = 0; i < 4; i++) {
    vertices.push([random(-1, 1), random(-1, 1)]);
  }
}

function loadImageAndApplyEffect() {
  let randomNum = Math.floor(random(0, 40));
  loadImage('assets/' + str(randomNum) + '.jpg', function(loadedImg) {
    img = loadedImg;
    redraw();
  });
}

function applyVignetteEffect() {
  shaderProgram = loadShader('shaders/shader.vert', 'shaders/vignette.frag');
  currentEffect = 'vignette';
  loadImageAndApplyEffect();
}

function applyUnfocusEffect() {
  shaderProgram = loadShader('shaders/shader.vert', 'shaders/unfocus.frag');
  currentEffect = 'unfocus';
  loadImageAndApplyEffect();
}

function applyZoomEffect() {
  shaderProgram = loadShader('shaders/shader.vert', 'shaders/zoom.frag');
  currentEffect = 'zoom';
  loadImageAndApplyEffect();
}

function draw() {
  if (!img) return;

  shader(shaderProgram);
  shaderProgram.setUniform('u_texture', img);

  if (currentEffect === 'vignette') {
    shaderProgram.setUniform('u_radius', 0.5);
    shaderProgram.setUniform('u_softness', 0.2);
  } else if (currentEffect === 'unfocus') {
    shaderProgram.setUniform('u_blurAmount', 0.02);
  } else if (currentEffect === 'zoom') {
    shaderProgram.setUniform('u_zoomAmount', 1.5);
  }

  beginShape();
  for (let i = 0; i < 4; i++) {
    let vertexData = vertices[i];
    vertex(vertexData[0], vertexData[1], i % 2, floor(i / 2));
  }
  endShape(CLOSE);
}

function toggleEffect() {
  if (currentEffect === 'vignette') {
    applyUnfocusEffect();
  } else if (currentEffect === 'unfocus') {
    applyZoomEffect();
  } else {
    applyVignetteEffect();
  }
}

function reloadImageAndApplyEffect() {
  loadImageAndApplyEffect();
}

function changeVertexValues() {
  // Genera nuevos valores aleatorios para los vértices
  for (let i = 0; i < 4; i++) {
    vertices[i] = [random(-1, 1), random(-1, 1)];
  }

  redraw(); // Vuelve a dibujar la escena con los nuevos valores
}

function changeInterval() {
  // Cambia el intervalo del setInterval
  interval = intervalSlider.value();
  clearInterval(intervalId); // Cancela el intervalo actual utilizando el ID almacenado
  intervalId = setInterval(changeVertexValues, interval); // Establece el nuevo intervalo
}

loadImageAndApplyEffect();
