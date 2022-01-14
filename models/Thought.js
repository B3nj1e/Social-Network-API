const { Schema, Types } = require('mongoose');

const thoughtSchema = new Schema(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
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
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    reactions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Reaction',
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
