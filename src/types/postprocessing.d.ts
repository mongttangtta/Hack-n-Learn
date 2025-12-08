declare module 'postprocessing' {
  import * as THREE from 'three';

  export class Effect {
    constructor(name: string, fragmentShader: string, options?: { uniforms?: Map<string, THREE.Uniform>, blendFunction?: any });
    uniforms: Map<string, THREE.Uniform>;
  }

  export class Pass {
    renderToScreen: boolean;
    effects?: Effect[];
    setSize(width: number, height: number): void;
    render(renderer: THREE.WebGLRenderer, writeBuffer: THREE.WebGLRenderTarget, readBuffer: THREE.WebGLRenderTarget, deltaTime: number, maskActive: boolean): void;
    dispose(): void;
  }

  export class EffectPass extends Pass {
    constructor(camera: THREE.Camera, ...effects: Effect[]);
  }

  export class RenderPass extends Pass {
    constructor(scene: THREE.Scene, camera: THREE.Camera, overrideMaterial?: THREE.Material, clearColor?: THREE.Color, clearAlpha?: number);
  }

  export class EffectComposer {
    constructor(renderer: THREE.WebGLRenderer, options?: { depthBuffer?: boolean, stencilBuffer?: boolean, frameBufferType?: THREE.Type });
    addPass(pass: Pass): void;
    removePass(pass: Pass): void;
    render(deltaTime?: number): void;
    setSize(width: number, height: number): void;
    passes: Pass[];
    dispose(): void;
  }
}
