const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    email: { type: String, lowercase: true, trim: true },
    password: { type: String, default: "" },
    userName: { type: String },
  },
  {
    minimize: false,
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);


const User =  mongoose.model("User", UserSchema);
module.exports = User
