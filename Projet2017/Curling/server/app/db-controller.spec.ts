import { DbController } from './db-controller';
import * as mongoose from 'mongoose';
import { expect } from 'chai';
import LeaderBoardCurlingTest from './leaderboardCurlingTest.model';
(<any>mongoose).Promise = global.Promise;

describe('Tests pour leaderboard', () => {

    let dbController = new DbController();
    before((done) => {
        mongoose.connect('mongodb://alvux:alvux@ds149059.mlab.com:49059/equipe12-db');
        done();
    });


    beforeEach((done) => {
        mongoose.connection.collection("leaderboardcurlingtests").drop(() => {
            done();
        }
        );
    });

    it('le nouveau score est placé en dessous de l\' ancien score. (Normal)', (done) => {
        let newScore = new LeaderBoardCurlingTest(
            {
                name: "Tim", normalAI: true,
                userScore: 3, AIscore: 1
            });
        let newScore1 = new LeaderBoardCurlingTest(
            {
                name: "Lamar", normalAI: true,
                userScore: 3, AIscore: 1
            });
        let newScore2 = new LeaderBoardCurlingTest(
            {
                name: "Sean", normalAI: true,
                userScore: 3, AIscore: 1
            });

        let result: any = [];
        result.push(newScore);
        result.push(newScore1);
        result.push(newScore2);
        dbController.saveData(newScore).then(() => {
            dbController.saveData(newScore1).then(() => {
                dbController.saveData(newScore2).then(() => {
                    dbController.findLeaderboard(true, LeaderBoardCurlingTest).then(() => {
                        expect(newScore._id).to.deep.equals(dbController.lbNormal[0]._id);
                        expect(newScore1._id).to.deep.equals(dbController.lbNormal[1]._id);
                        expect(newScore2._id).to.deep.equals(dbController.lbNormal[2]._id);
                        done();
                    });
                });

            });
        });
    });

    it('le nouveau score est placé en dessous de l\' ancien score. (Difficile)', (done) => {
        let newScore = new LeaderBoardCurlingTest(
            {
                name: "Tim", normalAI: false,
                userScore: 3, AIscore: 1
            });
        let newScore1 = new LeaderBoardCurlingTest(
            {
                name: "Lamar", normalAI: false,
                userScore: 3, AIscore: 1
            });
        let newScore2 = new LeaderBoardCurlingTest(
            {
                name: "Sean", normalAI: false,
                userScore: 3, AIscore: 1
            });

        let result: any = [];
        result.push(newScore);
        result.push(newScore1);
        result.push(newScore2);
        dbController.saveData(newScore).then(() => {
            dbController.saveData(newScore1).then(() => {
                dbController.saveData(newScore2).then(() => {
                    dbController.findLeaderboard(false, LeaderBoardCurlingTest).then(() => {
                        expect(newScore._id).to.deep.equals(dbController.lbHard[0]._id);
                        expect(newScore1._id).to.deep.equals(dbController.lbHard[1]._id);
                        expect(newScore2._id).to.deep.equals(dbController.lbHard[2]._id);
                        done();
                    });
                });

            });
        });
    });

    it('le score dont le perdant a eu le moins de points est placé le plus haut dans le tableau (Normal)', (done) => {
        let newScore = new LeaderBoardCurlingTest(
            {
                name: "Tim", normalAI: true,
                userScore: 3, AIscore: 2
            });
        let newScore1 = new LeaderBoardCurlingTest(
            {
                name: "Lamar", normalAI: true,
                userScore: 3, AIscore: 1
            });
        let newScore2 = new LeaderBoardCurlingTest(
            {
                name: "Sean", normalAI: true,
                userScore: 3, AIscore: 0
            });

        let result: any = [];
        result.push(newScore);
        result.push(newScore1);
        result.push(newScore2);
        dbController.saveData(newScore).then(() => {
            dbController.saveData(newScore1).then(() => {
                dbController.saveData(newScore2).then(() => {
                    dbController.findLeaderboard(true, LeaderBoardCurlingTest).then(() => {
                        expect(newScore._id).to.deep.equals(dbController.lbNormal[2]._id);
                        expect(newScore1._id).to.deep.equals(dbController.lbNormal[1]._id);
                        expect(newScore2._id).to.deep.equals(dbController.lbNormal[0]._id);
                        done();
                    });
                });

            });
        });
    });


    it('le score dont le perdant a eu le moins de points est placé le plus haut dans le tableau (Difficle)', (done) => {
        let newScore = new LeaderBoardCurlingTest(
            {
                name: "Tim", normalAI: false,
                userScore: 3, AIscore: 2
            });
        let newScore1 = new LeaderBoardCurlingTest(
            {
                name: "Lamar", normalAI: false,
                userScore: 3, AIscore: 1
            });
        let newScore2 = new LeaderBoardCurlingTest(
            {
                name: "Sean", normalAI: false,
                userScore: 3, AIscore: 0
            });

        let result: any = [];
        result.push(newScore);
        result.push(newScore1);
        result.push(newScore2);
        dbController.saveData(newScore).then(() => {
            dbController.saveData(newScore1).then(() => {
                dbController.saveData(newScore2).then(() => {
                    dbController.findLeaderboard(false, LeaderBoardCurlingTest).then(() => {
                        expect(newScore._id).to.deep.equals(dbController.lbHard[2]._id);
                        expect(newScore1._id).to.deep.equals(dbController.lbHard[1]._id);
                        expect(newScore2._id).to.deep.equals(dbController.lbHard[0]._id);
                        done();
                    });
                });

            });
        });
    });

    it('le score avec le plus de point victorieux est place en premier. (Normal)', (done) => {
        let newScore = new LeaderBoardCurlingTest(
            {
                name: "Tim", normalAI: true,
                userScore: 4, AIscore: 2
            });
        let newScore1 = new LeaderBoardCurlingTest(
            {
                name: "Lamar", normalAI: true,
                userScore: 3, AIscore: 1
            });
        let newScore2 = new LeaderBoardCurlingTest(
            {
                name: "Sean", normalAI: true,
                userScore: 2, AIscore: 1
            });

        let result: any = [];
        result.push(newScore);
        result.push(newScore1);
        result.push(newScore2);
        dbController.saveData(newScore).then(() => {
            dbController.saveData(newScore1).then(() => {
                dbController.saveData(newScore2).then(() => {
                    dbController.findLeaderboard(true, LeaderBoardCurlingTest).then(() => {
                        expect(newScore._id).to.deep.equals(dbController.lbNormal[0]._id);
                        expect(newScore1._id).to.deep.equals(dbController.lbNormal[1]._id);
                        expect(newScore2._id).to.deep.equals(dbController.lbNormal[2]._id);
                        done();
                    });
                });

            });
        });
    });

    it('le score avec le plus de point victorieux est place en premier. (Difficile)', (done) => {
        let newScore = new LeaderBoardCurlingTest(
            {
                name: "Tim", normalAI: false,
                userScore: 4, AIscore: 2
            });
        let newScore1 = new LeaderBoardCurlingTest(
            {
                name: "Lamar", normalAI: false,
                userScore: 3, AIscore: 1
            });
        let newScore2 = new LeaderBoardCurlingTest(
            {
                name: "Sean", normalAI: false,
                userScore: 2, AIscore: 0
            });

        let result: any = [];
        result.push(newScore);
        result.push(newScore1);
        result.push(newScore2);
        dbController.saveData(newScore).then(() => {
            dbController.saveData(newScore1).then(() => {
                dbController.saveData(newScore2).then(() => {
                    dbController.findLeaderboard(false, LeaderBoardCurlingTest).then(() => {
                        expect(newScore._id).to.deep.equals(dbController.lbHard[0]._id);
                        expect(newScore1._id).to.deep.equals(dbController.lbHard[1]._id);
                        expect(newScore2._id).to.deep.equals(dbController.lbHard[2]._id);
                        done();
                    });
                });

            });
        });
    });
});
