import { Stone } from './stone';

//Toutes les distances ont été prises dans les reglements officiels de curling canada

const DISTANCE_HOUSELINE_END = 100;
const DISTANCE_HOGLINE_END = 370;
const ICE_LENGTH = 1380;
const ICE_WIDTH = 140;
const LINE_WIDTH = 0.75;

export class Offside {
    public fadeoutPromise(movingStone: Stone): Promise<any> {
        let self = this;
        let promise = new Promise(function (resolve, reject) {
            self.fadeout(movingStone, resolve);
        });
        return promise;
    }

    public fadeout(movingStone: Stone, resolve: any): void {
        let counter = 0;
        let timer = setInterval(function () {
            if (counter === 6) {
                clearInterval(timer);
                resolve(true); //Promise
            }
            for (let i = 0; i < 3; i++) {
                (movingStone.mesh.children[0].children[i] as THREE.Mesh).material.opacity
                    = (movingStone.mesh.children[0].children[i] as THREE.Mesh).material.opacity - 0.2;
            }
            counter++;
        }, 200);
    }

    public verifyHogLine(zPos: number, radius: number): boolean {
        return zPos + radius < ICE_LENGTH - DISTANCE_HOGLINE_END;
    }

    public verifyBackLine(zPos: number, radius: number): boolean {
        return zPos - radius > ICE_LENGTH - DISTANCE_HOUSELINE_END + LINE_WIDTH / 2;
    }

    public verifySide(xPos: number, radius: number): boolean {
        return xPos + radius > ICE_WIDTH / 2 || xPos - radius < - ICE_WIDTH / 2;
    }

    public offsideMoving(movingStone: Stone): boolean {
        return this.verifySide(movingStone.mesh.position.x, movingStone.radius)
            || this.verifyBackLine(movingStone.mesh.position.z, movingStone.radius);
    }
}
