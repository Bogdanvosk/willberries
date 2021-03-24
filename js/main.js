const mySwiper = new Swiper(".swiper-container", {
  loop: true,

  // Navigation arrows
  navigation: {
    nextEl: ".slider-button-next",
    prevEl: ".slider-button-prev"
  }
});

// cart

const buttonCart = document.querySelector(".button-cart");
const modalCart = document.querySelector("#modal-cart");
const modalClose = document.querySelector(".modal-close");
const body = document.querySelector("#body");

const openModal = () => {
  modalCart.classList.add("show");
};

const closeModal = () => {
  modalCart.classList.remove("show");
};

buttonCart.addEventListener("click", openModal);

modalCart.addEventListener("click", event => {
  const target = event.target;
  if (
    target.classList.contains("overlay") ||
    target.classList.contains("modal-close")
  ) {
    closeModal();
  }
});

// scroll smooth

{
  const scrollLinks = document.querySelectorAll("a.scroll-link");

  for (const scrollLink of scrollLinks) {
    scrollLink.addEventListener("click", event => {
      event.preventDefault();

      body.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }
}

// goods

const more = document.querySelector(".more"),
  navigationLinks = document.querySelectorAll(".navigation-link"),
  longGoodsList = document.querySelector(".long-goods");

const getGoods = async () => {
  const res = await fetch("db/db.json");
  if (!res.ok) {
    throw "Ошибочка вышла " + res.status;
  }
  return res.json();
};

const createCard = ({ id, img, name, label, description, price }) => {
  const card = document.createElement("div");
  card.className = "col-lg-3 col-sm-6";

  card.innerHTML = `<div class="goods-card">
                      ${label ? `<span class="label">${label}</span>` : ""}
                      <img
                        src="db/${img}"
                        alt="image: ${name}"
                        class="goods-image"
                      />
                      <h3 class="goods-title">${name}</h3>
                      <p class="goods-description">${description}</p>
                      <button class="button goods-card-btn add-to-cart" data-id="${id}">
                        <span class="button-price">$${price}</span>
                      </button>
                    </div>
                  `;

  return card;
};

const renderCards = data => {
  longGoodsList.textContent = "";
  const cards = data.map(createCard);

  longGoodsList.append(...cards);

  document.body.classList.add("show-goods");
};

more.addEventListener("click", event => {
  event.preventDefault();

  getGoods().then(renderCards);
});

// filter

const filterCards = (field, value) => {
  getGoods()
    .then(data => {
      const filteredGoods = data.filter(good => {
        return good[field] === value;
      });
      return filteredGoods;
    })
    .then(renderCards);
};

navigationLinks.forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();

    const field = link.dataset.field;
    const value = link.textContent;

    field ? filterCards(field, value) : getGoods().then(renderCards);
  });
});

// Banner buttons

const bannerButtons = document.querySelectorAll(".banner-button");

bannerButtons.forEach(bannerBtn => {
  const span = bannerBtn.querySelector("span");
  bannerBtn.addEventListener("click", () => {
    const field = span.dataset.field;
    const value = span.dataset.filter;

    body.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    filterCards(field, value);
  });
});
