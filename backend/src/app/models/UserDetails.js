const mongoose = require("mongoose");

const UserDetailSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mobile: {
      type: String,
      required: false,
      default: null,
    },
    profile_image: {
      type: String,
      required: false,
      default: null,
    },
    adress: {
      type: String,
      required: false,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const UserDetails = mongoose.model("UserDetails", UserDetailSchema);
module.exports = UserDetails;
