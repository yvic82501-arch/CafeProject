const Users = require("../models/userModel");
const Queue = require("../models/queueModel");
const Venues = require("../models/venuesModel");

const getUserHistory = async (req, res, next) => {
  try {
    const user = await Users.findById(req.user._id).select("history");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user.history,
    });
  } catch (error) {
    next(error);
  }
};

const dashboardStats = async (req, res, next) => {
  try {
    const users = await Users.countDocuments();
    const venues = await Venues.countDocuments();
    const queues = await Queue.countDocuments();

    const userList = await Users.find().select("history");

    let served = 0;

    userList.forEach((user) => {
      user.history.forEach((item) => {
        if (item.status === "served") {
          served++;
        }
      });
    });

    res.status(200).json({
      success: true,
      data: {
        users,
        venues,
        queues,
        served,
      },
    });
  } catch (error) {
    next(error);
  }
};

const averageWaitTime = async (req, res, next) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue not found",
      });
    }
    const waitingUsers = queue.queue.filter(
      (user) => user.status === "waiting",
    ).length;

    const averageWaitTime = waitingUsers * queue.averageServiceTime;

    res.status(200).json({
      success: true,
      data: {
        queueName: queue.name,
        averageWaitTime,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getPeakHour = async (req, res, next) => {
  try {
    const queueId = req.params.id;
    const users = await Users.find();
    let hours = {};
    users.forEach((user) => {
      user.history.forEach((item) => {
        if (
          item.queueId.toString() === queueId &&
          item.status === "served" &&
          item.servedAt
        ) {
          const hour = new Date(item.servedAt).getHours();
          hours[hour] = (hours[hour] || 0) + 1;
        }
      });
    });
    let peak = null;
    for (let hour in hours) {
      if (peak === null || hours[hour] > hours[peak]) {
        peak = hour;
      }
    }
    res.status(200).json({
      success: true,
      data: {
        peakHour: peak,
        users: peak ? hours[peak] : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserHistory,
  dashboardStats,
  averageWaitTime,
  getPeakHour,
};
