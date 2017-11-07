import * as mongoose from 'mongoose';

export interface LeaderboardCurlingTest extends mongoose.Document {
  name: String;
  normalAI: Boolean;
  userScore: Number;
  AIscore: Number;
}
export const leaderBoardSchemaTest = new mongoose.Schema({
  name: { type: String, required: true },
  normalAI: { type: Boolean, required: true },
  userScore: { type: Number, required: true },
  AIscore: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }

});
export default mongoose.model<LeaderboardCurlingTest>('LeaderboardCurlingTest', leaderBoardSchemaTest);
