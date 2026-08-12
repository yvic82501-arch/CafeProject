const Queue = require("../models/queueModel");
const Venues = require("../models/venuesModel");
const Users = require("../models/userModel");

const createQueue = async (req, res, next) => {
  try {
    const { name, venueId, averageServiceTime } = req.body;
    if (!name || !venueId) {
      return res.status(400).json({
        success: false,
        message: "Name and venueId required,",
      });
    }

    const venue = await Venues.findById(venueId);
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    const queue = await Queue.create({
      name,
      venueId,
      averageServiceTime,
    });

    venue.queue.push(queue._id);
    await venue.save();

    res.status(201).json({
      success: true,
      message: "Queue created succesfully",
      data: queue,
    });
  } catch (error) {
    next(error);
  }
};

const getQueueByVenue = async (req, res, next) => {
  try {
    const queue = await Queue.find({ venueId: req.params.venueId });

    res.status(200).json({
      success: true,
      count: queue.length,
      data: queue,
    });
  } catch (error) {
    next(error);
  }
};

const getQueueById = async (req, res, next) => {
  try {
    console.log("ID:", req.params.id);
    const queue = await Queue.findById(req.params.id);
    console.log("QUEUE:", queue);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue not found",
      });
    }

    res.status(200).json({
      success: true,
      data: queue,
    });
  } catch (error) {
    next(error);
  }
};

const updateQueue = async (req, res, next) => {
  try {
    const queue = await Queue.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue not found",
      });
    }

    res.json({
      success: true,
      data: queue,
    });
  } catch (error) {
    next(error);
  }
};

const deleteQueue = async (req, res, next) => {
  try {
    const queue = await Queue.findByIdAndDelete(req.params.id);
    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue not found",
      });
    }
    res.json({
      success: true,
      message: "Queue deleted succesfully",
    });
  } catch (error) {
    next(error);
  }
};

const joinQueue = async (req, res, next) => {
  try {
    const queueId = req.params.id;
    const userId = req.user._id;

    const queue = await Queue.findById(queueId);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue not found",
      });
    }

    if (!queue.isActive) {
      return res.status(400).json({
        success: false,
        message: "Queue not active",
      });
    }

    queue.lastTokenNumber++;
    const tokenNumber = queue.lastTokenNumber;

    const queueUser = {
      userId,
      tokenNumber,
      joinedAt: new Date(),
      status: "waiting",
      notified: false,
    };

    queue.queue.push(queueUser);

    await queue.save();

    const waitingUsers = queue.queue.filter((q) => q.status === "waiting");

    const position = waitingUsers.length;

    const eta = position * queue.averageServiceTime;

    const user = await Users.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    user.history.push({
      queueId: queue._id,
      tokenNumber,
      status: "waiting",
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "You have joined QUEUE successfully",
      data: { position, tokenNumber, eta },
    });
  } catch (error) {
    next(error);
  }
};

const queueStatus = async (req, res, next) => {
  try {
    const queueId = req.params.id;
    const userId = req.user._id;

    const queue = await Queue.findById(queueId);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue not found",
      });
    }

    const currentUser = queue.queue.findLast(
      (q) => q.userId.toString() === userId.toString(),
    );

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "You have not joined the queue",
      });
    }

    const waitingUsers = queue.queue.filter((q) => q.status === "waiting");

    const position = waitingUsers.length;

    const eta = position * queue.averageServiceTime;

    const notify = position <= 3 && position > 0;

    return res.status(200).json({
      success: true,
      data: {
        queueId: queue._id,
        queueName: queue.name,
        tokenNumber: currentUser.tokenNumber,
        position,
        eta,
        status: currentUser.status,
        queueLength: waitingUsers.length,
        nowServing: queue.nowServing,
        averageServiceTime: queue.averageServiceTime,
        isActive: queue.isActive,
        notify,
        message: position <= 3 && position > 0 ? "Your turn is coming" : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

const leaveQueue = async (req, res, next) => {
  try {
    const queueId = req.params.id;
    const userId = req.user._id;

    const queue = await Queue.findById(queueId);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue not found",
      });
    }

    const currentUser = queue.queue.find(
      (q) =>
        q.userId.toString() === userId.toString() && q.status === "waiting",
    );

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "You have not joined the queue",
      });
    }

    currentUser.status = "skipped";

    await queue.save();

    const history = await Users.findById(currentUser.userId);

    if (history) {
      const record = history.history.find(
        (item) =>
          item.queueId.toString() === queue._id.toString() &&
          item.tokenNumber === currentUser.tokenNumber,
      );

      if (record) {
        record.status = "skipped";
        record.servedAt = new Date();
        await history.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "You have left the queue successfully...",
    });
  } catch (error) {
    next(error);
  }
};

const serveQueue = async (req, res, next) => {
  try {
    const queueId = req.params.id;

    const queue = await Queue.findById(queueId);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue not found",
      });
    }

    if (!queue.isActive) {
      return res.status(400).json({
        success: false,
        message: "Queue not active",
      });
    }

    const currentUsers = queue.queue.find((user) => user.status === "waiting");

    console.log("QUEUE USERS:", queue.queue);

    if (!currentUsers) {
      return res.status(400).json({
        success: false,
        message: "No users waiting in this QUEUE",
      });
    }

    currentUsers.status = "served";

    queue.nowServing = currentUsers.tokenNumber;

    await queue.save();

    const history = await Users.findById(currentUsers.userId);

    if (history) {
      const record = history.history.find(
        (item) =>
          item.queueId.toString() === queue._id.toString() &&
          item.tokenNumber === currentUsers.tokenNumber,
      );

      if (record) {
        record.status = "served";
        record.servedAt = new Date();
        await history.save();
      }
    }

    const waitingCount = queue.queue.filter(
      (user) => user.status === "waiting",
    ).length;

    res.status(200).json({
      success: true,
      message: "User had been served food",
      data: {
        nowServing: queue.nowServing,
        waitingUsers: waitingCount,
        isActive: queue.isActive,
        status: currentUsers.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

const skipUser = async (req, res, next) => {
  try {
    const queueId = req.params.id;

    const queue = await Queue.findById(queueId);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue not found",
      });
    }

    if (!queue.isActive) {
      return res.status(400).json({
        success: false,
        message: "Queue not active",
      });
    }

    const waitingUsers = queue.queue.find((user) => user.status === "waiting");

    if (!waitingUsers) {
      return res.status(400).json({
        success: false,
        message: "No users waiting in this QUEUE",
      });
    }

    waitingUsers.status = "skipped";

    queue.nowServing = waitingUsers.tokenNumber;

    await queue.save();

    const consumer = await Users.findById(waitingUsers.userId);

    if (consumer) {
      const record = consumer.history.find(
        (item) =>
          item.queueId.toString() === queue._id.toString() &&
          item.tokenNumber === waitingUsers.tokenNumber,
      );

      if (record) {
        record.status = "skipped";
        record.servedAt = new Date();
        await consumer.save();
      }
    }

    const waitingCount = queue.queue.filter(
      (user) => user.status === "waiting",
    ).length;

    res.status(200).json({
      success: true,
      message: "User skipped successfully",
      data: {
        nowServing: queue.nowServing,
        waitingUsers: waitingCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

const pauseQueue = async (req, res, next) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue not found",
      });
    }

    queue.isActive = !queue.isActive;

    await queue.save();

    res.status(200).json({
      success: true,
      message: queue.isActive
        ? "Queue resumed successfully"
        : "Queue paused successfully",
      data: queue.isActive,
    });
  } catch (error) {
    next(error);
  }
};

const resetQueue = async (req, res, next) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue not found",
      });
    }

    queue.queue = [];
    queue.nowServing = 0;
    queue.lastTokenNumber = 0;

    await queue.save();

    res.status(200).json({
      success: true,
      message: "Queue reset done",
      data: queue,
    });
  } catch (error) {
    next(error);
  }
};

const getQueueStats = async (req, res, next) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue not found",
      });
    }

    const served = queue.queue.filter(
      (user) => user.status === "served",
    ).length;

    const waiting = queue.queue.filter(
      (user) => user.status === "waiting",
    ).length;

    const skipped = queue.queue.filter(
      (user) => user.status === "skipped",
    ).length;

    res.status(200).json({
      success: true,
      data: {
        queueName: queue.name,
        nowServing: queue.nowServing,
        queueId: queue._id,
        served,
        waiting,
        skipped,
        averageServiceTime: queue.averageServiceTime,
        averageWaitTime: queue.averageServiceTime * waiting,
        totalUsers: queue.queue.length,
        isActive: queue.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQueue,
  getQueueByVenue,
  getQueueById,
  updateQueue,
  deleteQueue,

  joinQueue,
  queueStatus,
  leaveQueue,

  serveQueue,
  skipUser,
  pauseQueue,
  resetQueue,
  getQueueStats,
};
