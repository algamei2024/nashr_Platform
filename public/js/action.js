//back to top
const mybutton = document.getElementById("btn-back-to-top");
const scrollFunction = () => {
    if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
    ) {
        mybutton.classList.remove("hidden");
    } else {
        mybutton.classList.add("hidden");
    }
};
const backToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};
mybutton.addEventListener("click", backToTop);
window.addEventListener("scroll", scrollFunction);
//===click on profile
const profile = document.querySelector('.profile');
profile.addEventListener('click', function () {
    document.getElementById('p-info').classList.remove('hidden');
});
document.getElementById('p-close').addEventListener('click', function () {
    this.parentNode.parentNode.classList.add('hidden')
});
//======menu
document.getElementById('menu').addEventListener('click', function () {
    this.classList.add('hidden');
    document.getElementById('m-close').classList.remove('hidden');
    document.getElementById('mobile-menu').classList.remove('hidden');
});
document.getElementById('m-close').addEventListener('click', function () {
    this.classList.add('hidden');
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('mobile-menu').classList.add('hidden');
});
//========cancel post========
function delPost(el) {
    el.parentNode.parentNode.remove();
}
