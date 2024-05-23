const cron = require("node-cron");
const moment = require("moment");
const Evaluation = require("../models/evaluation");
const User = require("../models/user");
const Notification = require("../models/notification");
const sendNotification = require("../utils/Notification");
const Certificate = require("../models/certificate");
const { getIo } = require("../SocketIo");

const checkEvaluationsForNotification = async () => {
  try {
    console.log("Running monthly evaluation check...");

    const currentMonth = moment().month();
    const currentYear = moment().year();
    const suppliers = await User.find({ role: "supplier" });

    for (const supplier of suppliers) {
      const evaluation = await Evaluation.findOne({
        supplierId: supplier._id,
        evaluationDate: {
          $gte: new Date(currentYear, currentMonth, 1),
          $lt: new Date(currentYear, currentMonth + 1, 1),
        },
      });

      if (!evaluation) {
        console.log(
          `Supplier ${
            supplier.groupName
          } does not have an evaluation for ${moment().format(
            "MMMM"
          )}. Sending notification...`
        );

        const nonSupplierUsers = await User.find({
          role: { $in: ["admin", "employee"] },
        });
        const notificationMessage = `Add evaluation for supplier ${
          supplier.groupName
        } for ${moment().format("MMMM")}.`;

        const notifications = nonSupplierUsers.map((user) => ({
          userId: user._id,
          message: notificationMessage,
          type: "evaluation",
        }));
        await Notification.insertMany(notifications);

        const emailPromises = nonSupplierUsers.map((user) => {
          return sendNotification(
            user.email,
            "Reminder: Add Supplier Evaluation",
            notificationMessage
          );
        });
        await Promise.all(emailPromises);

        const io = getIo();
        nonSupplierUsers.forEach((user) => {
          io.to(user._id.toString()).emit("newEvaluation", {
            message: notificationMessage,
          });
          io.emit("newEvaluation", {
            userRole: supplier.role,
            supplierId: supplier._id,
          });
        });
      }
    }

    console.log("Monthly evaluation check completed.");
  } catch (error) {
    console.error("Error in monthly evaluation check:", error);
  }
};

const checkCertificatesForNotification = async () => {
  try {
    console.log("Running certificate expiration check...");

    const certificates = await Certificate.find({
      ExpireDate: {
        $lte: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000),
      },
      notificationStatus: "pending",
    });

    for (const certificate of certificates) {
      const supplier = await User.findById(certificate.supplierId);
      if (supplier && supplier.email) {
        const message = `Certificate "${certificate.CertificateName}" expires on ${certificate.ExpireDate.toDateString()}. Recertification date: ${certificate.RecertificateDate.toDateString()}.`;


        const notification = new Notification({
          userId: supplier._id,
          message: message,
          type: "certificate",
        });
        await notification.save();

        await sendNotification(
          supplier.email,
          "Certificate Expiration Alert!",
          message
        );

        certificate.notificationStatus = "sent";
        certificate.lastNotifiedDate = new Date();
        await certificate.save();

        const io = getIo();
        io.to(supplier._id.toString()).emit("newCertificate", { message });
      }
    }

    console.log("Certificate expiration check completed.");
  } catch (error) {
    console.error("Error in certificate expiration check:", error);
  }
};

cron.schedule("15 11 23 * *", checkEvaluationsForNotification); // min hour day
cron.schedule("36 11 * * *", checkCertificatesForNotification); // min hour

module.exports = {
  checkEvaluationsForNotification,
  checkCertificatesForNotification,
};
