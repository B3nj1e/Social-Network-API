const { Schema, Types, model } = require('mongoose');
const reactionSchema = require ('./Reaction');

// Schema to create a thought model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      maxlength: 280,
      minlength: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: [
      {
        type: String,
        ref: 'User',
      },
    ],
    userId: [
      {
      type: Schema.Types.ObjectId,
      ref: 'User',
      }
    ],
    reactions: 
    [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

thoughtSchema
.virtual('reactionCount')
.get(function () {
  return this.reactions.length;
})
.set(function () {
  const reactionCount = this.reactions.length;
  this.set({reactionCount});
})

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
