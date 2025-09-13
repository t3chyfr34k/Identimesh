import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
)

UserSchema.methods.toSafeJSON = function () {
  const obj = this.toObject({ versionKey: false })
  delete obj.passwordHash
  return obj
}

const User = mongoose.models.User || mongoose.model('User', UserSchema)
export default User