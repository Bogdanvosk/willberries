const mySwiper = new Swiper(".swiper-container", {
  loop: true,

  // Navigation arrows
  navigation: {
    nextEl: ".slider-button-next",
    prevEl: ".slider-button-prev"
  }
});

// CART

const buttonCart = document.querySelector(".button-cart");
const modalCart = document.querySelector("#modal-cart");
const modalClose = document.querySelector(".modal-close");

const openModal = () => {
  modalCart.classList.add("show");
};

const closeModal = () => {
  modalCart.classList.remove("show");
};

buttonCart.addEventListener("click", openModal);
modalClose.addEventListener("click", closeModal);

modalCart.addEventListener("click", event => {
  if (event.target.id === "modal-cart") {
    closeModal()
  }
});

// scroll smooth

{
  const scrollLinks = document.querySelectorAll("a.scroll-link");

  scrollLinks.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();

      const id = link.getAttribute("href");
      document.querySelector(id).scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });
}
