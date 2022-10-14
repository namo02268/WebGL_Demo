function initBuffers(gl) {
  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
  const colors = [
    1.0, 1.0, 1.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
  ];

  const positionBuffer = gl.createBuffer();
  const colorBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
  };
}

class Buffer {
  constructor(gl) {
    this.gl = gl;
    this.id = gl.createBuffer();
  }

  Bind() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.id);
  }

  setData(data) {
    this.Bind();
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
  }
}
