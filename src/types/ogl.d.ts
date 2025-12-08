declare module 'ogl' {
  export class Renderer {
    constructor(options?: { dpr?: number, canvas?: HTMLCanvasElement });
    gl: WebGLRenderingContext;
    setSize(width: number, height: number): void;
    render(options: { scene: Mesh, camera?: any }): void;
    getExtension(name: string): any;
    dispose(): void;
  }

  export class Program {
    constructor(gl: WebGLRenderingContext, options: { vertex: string, fragment: string, uniforms: { [key: string]: any } });
    uniforms: { [key: string]: any };
  }

  export class Mesh {
    constructor(gl: WebGLRenderingContext, options: { geometry: Geometry, program: Program });
  }

  export class Color {
    constructor(r: number | string, g?: number, b?: number);
    set(r: number | string, g?: number, b?: number): this;
  }

  export class Triangle {
    constructor(gl: WebGLRenderingContext);
  }

  export class Geometry {
    constructor(gl: WebGLRenderingContext, options?: { attributes?: { [key: string]: any } });
  }
}
