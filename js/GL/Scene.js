let squareRotation = 0.0;

function drawScene(deltaTime) {
  //-------------------Buffer-------------------//
  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
  const positionBuffer = new Buffer(gl);
  positionBuffer.SetData(positions);
  const colors = [
    1.0, 1.0, 1.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
  ];
  const colorBuffer = new Buffer(gl);
  colorBuffer.SetData(colors);

  //-------------------Window-------------------//
  gl.clearColor(0.2, 0.2, 0.2, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //-------------------Shader-------------------//
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
  const fieldOfView = (45 * Math.PI) / 180; // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;

  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  const modelViewMatrix = mat4.create();
  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
  squareRotation += deltaTime;
  mat4.rotate(modelViewMatrix, modelViewMatrix, squareRotation, [0, 0, 1]);

  //-------------------Model-------------------//
  {
    const numComponents = 2
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    positionBuffer.Bind();
    gl.vertexAttribPointer(
      shader.GetAttribLocation("aVertexPosition"),
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(shader.GetAttribLocation("aVertexPosition"));
  }

  {
    const numComponents = 4
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    colorBuffer.Bind();
    gl.vertexAttribPointer(
      shader.GetAttribLocation("aVertexColor"),
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(shader.GetAttribLocation("aVertexColor"));
  }


  shader.Bind();
  shader.SetUniformMatrix4("uProjectionMatrix", projectionMatrix);
  shader.SetUniformMatrix4("uModelViewMatrix", modelViewMatrix);

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}
