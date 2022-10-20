function drawScene(gl, shader) {
  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
  const colors = [
    1.0, 1.0, 1.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
  ];

  //-------------------Buffer-------------------//
  const positionBuffer = new Buffer(gl);
  positionBuffer.SetData(positions);
  const colorBuffer = new Buffer(gl);
  colorBuffer.SetData(colors);

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

  //-------------------A-------------------//
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
