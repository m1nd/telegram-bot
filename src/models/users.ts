import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const User = new Schema({
  telegramId: { type: Number, required: true },
  backWidth: { type: Number, required: true },
  waistWidth: { type: Number, required: true },
  hipsWidth: { type: Number, required: true },
  height: { type: Number, required: true },
  scaleOfFat: { type: Number, required: true },
  sex: { type: String, required: true },
  isWaistVerySmall: { type: Boolean, required: false },
  appearance_type: { type: String, required: false },
  isFat: { type: Boolean, required: false },
  u: { type: String, required: false },
});

export default mongoose.model('User', User);
