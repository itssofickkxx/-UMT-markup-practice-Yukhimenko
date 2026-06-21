const mobileMenuBtn = document.querySelector("[data-menu-button]");
const mobileMenu = document.querySelector("[data-menu]");
const mobileMenuLink = document.querySelectorAll(".menu-navigation-link");

mobileMenuBtn.addEventListener("click", () => {
    const expanded = mobileMenuBtn.getAttribute("aria-expanded") === "true" || false;
    mobileMenuBtn.setAttribute("aria-expanded", !expanded);
    mobileMenuBtn.classList.toggle("is-open");
    document.body.classList.toggle("menu-open");
    mobileMenu.classList.toggle("is-open");

});

mobileMenuLink.forEach((element) => {
    element.addEventListener("click", (event) => {
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        mobileMenuBtn.classList.remove("is-open");
        document.body.classList.remove("menu-open");
        mobileMenu.classList.remove("is-open");
    });
});