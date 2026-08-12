const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const historySchema = new mongoose.Schema({
  queueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Queue",
  },

  queueName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Queue",
  },

  tokenNumber: Number,

  status: {
    type: String,
    enum: ["waiting", "served", "skipped"],
  },

  servedAt: Date,
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      minLength: [5, "Atleast 5 characters required"],
      required: [true, "Password is required"],
    },

    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },

    history: [historySchema],
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPasword) {
  return await bcrypt.compare(enteredPasword, this.password);
};

module.exports = mongoose.model("Users", userSchema);
