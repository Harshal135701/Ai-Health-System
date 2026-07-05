const notificationBtn = document.querySelector(".notification-btn");
const notificationDropdown = document.querySelector(".notification-dropdown");
const notificationList = document.getElementById("notificationList");
const badge = document.getElementById("notificationBadge");

function renderNotification(notification) {

    if (
        notificationList.children.length === 1 &&
        notificationList.children[0].querySelector("h4") &&
        notificationList.children[0].querySelector("h4").innerText === "No Notifications"
    ) {
        notificationList.innerHTML = "";
    }

    const notificationItem = document.createElement("div");

    notificationItem.className = "notification-item";

    notificationItem.dataset.id = notification._id;
    notificationItem.dataset.url =
        notification.redirectUrl || "/doctor/appointments";

    if (!notification.isRead) {
        notificationItem.classList.add("unread");
    }

    notificationItem.innerHTML = `
        <div class="notification-icon warning">
            <i class="fa-solid fa-calendar-check"></i>
        </div>

        <div class="notification-content">
            <h4>${notification.title}</h4>
            <p>${notification.message}</p>
            <span>${new Date(notification.createdAt).toLocaleString()}</span>
        </div>
    `;

    notificationList.prepend(notificationItem);

}

async function loadNotifications() {

    try {

        const response = await fetch("/doctor/notifications");

        const data = await response.json();

        if (!data.status) return;

        notificationList.innerHTML = "";

        if (data.notifications.length === 0) {

            notificationList.innerHTML = `
                <div class="notification-item">

                    <div class="notification-icon success">
                        <i class="fa-solid fa-bell"></i>
                    </div>

                    <div class="notification-content">
                        <h4>No Notifications</h4>
                        <p>You don't have any notifications yet.</p>
                        <span>Just Now</span>
                    </div>

                </div>
            `;

            badge.innerText = 0;

            return;

        }

        badge.innerText =
            data.notifications.filter(n => !n.isRead).length;

        data.notifications.forEach(renderNotification);

    }
    catch(err){
        console.error(err);
    }

}

notificationBtn.addEventListener("click",(e)=>{

    e.stopPropagation();

    notificationDropdown.classList.toggle("show");

});

notificationDropdown.addEventListener("click",(e)=>{

    e.stopPropagation();

});

document.addEventListener("click",()=>{

    notificationDropdown.classList.remove("show");

});

notificationList.addEventListener("click",async(e)=>{

    const notificationItem =
        e.target.closest(".notification-item");

    if(!notificationItem) return;

    if(!notificationItem.dataset.id) return;

    try{

        if(notificationItem.classList.contains("unread")){

            const response = await fetch(
                `/doctor/notifications/${notificationItem.dataset.id}/read`,
                {
                    method:"PATCH"
                }
            );

            const data = await response.json();

            if(!data.status) return;

            notificationItem.classList.remove("unread");

            badge.innerText =
                Math.max(0,Number(badge.innerText)-1);

        }

        notificationDropdown.classList.remove("show");

        window.location.href =
            notificationItem.dataset.url;

    }
    catch(err){

        console.error(err);

    }

});