import { Stone } from './stone';

const ICE_LENGTH = 1380;
const ICE_WIDTH = 140;

export class GameCelebration {

    private dest: any[];
    private from: any[];
    private material: THREE.Material;
    private geometry: THREE.PlaneBufferGeometry;
    private mesh: THREE.Mesh;
    private allMeshes: any[];
    private isGoingUp: boolean;
    private factor: boolean;
    private height: number;
    private scene: any;

    constructor(scene: any) {
        this.initialize(scene);
    }

    public initialize(scene: any): void {
        this.dest = [];
        this.from = [];
        this.geometry = new THREE.PlaneBufferGeometry(2, 4);
        this.allMeshes = [];
        this.isGoingUp = true;
        this.factor = true;
        this.height = 0;
        this.scene = scene;
    }

    public createMesh(): void {
        let x = THREE.Math.randInt(-ICE_WIDTH / 2, ICE_WIDTH / 2);
        let y = THREE.Math.randInt(100, 300);
        let z = THREE.Math.randInt(0, ICE_LENGTH);

        let start = new THREE.Vector3(x, y, z);
        let to = new THREE.Vector3(x, 0, z);

        let color1 = new THREE.Color();
        color1.setHex(Math.random() * 0xffffff);

        this.material = new THREE.MeshBasicMaterial({
            color: color1.getHex(),
            side: THREE.DoubleSide,
            opacity: 1,
            transparent: true
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.material.opacity = 0;
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
        this.allMeshes.push({ mesh: this.mesh, start: start, to: to });
        this.scene.add(this.mesh);
    }

    public reset(stones: Stone[]): void {
        for (let i = 0; i < this.allMeshes.length; i++) {
            this.scene.remove(this.allMeshes[i].mesh);
        }
        this.allMeshes.length = 0;
        for (let stone of stones) {
            stone.getPosition().y = 0;
        }
    }

    public update(): void {
        this.createMesh();
        for (let i = 0; i < this.allMeshes.length; i++) {
            let rotateVelocity = Math.random() * (2 - 0.5) + 0.5;
            this.allMeshes[i].mesh.material.opacity = 1;
            if (this.allMeshes[i].mesh.position.y > 0) {
                this.allMeshes[i].mesh.position.y -= this.allMeshes[i].to.y + 0.4;
                this.allMeshes[i].mesh.rotation.x += rotateVelocity * Math.PI / 180;
                this.allMeshes[i].mesh.rotation.z += rotateVelocity * Math.PI / 180;
            }
        }
    }

    public jumpStone(stones: Stone[]): void {
        if (this.height >= 12) {
            this.factor = false;
        }
        else if (this.height <= 0) {
            this.factor = true;
        }
        this.factor ? this.upStones(stones) : this.downStones(stones);
    }

    public upStones(stones: Stone[]): void {
        for (let stone of stones) {
            stone.getPosition().y++;
        }
        this.height++;
    }
    public downStones(stones: Stone[]): void {
        for (let stone of stones) {
            stone.getPosition().y--;
        }
        this.height--;
    }
}
