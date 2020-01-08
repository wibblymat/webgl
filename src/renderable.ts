import Shader from './shader';

/** Represents a thing that can be rendered */
export default abstract class Renderable {
  public abstract shader: Shader;

  abstract render(gl: WebGL2RenderingContext): void;
}
