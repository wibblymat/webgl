import { glerr } from './glerr';

interface TextureOptions {
  width?: number;
  height?: number;
  flip?: boolean;
}

export default class Texture {
  static fromU8Array(gl: WebGL2RenderingContext, data: Uint8Array, width: number, height: number, format: number) {
    const texture = new Texture(gl, null);
    texture.width = width;
    texture.height = height;
    texture.bind(gl.TEXTURE0);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
  }

  id: WebGLTexture;
  width: number;
  height: number;
  protected gl: WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext, image: TexImageSource | null, options: TextureOptions = {}) {
    this.gl = gl;
    this.id = gl.createTexture() || glerr(gl);
    if (image) {
      // TODO: I want to use naturalHeight/videoHeight/etc for different things
      this.width = image.width;
      this.height = image.height;
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, Boolean(options.flip));
      this.update(image);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    } else if (options.width && options.height) {
      this.width = options.width;
      this.height = options.height;
      this.create(options.width, options.height);
    } else {
      this.width = 0;
      this.height = 0;
      return;
    }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.generateMipmap(gl.TEXTURE_2D);
  }

  update(image: TexImageSource) {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
  }

  create(width: number, height: number) {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
  }

  /**
   * Bind this texture to a texture unit
   */
  bind(unit: number) {
    this.gl.activeTexture(unit);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
  }

  unbind() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }

  delete() {
    this.gl.deleteTexture(this.id);
  }
}
