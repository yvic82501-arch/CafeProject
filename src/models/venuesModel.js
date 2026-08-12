const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Venue name is required"],
    },
    location: {
      type: String,
      required: [true, "Venue location is required"],
    },
    queue: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Queue",
      },
    ],
  },
  { timestams: true },
);

module.exports = mongoose.model("Venues", venueSchema);
