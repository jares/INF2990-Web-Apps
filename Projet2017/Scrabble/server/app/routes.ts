import * as express from 'express';
import UserScrabble from './userScrabble.model';
module Route {

  export class Index {

    public index(req: express.Request, res: express.Response, next: express.NextFunction) {
      res.send('Hello world');
    }

    public addUser(req: express.Request, res: express.Response, next: express.NextFunction){
      UserScrabble.findOne({name: req.body.user}).then(function(result){
        if (result === null){
          let newUser = new UserScrabble({name: req.body.user});
          newUser.save().then(() => {
            res.send(true);
          });
        }
        else{
          res.send(false);
        }
      });
    }
  }
}
export = Route;
