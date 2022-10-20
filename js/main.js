let gl;
window.onload = main;

//
// Start here
//
function main() {
  //-------------------Init GL-------------------//
  const canvas = document.querySelector("#glCanvas");
  gl = canvas.getContext("webgl");
  if (!gl) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  //-------------------Buffer-------------------//
  const positionBuffer = new VertexBuffer();
  positionBuffer.SetData(Box.positions);
  const colorBuffer = new VertexBuffer();
  colorBuffer.SetData(Box.colors);
  const indexBuffer = new IndexBuffer();
  indexBuffer.SetData(Box.indices);

  buffers = {
    position: positionBuffer,
    color: colorBuffer,
    index: indexBuffer,
  }


  //-------------------Shader-------------------//\
  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;
  const fsSource = `
    varying lowp vec4 vColor;

    void main() {
      gl_FragColor = vColor;
    }
  `;
  const shader = new Shader(vsSource, fsSource);

  //-------------------Camera-------------------//
  const camera = new Camera(gl.canvas.clientWidth, gl.canvas.clientHeight);

  //-------------------Render Loop-------------------//
  let lastFrame = 0;
  function render(currentFrame) {
    currentFrame *= 0.001;
    const deltaTime = currentFrame - lastFrame;
    lastFrame = currentFrame;

    drawScene(deltaTime, camera, shader, buffers);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
