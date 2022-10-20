let cubeRotation = 0.0;

function drawScene(deltaTime) {
  //-------------------Buffer-------------------//
  const positionBuffer = new VertexBuffer();
  positionBuffer.SetData(Box.positions);
  const colorBuffer = new VertexBuffer();
  colorBuffer.SetData(Box.colors);
  const indexBuffer = new IndexBuffer();
  indexBuffer.SetData(Box.indices);

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

  //-------------------Window-------------------//
  gl.clearColor(0.2, 0.2, 0.2, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //-------------------Camera-------------------//
  const fieldOfView = (45 * Math.PI) / 180; // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;

  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  const modelViewMatrix = mat4.create();
  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
  cubeRotation += deltaTime;
  mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 0, 1]);
  mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.7, [0, 1, 0]);
  mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.3, [1, 0, 0]);

  //-------------------Model-------------------//
  {
    const numComponents = 3
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
    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    indexBuffer.Bind();
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}
