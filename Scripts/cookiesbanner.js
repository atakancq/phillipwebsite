const cookies = document.querySelector(".cookies");
const rightSide1 = document.querySelector(".rightSide1");

rightSide1.addEventListener("click", () => {
    cookies.classList.remove("active");
    localStorage.setItem("cookieBannerDisplayed", "true");
});

setTimeout(() => {
    if (!localStorage.getItem("cookieBannerDisplayed")) {
        cookies.classList.add("active");
    }
}, 2000);