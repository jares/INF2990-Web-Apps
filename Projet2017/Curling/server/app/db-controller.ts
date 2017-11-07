import * as mongoose from 'mongoose';
import UserCurling from './userCurling.model';
export class DbController {

    lbNormal: any;
    lbHard: any;
    user: any;
    isNewUser: boolean;

    constructor() {
        this.lbNormal = [];
        this.lbHard = [];
    }

    public saveData(model: mongoose.Document): Promise<mongoose.Document> {
        return model.save();
    }

    public findLeaderboard(isNormalDifficulty: boolean, model: mongoose.Model<any>): Promise<any> {

        let self = this;
        let promise = model.find({ normalAI: isNormalDifficulty }).sort(
            { userScore: -1, AIscore: 1, timestamp: 1 }).exec(function (err, docs) {
                isNormalDifficulty ? self.lbNormal = docs.splice(0, 3) : self.lbHard = docs.splice(0, 3);
            });
        return promise;
    }
    public findUser(name: string): Promise<any> {
        let self = this;
        let promise = UserCurling.findOne({ name: name }).exec(function (result) {
            self.user = result;
        });
        return promise;
    }

}


