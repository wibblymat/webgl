import { mat4, Mat4, v3, v4 } from '@wibblymat/maths';
import Shader from './shader';
import Renderable from './renderable';

export default class Renderer {
  gl: WebGL2RenderingContext;
  public projection = mat4.create();
  public view = mat4.create();
  protected renderList: Renderable[] = [];

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('webgl2');

    if (!ctx) {
      throw new Error(`Couldn't get a WebGL context`);
    }

    this.gl = ctx;
    // this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    // Sensible defaults for view and projection matrices
    mat4.identity(this.view);
    mat4.ortho(this.projection, canvas.width, canvas.height, 100);
  }

  add(renderable: Renderable) {
    this.renderList.push(renderable);
  }

  render() {
    this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    let currentShader: Shader | null = null;

    for (const obj of this.renderList) {
      if (obj.shader !== currentShader) {
        currentShader = obj.shader;
        currentShader.start();
        currentShader.setUniformMat4('projection', this.projection);
        currentShader.setUniformMat4('view', this.view);
      }

      obj.render(this.gl);
    }

    this.renderList = [];
  }
}
