import { glerr } from './glerr';

let activeProgram: WebGLProgram | null = null;

export default class Shader {
  protected program: WebGLProgram;
  protected uniformLocations: Map<string, WebGLUniformLocation>;
  protected gl: WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string) {
    this.gl = gl;
    this.program = gl.createProgram() || glerr(gl);
    this.addShader(vertexSource, gl.VERTEX_SHADER);
    this.addShader(fragmentSource, gl.FRAGMENT_SHADER);
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(this.program);
      throw new Error('Could not link shader program. \n\n' + info);
    }
    gl.validateProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.VALIDATE_STATUS)) {
      const info = gl.getProgramInfoLog(this.program);
      throw new Error('Could not validate shader program. \n\n' + info);
    }
    this.uniformLocations = new Map();
    this.getUniformLocations();
  }

  hasUniform(name: string): boolean {
    return this.uniformLocations.has(name);
  }

  /**
   * Make this shader program the active program
   */
  start() {
    if (this.program !== activeProgram) {
      activeProgram = this.program;
      this.gl.useProgram(this.program);
    }
  }

  /**
   * Deactivate the shader program
   */
  stop() {
    activeProgram = null;
    this.gl.useProgram(null);
  }

  /**
   * Set a float uniform value
   */
  setUniformFloat(name: string, value: number) {
    if (!this.uniformLocations.has(name)) {
      console.log(`Tried to set unknown uniform ${name}`);
      return;
    }
    this.gl.uniform1f(this.uniformLocations.get(name)!, value);
  }

  /**
   * Set an integer uniform value
   */
  setUniformInt(name: string, value: number) {
    if (!this.uniformLocations.has(name)) {
      console.log(`Tried to set unknown uniform ${name}`);
      return;
    }
    this.gl.uniform1i(this.uniformLocations.get(name)!, value);
  }

  /**
   * Set a vec3 uniform value
   */
  setUniformVec3(name: string, value: Float32Array) {
    if (!this.uniformLocations.has(name)) {
      console.log(`Tried to set unknown uniform ${name}`);
      return;
    }
    this.gl.uniform3fv(this.uniformLocations.get(name)!, value);
  }

  /**
   * Set a vec4 uniform value
   */
  setUniformVec4(name: string, value: Float32Array) {
    if (!this.uniformLocations.has(name)) {
      console.log(`Tried to set unknown uniform ${name}`);
      return;
    }
    this.gl.uniform4fv(this.uniformLocations.get(name)!, value);
  }

  /**
   * Set a mat3 uniform value
   */
  setUniformMat3(name: string, value: Float32Array) {
    if (!this.uniformLocations.has(name)) {
      console.log(`Tried to set unknown uniform ${name}`);
      return;
    }
    this.gl.uniformMatrix3fv(this.uniformLocations.get(name)!, false, value);
  }

  /**
   * Set a mat4 uniform value
   */
  setUniformMat4(name: string, value: Float32Array) {
    if (!this.uniformLocations.has(name)) {
      console.log(`Tried to set unknown uniform ${name}`);
      return;
    }
    this.gl.uniformMatrix4fv(this.uniformLocations.get(name)!, false, value);
  }

  /**
   * Get the location of each uniform used in the shader and store it in a Map
   */
  protected getUniformLocations() {
    const numUniforms = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < numUniforms; i++) {
      const info = this.gl.getActiveUniform(this.program, i) || glerr(this.gl);
      if (info.size === 1) {
        const location = this.getUniformLocation(info.name);
        if (location) {
          this.uniformLocations.set(info.name, location);
        }
      } else {
        const baseName = info.name.replace(/\[\d+\]/, '');
        for (let j = 0; j < info.size; j++) {
          const name = `${baseName}[${j}]`;
          const location = this.getUniformLocation(name);
          if (location) {
            this.uniformLocations.set(name, location);
          }
        }
      }
    }
  }

  /**
   * Get the location of a named uniform
   */
  protected getUniformLocation(name: string) {
    return this.gl.getUniformLocation(this.program, name);
  }

  protected addShader(source: string, type: number) {
    const shader = this.gl.createShader(type) || glerr(this.gl);
    this.gl.shaderSource(shader, source);
    // TODO: Error checking here
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const lines = source.split('\n');
      console.table(['', ...lines]);
      throw new Error(`Couldn't compiler shader: ${this.gl.getShaderInfoLog(shader)}`);
    }
    this.gl.attachShader(this.program, shader);
    // TODO: Error checking here
    return shader;
  }
}
