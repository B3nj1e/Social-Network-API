const { User, Thought } = require('../models');

// Aggregate function to get the number of user overall
const friendCount = async () =>
  User.aggregate()
    .count('friendCount')
    .then((numberofFriends) => numberofFriends);

// // Aggregate function for getting the overall grade using $avg
// const grade = async (studentId) =>
//   Student.aggregate([
//     {
//       $unwind: '$assignments',
//     },
//     {
//       $group: { _id: studentId, overallGrade: { $avg: '$assignments.score' } },
//     },
//   ]);

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then(async (users) => {
        const userObj = {
          users,
          friendCount: await friendCount(),
        };
        return res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: 'No student with that ID' })
          : res.json({
              user
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a user
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : User.deleteMany({ _id: req.params.userId  })
      )
      .then(() => res.json({ message: 'User deleted!' }))
      .catch((err) => res.status(500).json(err));
  },

  // update a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },


// addiding friend
addFriend(req, res) {
  User.findOneAndUpdate({ _id: req.params.userId },
    { friends: req.params.friendId },
    { runValidators: true, new: true })
    .then((user) => res.json(user))
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
},

deleteFriend(req, res) {
  User.find({ _id: req.params.userId })
  .then((friends) =>
  !friends
    ? res.status(404).json({ message: 'No friends with that ID' })
    : friends.remove({ friends: req.params.friendId })
)
.then(() => res.json({ message: 'friend deleted!' }))
.catch((err) => res.status(500).json(err));
},

}