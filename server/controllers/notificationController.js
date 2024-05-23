const Notification = require("../models/notification");

const notificationController = {
  getNotificationsByUserId: async (req, res) => {
    try {
      const userId = req.params.id; 
  
      const notifications = await Notification.find({ userId });

      res.json({ notifications });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Server Error" });
    }
  },
  deleteNotification: async (req, res) => {
    try {
      const notificationId = req.params.id;

      const deletedNotification = await Notification.findByIdAndDelete(notificationId);
      
      if (!deletedNotification) {
        console.log("Notification not found");
        return res.status(404).json({ message: "Notification not found" });
      }

      console.log("Deleted notification:", deletedNotification);
      res.json({ message: "Notification deleted successfully" });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ message: "Server Error" });
    }
  },
  updateNotification: async (req, res) => {
    try {
      const notificationId = req.params.id;
      const { read } = req.body;

      const updatedNotification = await Notification.findByIdAndUpdate(
        notificationId,
        { read },
        { new: true }
      );

      if (!updatedNotification) {
        console.log("Notification not found");
        return res.status(404).json({ message: "Notification not found" });
      }

      console.log("Updated notification:", updatedNotification);
      res.json({ message: "Notification updated successfully", notification: updatedNotification });
    } catch (error) {
      console.error("Error updating notification:", error);
      res.status(500).json({ message: "Server Error" });
    }
  },
  getAllNotifications: async (req, res) => {
    try {
      const notifications = await Notification.find();
      res.json({ notifications });
    } catch (error) {
      console.error("Error fetching all notifications:", error);
      res.status(500).json({ message: "Server Error" });
    }
  },
};

module.exports = notificationController;
