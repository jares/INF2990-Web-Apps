import * as express from 'express';
import UserSudoku from './user.model';
import { Communicator } from './communicator';



module Route {


  export class Index {

    public index(req: express.Request, res: express.Response, next: express.NextFunction) {
      res.send('Hello world');
    }

    public addUser(req: express.Request, res: express.Response, next: express.NextFunction) {

      UserSudoku.findOne({ name: req.body.user }).then(function (result) {

        if (result !== null && result.name === req.body.user) {
          res.send(false);
        }

        else {
          let newUser = new UserSudoku({ name: req.body.user });
          newUser.save().then(() => {
            res.send(true);
          });
        }

      });

    }


  }
}

export = Route;
