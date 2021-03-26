const mySwiper = new Swiper(".swiper-container", {
  loop: true,

  // Navigation arrows
  navigation: {
    nextEl: ".slider-button-next",
    prevEl: ".slider-button-prev",
  },
});

// smooth scroll
{
  const scrollLinks = document.querySelectorAll("a.scroll-link");

  for (const scrollLink of scrollLinks) {
    scrollLink.addEventListener("click", event => {
      event.preventDefault();

      body.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }
}

// cart

const buttonCart = document.querySelector(".button-cart");
const modalCart = document.querySelector("#modal-cart");
const modalClose = document.querySelector(".modal-close");
const body = document.querySelector("#body");
const more = document.querySelector(".more");
const navigationLinks = document.querySelectorAll(".navigation-link");
const longGoodsList = document.querySelector(".long-goods");
const cartTableGoods = document.querySelector(".cart-table__goods");
const cardTableTotal = document.querySelector(".cart-table__total");
const cartCount = document.querySelector(".cart-count");
const modalClear = document.querySelector(".modal-clear");

// Функция получения товаров из db.json
const getGoods = async () => {
  const res = await fetch("db/db.json");
  if (!res.ok) {
    throw "Ошибочка вышла " + res.status;
  }
  return res.json();
};

const setCartCounter = () => {
  cartCount.textContent = cart.cartGoods.reduce((sum, item) => {
    return sum + item.count;
  }, 0);
};

const cart = {
  cartGoods: [],
  renderCart() {
    cartTableGoods.textContent = "";
    this.cartGoods.forEach(({ id, name, price, count }) => {
      const trGood = document.createElement("tr");
      trGood.className = "cart-item";
      trGood.dataset.id = id;

      trGood.innerHTML = `
                           <td>${name}</td>
                           <td>${price}$</td>
                           <td><button class="cart-btn-minus">-</button></td>
                           <td>${count}</td>
                           <td><button class="cart-btn-plus">+</button></td>
                           <td>${price * count}$</td>
                           <td><button class="cart-btn-delete">x</button></td>
                           `;

      cartTableGoods.append(trGood);
    });
    setCartCounter();

    const totalPrice = this.cartGoods.reduce((sum, item) => {
      return sum + item.price * item.count;
    }, 0);
    cardTableTotal.textContent = totalPrice + "$";
  },
  deleteGood(id) {
    this.cartGoods = this.cartGoods.filter(item => item.id !== id);
    this.renderCart();
  },
  minusGood(id) {
    for (const item of this.cartGoods) {
      if (item.id === id) {
        if (item.count <= 1) {
          this.deleteGood(id);
        } else {
          item.count -= 1;
        }
        break;
      }
    }
    this.renderCart();
  },
  plusGood(id) {
    for (const item of this.cartGoods) {
      if (item.id === id) {
        item.count += 1;
        break;
      }
    }
    this.renderCart();
  },
  addCartGoods(id) {
    const goodItem = this.cartGoods.find(item => item.id === id);
    if (goodItem) {
      this.plusGood(id);
    } else {
      getGoods()
        .then(data => data.find(item => item.id === id))
        .then(({ id, name, price }) => {
          this.cartGoods = [...this.cartGoods, { id, name, price, count: 1 }];
          this.renderCart();
        });
    }
  },
  clearGoods() {
    this.cartGoods = [];
    this.renderCart();
  },
};

document.body.addEventListener("click", event => {
  const addToCart = event.target.closest(".add-to-cart");

  if (addToCart) {
    cart.addCartGoods(addToCart.dataset.id);
    setCartCounter();
  }
});

cartTableGoods.addEventListener("click", event => {
  const target = event.target;
  const id = target.closest(".cart-item").dataset.id;

  if (target.classList.contains("cart-btn-delete")) {
    cart.deleteGood(id);
  }

  if (target.classList.contains("cart-btn-plus")) {
    cart.plusGood(id);
  }

  if (target.classList.contains("cart-btn-minus")) {
    cart.minusGood(id);
  }
});

modalClear.addEventListener("click", () => {
  cart.clearGoods();
});

const openModal = () => {
  cart.renderCart();
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

// goods

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
    .then(data => data.filter(good => good[field] === value))
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
  bannerBtn.addEventListener("click", () => {
    const field = bannerBtn.dataset.field;
    const value = bannerBtn.dataset.filter;

    body.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    filterCards(field, value);
  });
});

// Server

const modalForm = document.querySelector(".modal-form");
const modalInputs = document.querySelectorAll(".modal-input");

const validateInputs = inputs => {
  inputs.forEach(input => {
    if (input.value.trim() !== "") {
      return true;
    }
    return false;
  });
};

const postData = dataUser =>
  fetch("server.php", {
    method: "POST",
    body: dataUser,
  });

modalForm.addEventListener("submit", e => {
  e.preventDefault();

  if (validateInputs(modalInputs) && cart.cartGoods.length > 0) {
    const formData = new FormData(modalForm);
    formData.append("order", JSON.stringify(cart.cartGoods));

    postData(formData)
      .then(res => {
        if (!res.ok) {
          throw new Error(response.status);
        }
        alert(
          "Ваш заказ успешно отправлен, с вами свяжутся в ближайшее время :)",
        );
      })
      .catch(() => alert("К сожалению произошла ошибка, повторите позже!"))
      .finally(() => {
        closeModal();
        modalForm.reset();
        cart.clearGoods();
      });
  } else {
    alert("Ваша корзина пуста или вы не ввели свои данные");
  }
});
