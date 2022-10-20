class Shader {
  // private variables
  #m_handle;

  constructor(vertexSource, fragmentSource) {
    const vertexShader = this.#LoadShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.#LoadShader(gl.FRAGMENT_SHADER, fragmentSource);

    this.#m_handle = gl.createProgram();
    gl.attachShader(this.#m_handle, vertexShader);
    gl.attachShader(this.#m_handle, fragmentShader);
    gl.linkProgram(this.#m_handle)

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (!gl.getProgramParameter(this.#m_handle, gl.LINK_STATUS)) {
      alert(
        "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(this.#m_handle)
      );
      return null;
    }
  }

  Bind() {
    gl.useProgram(this.#m_handle);
  }

  GetAttribLocation(name) {
    return gl.getAttribLocation(this.#m_handle, name);
  }

  GetUniformLocation(name) {
    return gl.getUniformLocation(this.#m_handle, name);
  }

  SetUniformMatrix4(name, value) {
    gl.uniformMatrix4fv(this.GetUniformLocation(name), false, value);
  }

  #LoadShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(
        "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
      );
      return null;
    }
    return shader;
  }
}
