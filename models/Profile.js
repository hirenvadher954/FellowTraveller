const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "user",
  },
  location: {
    type: String,
    required: true,
  },
  gender: {
    type: Boolean,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: false,
    trim: true,
  },
  education: [
    {
      school: {
        type: String,
        required: true,
      },
      college: {
        type: String,
        required: false,
      },
    },
  ],
  interestedPlaces: [],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("profile", ProfileSchema);
