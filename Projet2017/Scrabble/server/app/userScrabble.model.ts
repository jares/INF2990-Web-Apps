import * as mongoose from 'mongoose';

export interface UserScrabble extends mongoose.Document {
  name: String;
  numberOpponents: Number;
}
export const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  numberOpponents: { type: Number, requires: true }
});
export default mongoose.model<UserScrabble>('UserScrabble', userSchema);
