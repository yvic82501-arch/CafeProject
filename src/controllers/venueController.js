const Venues = require("../models/venuesModel");
const Queue = require("../models/queueModel");

const addVenue = async (req, res, next) => {
  try {
    const venues = await Venues.create(req.body);
    res.status(201).json({
      success: true,
      data: venues,
    });
  } catch (error) {
    next(error);
  }
};

const getVenue = async (req, res, next) => {
  try {
    const venues = await Venues.find().populate("queue");

    res.status(201).json({
      success: true,
      data: venues,
    });
  } catch (error) {
    next(error);
  }
};

const updateVenue = async (req, res, next) => {
  try {
    const venues = await Venues.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!venues) {
      return res.status(401).json({
        success: false,
        message: "Venue not found",
      });
    }

    res.json({
      success: true,
      data: venues,
    });
  } catch (error) {
    next(error);
  }
};

const deleteVenue = async (req, res, next) => {
  try {
    const venues = await Venues.findByIdAndDelete(req.params.id, req.body);
    if (!venues) {
      return res.status(401).json({
        success: false,
        message: "Venue not found",
      });
    }

    res.json({
      sucess: true,
      message: "Venue deleted succesfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addVenue,
  getVenue,

  updateVenue,
  deleteVenue,
};
