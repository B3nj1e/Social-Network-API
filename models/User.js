const { Schema, Types, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // validate: {
      //   validator: () => Promise.resolve(false),
      //   message: 'Email validation failed'
      // },
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

userSchema
.virtual('friendCount')
.get(function () {
  return this.friends.length;
})
.set(function () {
  const friendCount = this.friends.length;
  this.set({friendCount});
}
);

const User = model('User', userSchema);

module.exports = User;
