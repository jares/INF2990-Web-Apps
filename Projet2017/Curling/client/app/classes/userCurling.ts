export class UserCurling {
  static username: string;
  static score: number;
  static computerScore: number;
  static normalAI: boolean;
  static page = 0;

  static delete() {
    UserCurling.username = null;
    UserCurling.score = null;
    UserCurling.computerScore = null;
    UserCurling.normalAI = null;
  }
}
