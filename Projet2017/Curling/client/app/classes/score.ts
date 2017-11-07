import { UserCurling } from '../classes/userCurling';
import { Stone } from './stone';

//Toutes les distances ont été prises dans les reglements officiels de curling canada
const INNER_RED_FAR_Z = 1380 - 160;
const INNER_RED_FAR_X = 0;
const OUTER_RADIUS_BLUE = 60;

export class Score {
    private stonesInHouse: any[];

    constructor() {
        this.stonesInHouse = [];
    }

    public getStonesInHouse(stonesOnIce: Stone[]): { stoneOnIce: Stone, dist: number, color: string }[] {
        let stonesInHouse = [];
        for (let stoneOnIce of stonesOnIce) {
            let button = new THREE.Vector3(INNER_RED_FAR_X, 0, INNER_RED_FAR_Z);
            let distFromButton = button.distanceTo(stoneOnIce.getPosition());
            if (distFromButton < OUTER_RADIUS_BLUE + stoneOnIce.getRadius()) {
                stonesInHouse.push({ stoneOnIce: stoneOnIce, dist: distFromButton, color: stoneOnIce.color });
            }
        }
        return stonesInHouse;
    }

    public getScoringStones(stonesOnIce: Stone[]): any {
        this.stonesInHouse = this.getStonesInHouse(stonesOnIce);
        this.stonesInHouse.sort(function (a: any, b: any) {
            return a.dist - b.dist; //ordre croissant
        });
        if (this.stonesInHouse.length !== 0) {
            let stones = [];
            let nearestStoneColor = this.stonesInHouse[0].color; //Pierre la plus proche
            for (let stone of this.stonesInHouse) {
                if (stone.color === nearestStoneColor) {
                    stones.push(stone);
                }
                else {
                    break;
                }
            }
            return stones;
        }
        else {
            return null;
        }
    }

    public updateGame(stonesOnIce: Stone[]): boolean {
        let winnerStones = this.getScoringStones(stonesOnIce);
        if (winnerStones === null) {
            return null;
        }
        if (winnerStones[0].color === "yellow") {
            UserCurling.computerScore += winnerStones.length;
            return true;
        }
        else if (winnerStones[0].color === "red") {
            UserCurling.score += winnerStones.length;
            return false;
        }
    }
}
