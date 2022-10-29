class Texture {
  // private variables
  #m_handle;
  #m_width = 1;
  #m_height = 1;
  #m_level = 0;
  #m_internalFormat = gl.RGBA;
  #m_srcFormat = gl.RGBA;
  #m_srcType = gl.UNSIGNED_BYTE;

  constructor() {
    this.#m_handle = gl.createTexture();
  }

  Bind() {
    gl.bindTexture(gl.TEXTURE_2D, this.#m_handle);
  }

  Load(pass) {
    const image = new Image();
    image.src = pass;

    image.onload = () => {
      this.#m_width = image.width;
      this.#m_height = image.height;

      this.Bind();
      gl.texImage2D(
        gl.TEXTURE_2D,
        this.#m_level,
        this.#m_internalFormat,
        this.#m_srcFormat,
        this.#m_srcType,
        image);
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    };
  }
}

function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}
