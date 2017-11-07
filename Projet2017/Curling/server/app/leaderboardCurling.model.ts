import * as mongoose from 'mongoose';

export interface LeaderboardCurling extends mongoose.Document {
  name: String;
  normalAI: Boolean;
  userScore: Number;
  AIscore: Number;
}
export const leaderBoardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  normalAI: { type: Boolean, required: true },
  userScore: { type: Number, required: true },
  AIscore: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }

});
export default mongoose.model<LeaderboardCurling>('LeaderboardCurling', leaderBoardSchema);
