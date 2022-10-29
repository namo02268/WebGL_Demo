let cubeRotation = 0.0;

class Scene {
  #camera;
  #shader;
  #buffers;
  #texture;

  Init() {
    //-------------------Init Camera-------------------//
    this.#camera = new Camera(gl.canvas.clientWidth, gl.canvas.clientHeight);

    //-------------------Init Shader-------------------//\
    const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
    `;
    const fsSource = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main() {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
    `;
    this.#shader = new Shader(vsSource, fsSource);

    //-------------------Init Buffers-------------------//
    const positionBuffer = new VertexBuffer();
    positionBuffer.SetData(Box.positions);
    const textureCoordBuffer = new VertexBuffer();
    textureCoordBuffer.SetData(Box.textureCoordinates);
    const indexBuffer = new IndexBuffer();
    indexBuffer.SetData(Box.indices);

    this.#buffers = {
      position: positionBuffer,
      texture: textureCoordBuffer,
      index: indexBuffer,
    }

    //-------------------Init Texture-------------------//
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    this.#texture = new Texture();
    this.#texture.Load("../images/img1.jpg");
  }

  Draw(deltaTime) {
    this.#Resize();

    //-------------------Clear-------------------//
    gl.clearColor(0.2, 0.2, 0.2, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //-------------------Camera-------------------//
    const projectionMatrix = this.#camera.GetProjection();

    //-------------------Transform & Draw Model-------------------//
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
    cubeRotation += deltaTime;
    mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 0, 1]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.7, [0, 1, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.3, [1, 0, 0]);

    this.#shader.Bind();
    this.#shader.SetUniformMatrix4("uProjectionMatrix", projectionMatrix);
    this.#shader.SetUniformMatrix4("uModelViewMatrix", modelViewMatrix);

    {
      const numComponents = 3
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      this.#buffers.position.Bind();
      gl.vertexAttribPointer(
        this.#shader.GetAttribLocation("aVertexPosition"),
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
      gl.enableVertexAttribArray(this.#shader.GetAttribLocation("aVertexPosition"));
    }

    {
      const numComponents = 2
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      this.#buffers.texture.Bind();
      gl.vertexAttribPointer(
        this.#shader.GetAttribLocation("aTextureCoord"),
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
      gl.enableVertexAttribArray(this.#shader.GetAttribLocation("aTextureCoord"));
    }

    {
      const vertexCount = 36;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      this.#buffers.index.Bind();
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
  }

  #Resize() {
    const displayWidth = gl.canvas.clientWidth;
    const displayHeight = gl.canvas.clientHeight;

    if (gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight) {
      gl.canvas.width = displayWidth;
      gl.canvas.height = displayHeight;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      this.#camera.Resize(gl.canvas.width, gl.canvas.height);
    }
  }
}
