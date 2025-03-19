function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    menu.classList.toggle("active");
}


document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".fade-in-section");

    function checkScroll() {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                section.classList.add("show");
            } else {
                section.classList.remove("show"); // Reset animation when out of view
            }
        });
    }

    window.addEventListener("scroll", checkScroll);
    checkScroll(); // Run on load in case some sections are already in view
});


window.addEventListener("load", function () {
    checkScroll(); // Run the animation check after everything loads
});
