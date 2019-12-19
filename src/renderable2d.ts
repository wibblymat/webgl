import { Mat3, mat3, v2, V2 } from '@wibblymat/maths';
import Geometry2D from './geometry2d';
import Texture from './texture';
import Shader from './shader';

/** Represents a thing that can be rendered in the 2D view */
export default class Renderable2D {
  protected $rotation: number = 0;
  protected scale: V2 = v2.create();
  protected $pos: V2 = v2.create();
  protected $transform = mat3.create();
  protected dirty = false;

  constructor(public geometry: Geometry2D, public texture: Texture, public shader: Shader) {
    mat3.identity(this.$transform);
  }

  render(gl: WebGL2RenderingContext) {
    this.geometry.bind();
    this.texture.bind(gl.TEXTURE0);
    this.shader.setUniformMat3('transform', this.transform);

    gl.drawElements(gl.TRIANGLES, this.geometry.vertexCount, gl.UNSIGNED_SHORT, 0);
  }

  get transform(): Mat3 {
    if (this.dirty) {
      mat3.identity(this.$transform);
      mat3.rotate(this.$transform, this.$transform, this.$rotation);
      mat3.translate(this.$transform, this.$transform, this.$pos);
      mat3.scale(this.$transform, this.$transform, this.scale);
      this.dirty = false;
    }
    return this.$transform;
  }

  setScale(scale: V2 | number) {
    this.dirty = true;
    if (typeof scale === 'number') {
      v2.set(this.scale, scale, scale);
    } else {
      v2.clone(this.scale, scale);
    }
  }

  get pos(): V2 {
    return this.$pos;
  }

  set pos(pos: V2) {
    this.dirty = true;
    v2.clone(this.$pos, pos);
  }

  get rotation(): number {
    return this.$rotation;
  }

  set rotation(rotation: number) {
    this.dirty = true;
    this.$rotation = rotation;
  }
}
