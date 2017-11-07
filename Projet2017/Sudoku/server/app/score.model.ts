import * as mongoose from 'mongoose';

export interface Score extends mongoose.Document {
  name: String;
  difficulty: String;
  sec: Number;
  time: string;
}
export const ScoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  difficulty: { type: String, required: true },
  sec: { type: Number, required: true },
  time: { type: String, required: true }
});
export default mongoose.model<Score>('leaderBoardSudoku', ScoreSchema);
