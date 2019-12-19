const messages: { [id: number]: string } = {};

messages[WebGL2RenderingContext.NO_ERROR] = 'No error has been recorded.';
messages[WebGL2RenderingContext.INVALID_ENUM] = 'An unacceptable value has been specified for an enumerated argument.';
messages[WebGL2RenderingContext.INVALID_VALUE] = 'A numeric argument is out of range.';
messages[WebGL2RenderingContext.INVALID_OPERATION] = 'The specified command is not allowed for the current state.';
messages[WebGL2RenderingContext.INVALID_FRAMEBUFFER_OPERATION] =
    'The currently bound framebuffer is not framebuffer complete when trying to render to or to read from it.';
messages[WebGL2RenderingContext.OUT_OF_MEMORY] = 'Not enough memory is left to execute the command.';
messages[WebGL2RenderingContext.CONTEXT_LOST_WEBGL] = 'The WebGL context is lost';

export function glerr(gl: WebGL2RenderingContext): never {
  const error = gl.getError();
  throw new Error(`WebGL error state: ${messages[error]}`);
}
