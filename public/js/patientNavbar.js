const socket = io();

socket.on("connect", () => {

    socket.emit("joinRoom", {

        userId: window.currentUser.id,

        role: window.currentUser.role

    });

    loadNotifications();

});

socket.on("roomJoined", (data) => {

    console.log(data.message);

});

socket.on("newNotification", (notification) => {

    badge.innerText = Number(badge.innerText) + 1;

    renderNotification(notification);

});