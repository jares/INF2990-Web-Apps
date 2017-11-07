import { Injectable } from '@angular/core';

@Injectable()
export class RenderService {

    public activeCamera: THREE.Camera;
    private scene: THREE.Scene;
    private renderer: THREE.Renderer;

    public init(scene: THREE.Scene, activeCamera: THREE.Camera): void {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth * 0.99, window.innerHeight * 0.99);
        document.body.appendChild(this.renderer.domElement);
        this.scene = scene;
        this.activeCamera = activeCamera;
    }

    public removeCanvas(): void {
        document.body.removeChild(this.renderer.domElement);
    }

    public onResize(): void {
        const width = window.innerWidth * 0.99;
        const height = window.innerHeight * 0.99;
        this.renderer.setSize(width, height);
    }

    public render(): void {
        this.renderer.render(this.scene, this.activeCamera);
    }

    public getDomElement(): HTMLCanvasElement {
        return this.renderer.domElement;
    }
}
