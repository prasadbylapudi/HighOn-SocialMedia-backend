const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    media: {
      type: String,
      default: "",
    },
    description: {
      type: String,
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    tags: [], 
    taggedUsers:[
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    mediaUrl: {
      type: String,
      default: "",
    }    
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

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
