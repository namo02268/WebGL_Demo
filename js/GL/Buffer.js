class VertexBuffer {
  // private member variables
  #m_id;

  constructor(type) {
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

class IndexBuffer {
  // private member variables
  #m_id;

  constructor(type) {
    this.#m_id = gl.createBuffer();
  }

  Bind() {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#m_id);
  }

  SetData(data) {
    this.Bind();
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
  }

  GetID() {
    return this.#m_id;
  }
}
