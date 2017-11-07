import * as mongoose from 'mongoose';

export interface UserSudoku extends mongoose.Document {
  name: String;
  difficulty: String;
  time: Number;
}
export const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  difficulty: { type: String, required: false },
  time: { type: Number, required: false }
});
export default mongoose.model<UserSudoku>('usersudoku', userSchema);
