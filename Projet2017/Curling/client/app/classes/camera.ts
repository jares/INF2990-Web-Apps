import { Stone } from './stone';

const SKYBOX_SIDE = 5000;
const ICE_LENGTH = 1380;
const DISTANCE_HOUSE_END = 160;

export class Camera {

    public activeCamera: THREE.Camera;
    public perspectiveCamera: THREE.Camera;
    private orthographicCamera: THREE.Camera;
    public isOrthoView: boolean;

    constructor() {
        let aspect = window.innerWidth / window.innerHeight;
        this.perspectiveCamera = new THREE.PerspectiveCamera(45, aspect, 0.1, SKYBOX_SIDE * 2);
        this.orthographicCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, SKYBOX_SIDE * 2);
        this.activeCamera = this.perspectiveCamera;
        this.positionCamera(new THREE.Vector3(0, 50, -100));
        this.activeCamera.up = new THREE.Vector3(0, 10, 0);
        this.activeCamera.lookAt(new THREE.Vector3(0, 0, 100));
        this.isOrthoView = false;
    }

    public positionCamera(coordinates: THREE.Vector3): void {
        this.activeCamera.position.set(coordinates.x, coordinates.y, coordinates.z);
    }

    public followCamera(movingStone: Stone): void {
        if (movingStone.stoneThrown && !this.isOrthoView) {
            let newPosition = new THREE.Vector3();
            let movementVector = movingStone.direction.clone().multiplyScalar(movingStone.speed);
            newPosition.addVectors(this.activeCamera.position, movementVector);
            this.positionCamera(newPosition);
        }
    }

    public toggleOrthogonalCam(): void {
        this.isOrthoView = !this.isOrthoView;
    }

    public setCamera(isMoving: boolean, currentStoneOnIce: Stone, isOnIce: boolean): void {
        if (this.isOrthoView) {
            this.activeCamera = this.orthographicCamera;
            let cameraPosition;
            let cameraLookAt;
            let rotationAngle;
            if (isMoving) {
                cameraPosition = new THREE.Vector3(0, 470, ICE_LENGTH / 2);
                cameraLookAt = new THREE.Vector3(0, 0, ICE_LENGTH / 2);
                rotationAngle = -Math.PI / 2;
            }
            else {
                cameraPosition = new THREE.Vector3(0, 150, ICE_LENGTH - DISTANCE_HOUSE_END - 30);
                cameraLookAt = new THREE.Vector3(0, 0, ICE_LENGTH - DISTANCE_HOUSE_END - 30);
                rotationAngle = Math.PI;
            }
            this.positionCamera(cameraPosition);
            this.activeCamera.lookAt(cameraLookAt);
            this.activeCamera.rotateZ(rotationAngle);
        }
        else if (isOnIce) {
            this.activeCamera = this.perspectiveCamera;
            this.positionCamera(new THREE.Vector3(
                currentStoneOnIce.mesh.position.x,
                50,
                currentStoneOnIce.mesh.position.z - 100));
            this.activeCamera.lookAt(new THREE.Vector3(
                currentStoneOnIce.mesh.position.x,
                currentStoneOnIce.mesh.position.y + 10,
                currentStoneOnIce.mesh.position.z + 50)); //Vue Plonge
        }
        else {
            this.activeCamera = this.perspectiveCamera;
        }
    }

    public reset(): void {
        this.activeCamera = this.perspectiveCamera;
        this.positionCamera(new THREE.Vector3(0, 50, -100));
        this.activeCamera.up = new THREE.Vector3(0, 10, 0);
        this.activeCamera.lookAt(new THREE.Vector3(0, 0, 100));
        this.isOrthoView = false;
    }
}
