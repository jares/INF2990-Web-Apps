import { Stone } from './stone';

//Toutes les distances ont été prises dans les reglements officiels de curling canada
const WHITE = 0xFFFFFF;
const BLACK = 0x000000;
const GREY = 0x969594;
const ORANGE = 0xFFA500;
const BLUE = 0x164CC1;
const RED_ICE = 0xBF3A55;
const DISTANCE_HOUSE_END = 160;
const DISTANCE_HOUSELINE_END = 100;
const DISTANCE_HOGLINE_END = 370;
const DISTANCE_HACK_END = 30;
const HOG_LINE_WIDTH = 3.33;
const LINE_WIDTH = 0.75;
const INNER_RING_SMALL_RADIUS = 7.5;
const INNER_RING_RADIUS = 20;
const OUTER_RING_SMALL_RADIUS = 40;
const OUTER_RING_RADIUS = 60;
const ICE_LENGTH = 1380;
const ICE_WIDTH = 140;
const ICE_HEIGHT = -3;
const SKYBOX_SIDE = 5000;
const BROOM_NOT_IN_PLAY = 1000;
const ICE_SPACING = 40;

const ICE_OPACITY = 0.75;
const SPONSOR_OPACITY = 0.5;

const LOGO_CENTER_OFFSET = 20;

const STONE_ON_SIDE_OFFSET = 75;
const STONE_START_Z = 75;

export class ObjectLoader {
    public dashedLine: THREE.Line;
    public video: any;
    public videoImageContext: any;
    public videoTexture: THREE.VideoTexture;

    private colLoader: THREE.ColladaLoader;
    private z: number;
    private y: number;
    private xRed: number;
    private xYellow: number;
    private stoneId: number;
    private scene: any;
    private videoImage: any;

    constructor(scene: any) {
        this.colLoader = new THREE.ColladaLoader();
        this.z = STONE_ON_SIDE_OFFSET;
        this.y = 0;
        this.xRed = STONE_ON_SIDE_OFFSET;
        this.xYellow = -STONE_ON_SIDE_OFFSET;
        this.stoneId = 0;
        this.scene = scene;
    }

    public loadScene(): void {
        this.createBroom(new THREE.Vector3(0, BROOM_NOT_IN_PLAY, 0));
        this.loadSkyBox();
        this.loadIce(- (ICE_WIDTH + ICE_SPACING));
        this.loadIce(0);
        this.loadIce(ICE_WIDTH + ICE_SPACING);
        this.createHack();
        this.addScreens();
        this.addLights();
    }

    public setStone(yellowStones: Stone[], redStones: Stone[], nStones: number): Promise<any> {
        return new Promise<any>((resolve, error) => {
            for (let i = 0; i < nStones; i++) {
                //TODO: get textures
                this.createStone(redStones, true).then((object) => this.scene.add(object));
                this.createStone(yellowStones, false).then((object) => this.scene.add(object));
            }
        });
    }

    public addDashedLine(direction: THREE.Vector3): void {
        if (this.dashedLine !== null) {
            this.scene.remove(this.dashedLine);
        }
        let orangeIce = new THREE.LineDashedMaterial();
        orangeIce.color.setHex(ORANGE);
        orangeIce.side = THREE.DoubleSide;
        orangeIce.dashSize = 4;
        orangeIce.gapSize = 2;
        orangeIce.linewidth = 6;
        let origin = new THREE.Vector3(0, 0, STONE_START_Z);
        let line = new THREE.Geometry();
        line.vertices.push(origin);
        line.vertices.push(direction);
        line.computeLineDistances();
        this.dashedLine = new THREE.Line(line, orangeIce);
        this.scene.add(this.dashedLine);
    }

    private createStone(stones: Stone[], isRed: boolean): Promise<any> {
        let path = isRed ? '../../assets/models/curling_stone_red.dae' : '../../assets/models/curling_stone_yellow.dae';
        let color = isRed ? "red" : "yellow";
        let x = isRed ? this.xRed : this.xYellow;
        return new Promise<any>((resolve, error) => {
            this.colLoader.load(path, (result) => {
                let s = result.scene as THREE.Object3D;
                s.position.set(x, this.y, this.z);
                if (!isRed){
                    s.rotateZ(Math.PI);
                }
                s.scale.set(1, 1, 1);
                for (let i = 0; i < 3; i++) {
                    (s.children[0].children[i] as THREE.Mesh).material.transparent = true;
                }
                let stone = new Stone((s as THREE.Mesh), color, this.stoneId++);
                stones.push(stone);
                resolve(s);
                this.z += 5;
            });
        });
    }

    private createBroom(position: THREE.Vector3): Promise<any> {
        return new Promise<any>((resolve, error) => {
            this.colLoader.load('../../assets/models/broom.dae', (result) => {
                let s = result.scene as THREE.Object3D;
                s.castShadow = true;
                s.position.set(position.x - 5, position.y, position.z);
                s.scale.set(1, 1, 1);
                (s as THREE.Mesh).name = "broom";
                resolve(s as THREE.Mesh);
                this.scene.add(s);
            });
        });
    }

    private addScreens(): void {
        this.video = document.createElement('video');
        this.video.src = "../../assets/videos/best_shots_2016.mp4";
        this.video.load();
        this.video.play();
        this.video.muted = true;
        this.video.loop = true;

        this.videoImage = document.createElement('canvas');
        this.videoImage.width = 950;
        this.videoImage.height = 1200;

        this.videoImageContext = this.videoImage.getContext('2d');
        this.videoImageContext.translate(110, 1200);
        this.videoImageContext.rotate(-Math.PI / 2);
        this.videoImageContext.fillStyle = BLACK;
        this.videoImageContext.fillRect(0, 0, this.videoImage.width, this.videoImage.height);

        this.videoTexture = new THREE.VideoTexture(this.videoImage);
        this.videoTexture.minFilter = THREE.LinearFilter;
        this.videoTexture.magFilter = THREE.LinearFilter;

        let screenGeometry = new THREE.PlaneGeometry(ICE_WIDTH, ICE_WIDTH * (16 / 9) - 50);
        let screenMaterial = new THREE.MeshBasicMaterial({
            map: this.videoTexture, overdraw: 1,
            side: THREE.DoubleSide
        });
        this.createScreens(screenGeometry, screenMaterial, false);
        this.createScreens(screenGeometry, screenMaterial, true);

    }

    private createScreens(screenGeometry: THREE.PlaneGeometry, screenMaterial: THREE.MeshBasicMaterial,
        isRight: boolean): void {
        let screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.rotateY(Math.PI);
        screen.rotateZ(-Math.PI / 2);
        let screenPositionX = isRight ? -180 : 180;
        screen.position.set(screenPositionX, 125, ICE_LENGTH - DISTANCE_HOUSE_END + 1000);
        this.scene.add(screen);
    }

    private createHack(): void {
        this.colLoader.load('../../assets/models/hack.dae', (result) => {
            let s = result.scene as THREE.Object3D;
            s.rotateZ(Math.PI);
            s.position.set(this.xYellow, this.y, this.z);
            s.scale.set(1, 1, 1);
            s.position.set(0, 0, DISTANCE_HACK_END);
            s.rotateZ(Math.PI / 2);
            ((s.children[0] as THREE.Mesh).material as THREE.MeshPhongMaterial).reflectivity = 100;
            this.scene.add(s);
        });
    }

    private addLights(): void {
        let light = new THREE.AmbientLight(WHITE);
        light.position.set(0, 100, 100);
        this.scene.add(light);
        //right spotlight on stones
        this.addSpotlight(new THREE.Vector3(-85, 60, 110));
        //left spotlight on stones
        this.addSpotlight(new THREE.Vector3(85, 60, 110));
        //centered spots
        for (let i = 0; i < 13; i++) {
            this.addSpotlight(new THREE.Vector3(0, 60, 100 + i * 100));
        }
    }

    private addSpotlight(position: THREE.Vector3): void {
        let spotlight = new THREE.SpotLight(WHITE, 1, 100, 1, 0.5, 1);
        spotlight.castShadow = true;
        spotlight.position.set(position.x, position.y, position.z);
        let targ = new THREE.Object3D();
        targ.position.set(0, 0, position.z);
        this.scene.add(targ);
        spotlight.target = targ;
        // scene.add(new THREE.SpotLightHelper(spotlight));
        this.scene.add(spotlight);
    }

    private loadSkyBox(): void {
        // Load the skybox images and create list of materials
        let materials = [
            this.createMaterial('../../assets/skybox/frozenrt.jpg'), // right
            this.createMaterial('../../assets/skybox/frozenlt.jpg'), // left
            this.createMaterial('../../assets/skybox/frozenup.jpg'), // top
            this.createMaterial('../../assets/skybox/frozendn.jpg'), // bottom
            this.createMaterial('../../assets/skybox/frozenbk.jpg'), // back
            this.createMaterial('../../assets/skybox/frozenft.jpg')  // front
        ];
        // Create a large cube
        let mesh = new THREE.Mesh(new THREE.BoxGeometry(SKYBOX_SIDE, SKYBOX_SIDE, SKYBOX_SIDE),
            new THREE.MultiMaterial(materials));
        //turn the cube inside out
        mesh.scale.set(-1, 1, 1);
        mesh.name = "skybox";
        this.scene.add(mesh);
    }

    private createMaterial(path: string): THREE.MeshBasicMaterial {
        let texture = new THREE.TextureLoader().load(path);
        let material = new THREE.MeshBasicMaterial({ map: texture });
        return material;
    }

    private createIceImageMaterial(path: string): THREE.MeshPhongMaterial {
        let texture = new THREE.TextureLoader().load(path);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        let material = new THREE.MeshPhongMaterial({ map: texture, reflectivity: 10, shininess: 0.5 });
        return material;
    }
    private createIceMaterial(color: number): THREE.MeshPhongMaterial {
        let ice = new THREE.MeshPhongMaterial();
        ice.color.setHex(color);
        ice.transparent = true;
        ice.opacity = ICE_OPACITY;
        ice.shininess = 100;
        return ice;
    }

    private createSponsorMaterial(path: string): THREE.MeshPhongMaterial {
        let logo = this.createIceImageMaterial(path);
        logo.transparent = true;
        logo.opacity = SPONSOR_OPACITY;
        return logo;
    }

    private createSponsorLineMaterial(path: string, repeat: number): THREE.MeshPhongMaterial {
        let lineLogo = this.createSponsorMaterial(path);
        lineLogo.map.repeat = new THREE.Vector2(repeat, 1); //repeter le logo x fois sur la largeur de la glace
        return lineLogo;
    }

    private addSponsors(offsetX: number, isFar: boolean, isRight: boolean): void {
        let logoPoly = this.createSponsorMaterial('../../assets/images/polytechnique.png');
        let polyHeight = ICE_WIDTH / 2 * (558 / 1174); //ratio des dimensions de l'image source
        let polyMTLSponsor = new THREE.Mesh(new THREE.PlaneGeometry(ICE_WIDTH / 2, polyHeight), logoPoly);
        polyMTLSponsor.rotateX(-Math.PI / 2);
        if (isRight) {
            polyMTLSponsor.rotateZ(-Math.PI);
        }
        let polyPositionZ = isFar ? (ICE_LENGTH - DISTANCE_HOGLINE_END + polyHeight / 2 + LINE_WIDTH)
                                    : (DISTANCE_HOGLINE_END - polyHeight / 2 - LINE_WIDTH);
        let polyPositionX = isRight ? (offsetX - ICE_WIDTH / 4) : (offsetX + ICE_WIDTH / 4);
        polyMTLSponsor.position.set(
            polyPositionX,
            ICE_HEIGHT - 0.02,
            polyPositionZ);
        this.scene.add(polyMTLSponsor);

        let curlingCanadaLogo = this.createIceImageMaterial('../../assets/images/curling_canada_logo.png');
        let curlCanHeight = ICE_WIDTH / 3 * (734 / 474); //ratio des dimensions de l'image source
        curlingCanadaLogo.transparent = true;
        curlingCanadaLogo.opacity = SPONSOR_OPACITY;
        let curlingCanada = new THREE.Mesh(
            new THREE.PlaneGeometry(ICE_WIDTH / 2, curlCanHeight), curlingCanadaLogo);
        curlingCanada.rotateX(-Math.PI / 2);
        let positionZ = isFar ? (ICE_LENGTH / 2 + ICE_WIDTH / 4 + LOGO_CENTER_OFFSET)
                                : (ICE_LENGTH / 2 - ICE_WIDTH / 4 - LOGO_CENTER_OFFSET);
        if (!isFar) {
            curlingCanada.rotateZ(Math.PI);
        }
        curlingCanada.position.set(offsetX,
            ICE_HEIGHT - 0.02,
            positionZ);
        this.scene.add(curlingCanada);

        let ceglLogo = this.createIceImageMaterial('../../assets/images/cegl.png');
        ceglLogo.transparent = true;
        ceglLogo.opacity = SPONSOR_OPACITY;
        let ceglButton = new THREE.Mesh(
            new THREE.PlaneGeometry(
                INNER_RING_SMALL_RADIUS * 2 - 6,
                (INNER_RING_SMALL_RADIUS * 2 - 6) * (564 / 420)), ceglLogo); //ratio des dimensions de l'image source
        ceglButton.rotateX(-Math.PI / 2);
        if (isFar) {
            ceglButton.rotateZ(Math.PI);
        }
        let ceglPositionZ = isFar ? (ICE_LENGTH - DISTANCE_HOUSE_END - 0.5) : (DISTANCE_HOUSE_END + 0.5);
        ceglButton.position.set(offsetX, ICE_HEIGHT - 0.02, ceglPositionZ);
        this.scene.add(ceglButton);
    }

    private addRing(innerRadius: number, outerRadius: number,
        material: THREE.MeshPhongMaterial, position: THREE.Vector3): void {
        let ring = new THREE.Mesh(new THREE.RingGeometry(
            innerRadius, outerRadius, 50, 1, 0, Math.PI * 2), material);
        ring.rotateX(-Math.PI / 2);
        ring.position.set(position.x, position.y, position.z);
        this.scene.add(ring);
    }

    private loadIce(offsetX: number): void {
        let ice = new THREE.Mesh(new THREE.PlaneGeometry(ICE_WIDTH, ICE_LENGTH),
            this.createIceImageMaterial('../../assets/images/glace.jpg'));
        ice.rotateX(-Math.PI / 2);
        ice.position.set(offsetX, ICE_HEIGHT - 0.1, ICE_LENGTH / 2);
        this.scene.add(ice);
        let redIce = this.createIceMaterial(RED_ICE);
        let blueIce = this.createIceMaterial(BLUE);
        blueIce.polygonOffset = true;
        blueIce.polygonOffsetFactor = -0.1;

        let ringsClosePosition = new THREE.Vector3(offsetX, ICE_HEIGHT - 0.05, DISTANCE_HOUSE_END);
        let ringsFarPosition = new THREE.Vector3(offsetX, ICE_HEIGHT - 0.05, ICE_LENGTH - DISTANCE_HOUSE_END);

        //inner ring close
        this.addRing(INNER_RING_SMALL_RADIUS, INNER_RING_RADIUS, redIce, ringsClosePosition);
        //outer ring close
        this.addRing(OUTER_RING_SMALL_RADIUS, OUTER_RING_RADIUS, blueIce, ringsClosePosition);
        //inner Ring Far
        this.addRing(INNER_RING_SMALL_RADIUS, INNER_RING_RADIUS, redIce, ringsFarPosition);
        //outer ring far
        this.addRing(OUTER_RING_SMALL_RADIUS, OUTER_RING_RADIUS, blueIce, ringsFarPosition);

        this.loadLines(offsetX, false);
        this.loadLines(offsetX, true);
        this.addSponsors(offsetX, false, false);
        this.addSponsors(offsetX, false, true);
        this.addSponsors(offsetX, true, false);
        this.addSponsors(offsetX, true, true);
    }

    private loadLines(offsetX: number, isFar: boolean): void {
        let colgateLogo = this.createSponsorLineMaterial('../../assets/images/colgate_logo.png', 3);
        let redLine = new THREE.Mesh(new THREE.PlaneGeometry(ICE_WIDTH, 5), colgateLogo);
        redLine.rotateX(-Math.PI / 2);
        if (isFar) {
            redLine.rotateZ(Math.PI);
        }
        let redLinePositionZ = isFar ? (ICE_LENGTH - DISTANCE_HOUSELINE_END) : (DISTANCE_HOUSELINE_END);
        redLine.position.set(offsetX, ICE_HEIGHT - 0.075, redLinePositionZ);
        this.scene.add(redLine);

        let oralBLogo = this.createSponsorLineMaterial('../../assets/images/Oral_B_logo.png', 4);
        let blueLine = new THREE.Mesh(new THREE.PlaneGeometry(ICE_WIDTH, HOG_LINE_WIDTH), oralBLogo);
        blueLine.rotateX(-Math.PI / 2);
        if (!isFar) {
            blueLine.rotateZ(Math.PI);
        }
        let blueLinePositionZ = isFar ? (ICE_LENGTH - DISTANCE_HOGLINE_END) : (DISTANCE_HOGLINE_END);
        blueLine.position.set(offsetX, ICE_HEIGHT, blueLinePositionZ);
        this.scene.add(blueLine);

        let lineMaterial = this.createIceMaterial(GREY);
        let middleLine = new THREE.Mesh(new THREE.PlaneGeometry(LINE_WIDTH, ICE_LENGTH), lineMaterial);
        middleLine.rotateX(-Math.PI / 2);
        middleLine.position.set(offsetX, ICE_HEIGHT, ICE_LENGTH / 2);
        this.scene.add(middleLine);

        let middleRingLine = new THREE.Mesh(new THREE.PlaneGeometry(LINE_WIDTH, ICE_WIDTH), lineMaterial);
        middleRingLine.rotateX(-Math.PI / 2);
        middleRingLine.rotateZ(Math.PI / 2);
        let middleRingLinePositionZ = isFar ? (ICE_LENGTH - DISTANCE_HOUSE_END) : (DISTANCE_HOUSE_END);
        middleRingLine.position.set(offsetX, ICE_HEIGHT, middleRingLinePositionZ);
        this.scene.add(middleRingLine);
    }
}
