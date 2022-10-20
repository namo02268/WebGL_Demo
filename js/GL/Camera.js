class Camera {
  #fov;
  #aspect;
  #zNear;
  #zFar;
  #projectionMatrix;

  constructor() {
    this.#fov = (45 * Math.PI) / 180;
    this.#aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    this.#zNear = 0.1;
    this.#zFar = 100.0;
    this.#projectionMatrix = mat4.create();
  }

  GetProjection() {
    return mat4.perspective(
      this.#projectionMatrix,
      this.#fov,
      this.#aspect,
      this.#zNear,
      this.#zFar
    );
  }
}
