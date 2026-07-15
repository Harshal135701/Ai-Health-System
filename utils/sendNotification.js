const notificationModel = require("../models/notification");
const { getIO } = require("../config/socket");

async function sendNotification({
    receiverId,
    senderId,
    referenceId,
    referenceModel,
    title,
    message,
    type,
    redirectUrl,
    roomName
}) {

    const notification = await notificationModel.create({
        receiverId,
        senderId,
        referenceId,
        referenceModel,
        title,
        message,
        type,
        redirectUrl
    });

    const io = getIO();

    io.to(roomName).emit("newNotification", {
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        redirectUrl: notification.redirectUrl
    });

    return notification;
}

module.exports = sendNotification;