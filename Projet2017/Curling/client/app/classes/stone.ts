import { GameAudio } from './audio';
import { Physics } from './physics';

const STONE_SCORING_COLOR = 0xb15507;
const BLACK = 0x000000;

export class Stone {

    mesh: THREE.Mesh;
    radius: number;
    isHit: boolean;
    direction: THREE.Vector3;
    stoneThrown: boolean;
    speed: number;
    promiseCounter: any;
    color: string;
    id: number;

    constructor(obj: THREE.Object3D, color: string, id: number) {
        this.radius = new THREE.Box3().setFromObject(obj).getSize().x / 2;
        this.mesh = obj as THREE.Mesh;
        this.color = color;
        this.id = id;
        this.isHit = false;
        this.direction = new THREE.Vector3(0, 0, 1);
        this.stoneThrown = false;
        this.speed = 0;
        this.promiseCounter = 0;
    }

    public setPosition(pos: THREE.Vector3): void {
        this.mesh.position = pos.clone();
    }

    public getPosition(): THREE.Vector3 {
        return this.mesh.position;
    }

    public setDirection(dir: THREE.Vector3): void {
        this.direction = dir.clone();
    }

    public getDirection(): THREE.Vector3 {
        return this.direction;
    }

    public setSpeed(speed: number): void {
        this.speed = speed;
    }

    public getSpeed(): number {
        return this.speed;
    }

    public getId(): number {
        return this.id;
    }

    public getRadius(): number {
        return this.radius;
    }

    public move(audio: GameAudio, physics: Physics, spinVelocity: number): void {
        this.mesh.position.add(this.direction.clone().multiplyScalar(this.speed));
        if (this.stoneThrown) {
            audio.playGlide(this.speed);
        }
        this.speed = physics.applyFriction(this.speed, this.mesh.position);
        audio.decreaseGlide(this.speed);

        physics.spin(this, spinVelocity);
    }

    public illuminate(): void {
        // 3 car les .dae des pierres contiennent 3 childrens (top, poignee et stone)
        for (let i = 0; i < 3; i++) {
            let mesh = (this.mesh.children[0].children[i] as THREE.Mesh);
            (((mesh).material) as THREE.MeshPhongMaterial).emissive.setHex(STONE_SCORING_COLOR);
        }
    }

    public removeLight(): void {
        // 3 car les .dae des pierres contiennent 3 childrens (top, poignee et stone)
        for (let i = 0; i < 3; i++) {
            let mesh = (this.mesh.children[0].children[i] as THREE.Mesh);
            (((mesh).material) as THREE.MeshPhongMaterial).emissive.setHex(BLACK);
        }
    }

}
