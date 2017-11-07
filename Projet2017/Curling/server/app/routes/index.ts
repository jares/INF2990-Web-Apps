import * as express from 'express';
import UserCurling from '../userCurling.model';
import LeaderBoardCurling from '../leaderboardCurling.model';
import { DbController } from '../db-controller';

//import { Userbase } from '../userbase';

module Route {

  let dbController = new DbController();
  export class Index {

    public addUser(req: express.Request, res: express.Response, next: express.NextFunction) {
      let username = req.body.user ;
      dbController.findUser(username).then(function () {

        if (dbController.user === null || dbController.user === undefined) {
          let newUser = new UserCurling({ name: username });
          dbController.saveData(newUser).then(() => {
            res.send(true);
          });
        }
        else {
          res.send(false);
        }
      });
    }

    public getScore(req: express.Request, res: express.Response, next: express.NextFunction) {

      let normalAi = true;
      dbController.findLeaderboard(normalAi, LeaderBoardCurling).then(() => {
        dbController.findLeaderboard(!normalAi, LeaderBoardCurling).then(() => {
          let data = { lbNormal: dbController.lbNormal, lbHard: dbController.lbHard };
          res.send(data);
        });
      });


    }
    public addScore(req: express.Request, res: express.Response, next: express.NextFunction) {

      let newScore = new LeaderBoardCurling(
        {
          name: req.body.score.name, normalAI: req.body.score.normalAI,
          userScore: req.body.score.userScore, AIscore: req.body.score.AIscore
        });
      let normalAi = true;

      dbController.saveData(newScore).then(() => {
        dbController.findLeaderboard(normalAi, LeaderBoardCurling).then(() => {
          dbController.findLeaderboard(!normalAi, LeaderBoardCurling).then(() => {
            let data = { lbNormal: dbController.lbNormal, lbHard: dbController.lbHard };
            res.send(data);

          });
        });
      });
    }
  }

}
export = Route;
