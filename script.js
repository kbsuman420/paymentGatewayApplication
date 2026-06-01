const toggle_icon = document.querySelector(".toggle-icon")
const mobile_nav_list_container = document.querySelector(".mobile-nav-list-container")
const close_sidebar_icon = document.querySelector(".close-sidebar-icon")

toggle_icon.addEventListener("click", () => {
    mobile_nav_list_container.classList.toggle("active")
})

close_sidebar_icon.addEventListener("click", () => {
    mobile_nav_list_container.classList.toggle("active")
})