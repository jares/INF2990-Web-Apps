import * as mongoose from 'mongoose';

export interface UserCurling extends mongoose.Document {
  name: String;
}
export const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
});
export default mongoose.model<UserCurling>('UserCurling', userSchema);
