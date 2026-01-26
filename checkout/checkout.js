document.addEventListener("DOMContentLoaded", () => {
  renderCheckout();
  initCheckoutCoupon();
});

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function getDiscountPercent() {
  return Number(localStorage.getItem("discount")) || 0;
}

function normalizeImg(img) {
  if (!img) return "";
  if (img.startsWith("./")) return `../${img.slice(2)}`;
  return img;
}

function calcTotals(cart, discountPercent) {
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity || 1),
    0
  );
  const discount = Math.round((subtotal * discountPercent) / 100);
  const total = subtotal - discount;
  return { subtotal, discount, total };
}

function renderCheckout() {
  const cart = getCart();
  const discountPercent = getDiscountPercent();
  const productsWrap = document.querySelector(".checkout-products");
  const subtotalEl = document.querySelector(".subtotal-price");
  const discountEl = document.querySelector(".coupon-discount");
  const totalEl = document.querySelector(".total-price");
  if (!productsWrap) {
    console.warn("Missing .checkout-products in checkout.html");
    return;
  }
  productsWrap.innerHTML = "";
  if (cart.length === 0) {
    productsWrap.innerHTML = `<p style="padding:10px 0;">Your cart is empty</p>`;
    if (subtotalEl) subtotalEl.innerText = `$0`;
    if (discountEl) discountEl.innerText = `-$0`;
    if (totalEl) totalEl.innerText = `$0`;
    return;
  }
  cart.forEach(item => {
    const imgPath = normalizeImg(item.img);
    const qty = Number(item.quantity || 1);
    const lineTotal = Number(item.price) * qty;
    const row = document.createElement("div");
    row.className = "checkout-product";
    row.innerHTML = `
      <img src="${imgPath}" alt="">
      <div class="product-infoo">
        <p>${item.name} <span style="opacity:.7;">x${qty}</span></p>
        <p>$${lineTotal}</p>
      </div>
    `;
    productsWrap.appendChild(row);
  });

  const { subtotal, discount, total } = calcTotals(cart, discountPercent);
  if (subtotalEl) subtotalEl.innerText = `$${subtotal}`;
  if (discountEl) discountEl.innerText = `-$${discount}`;
  if (totalEl) totalEl.innerText = `$${total}`;
}

function initCheckoutCoupon() {
  const couponBtn = document.querySelector(".coupon-btn");
  const couponInput = document.querySelector(".coupon-cart input");
  if (!couponBtn || !couponInput) return;
  couponBtn.addEventListener("click", () => {
    const code = couponInput.value.trim();
    if (code === "Tritinbanhtrai" || code === "Minhquanbanhton") {
      localStorage.setItem("discount", 30);
      alert(" 30% discount");
    } else {
      localStorage.setItem("discount", 0);
      alert(" Invalid coupon");
    }
    renderCheckout();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const placeBtn = document.querySelector(".place-order-btn");
  if (!placeBtn) return;
  placeBtn.addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    alert("Payment successful");
    localStorage.removeItem("cart");
    localStorage.removeItem("discount");
    const cartCountEl = document.querySelector(".cart-count");
    if (cartCountEl) cartCountEl.textContent = "0";
    window.location.href = "/index.html";
  });
});
