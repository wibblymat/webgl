import { glerr } from './glerr';

export default class Geometry2D {
  static getQuad(gl: WebGL2RenderingContext): Geometry2D {
    const quad = new Geometry2D(
      gl,
      new Uint16Array([0, 1, 3, 1, 2, 3]),
      new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]),
      new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]),
    );

    return quad;
  }

  readonly vertexCount: number;
  readonly indexType: number = WebGL2RenderingContext.UNSIGNED_SHORT;
  protected vao: WebGLVertexArrayObject;
  protected gl: WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext, index: Uint16Array, positions: Float32Array, uvs: Float32Array) {
    this.gl = gl;
    this.vao = gl.createVertexArray() || glerr(gl);
    this.vertexCount = index.length;
    gl.bindVertexArray(this.vao);
    this.bindIndicesBuffer(index);
    this.bindAttributeBuffer(0, 2, positions);
    this.bindAttributeBuffer(1, 2, uvs);
    gl.bindVertexArray(null);
  }

  /**
   * Bind this geometry's vertex array and enable the attributes
   */
  bind() {
    this.gl.bindVertexArray(this.vao);
    this.gl.enableVertexAttribArray(0);
    this.gl.enableVertexAttribArray(1);
  }

  /**
   * Unbind this geometry's vertex array and disable the attributes
   */
  unbind() {
    this.gl.bindVertexArray(null);
    this.gl.disableVertexAttribArray(0);
    this.gl.disableVertexAttribArray(1);
  }

  /**
   * Bind some data to a vertex attribute
   */
  bindAttributeBuffer(attributeNumber: number, size: number, data: Float32Array) {
    const id = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, id);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(attributeNumber, size, this.gl.FLOAT, false, 0, 0);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  /**
   * Bind data to an element index array
   */
  bindIndicesBuffer(data: Uint16Array) {
    const id = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, id);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
  }
}
