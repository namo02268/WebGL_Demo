let cubeRotation = 0.0;

function drawScene(deltaTime, camera, shader, buffers) {
  //-------------------Window-------------------//
  gl.clearColor(0.2, 0.2, 0.2, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //-------------------Camera-------------------//
  const projectionMatrix = camera.GetProjection();

  //-------------------Model-------------------//
  const modelViewMatrix = mat4.create();
  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
  cubeRotation += deltaTime;
  mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 0, 1]);
  mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.7, [0, 1, 0]);
  mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.3, [1, 0, 0]);

  {
    const numComponents = 3
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    buffers.position.Bind();
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
    buffers.color.Bind();
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
    buffers.index.Bind();
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}
