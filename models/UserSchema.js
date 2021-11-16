const {model, Schema} = require("mongoose");

const UserSchema = new Schema({

  id: {
    type: Number,
    required: true,
    unique: true,
    default: 0,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  entries: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    required: true,
    default: () => new Date(),
},
});

const User = model("User", UserSchema);

module.exports = User;