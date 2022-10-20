class Buffer {
  // private member variables
  #m_id;

  constructor() {
    this.#m_id = gl.createBuffer();
  }

  Bind() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.#m_id);
  }

  SetData(data) {
    this.Bind();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  }

  GetID() {
    return this.#m_id;
  }
}
