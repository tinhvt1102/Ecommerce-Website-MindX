document.addEventListener('DOMContentLoaded', () => {
  const cartContainer = document.querySelector('.cart-header');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    cartContainer.innerHTML += '<p>Your cart is empty</p>';
    return;
  }
  cart.forEach(item => {
    const imagePath = item.img.startsWith('./')
    ? `../${item.img.slice(2)}`
    : item.img;
    const subtotal = item.price * item.quantity;
    cartContainer.innerHTML += `
      <div class="cart-product box-cart" data-id="${item.id}">
        <div class="name-cart">
          <div class="cart-img-wrapper">
            <button class="remove-item">
              <img src="../img/icon-cancel.png" alt="Remove">
            </button>
            <img class="pic-cart" src="${imagePath}">
          </div>
          <p>${item.name}</p>
        </div>

        <div class="cart-price">
          <p>$${item.price}</p>
        </div>

        <div class="cart-quantity">
          <div class="quantity-control">
            <input class="qty-input" value="${item.quantity}" readonly>
            <div class="button-quantity">
                                <button class="qty-btn plus">
                                    <img src="/img/Drop-Up-Small.png" alt="">
                                </button>
                                <button class="qty-btn minus">
                                    <img src="/img/Drop-Down-Small.png" alt="">
                                </button>
                            </div>
          </div>
        </div>

        <div class="cart-subtotal">
          <p>$${subtotal}</p>
        </div>
      </div>
    `;
  });

  updateCartTotal();
});

// cart total
function updateCartTotal() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const discountPercent = Number(localStorage.getItem("discount")) || 0;
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  const discount = Math.round(subtotal * discountPercent / 100);
  const total = subtotal - discount;
  document.querySelector('.subtotal-price').innerText = `$${subtotal}`;
  document.querySelector('.coupon-discount').innerText = `-$${discount}`;
  document.querySelector('.total-price').innerText = `$${total}`;
}

document.addEventListener('click', e => {
  const plusBtn = e.target.closest('.plus');
  const minusBtn = e.target.closest('.minus');
  if (!plusBtn && !minusBtn) return;
  const btn = e.target.closest('button');
  const cartItem = btn.closest('.cart-product');
  if (!cartItem) return;
  const id = cartItem.dataset.id;
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const item = cart.find(p => String(p.id) === String(id));
  if (!item) return;
  item.quantity = Number(item.quantity) || 1;
  if (btn.classList.contains('plus')) {
    item.quantity++;
  } else {
    item.quantity = Math.max(1, item.quantity - 1);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  cartItem.querySelector('.qty-input').value = item.quantity;
  cartItem.querySelector('.cart-subtotal p').innerText =
    `$${Number(item.price) * item.quantity}`;
  updateCartTotal(); // 
});

document.addEventListener('click', (e) => {
  const removeBtn = e.target.closest('.remove-item');
  if (!removeBtn) return;
  const cartItem = removeBtn.closest('.cart-product');
  const id = cartItem.dataset.id;
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  cartItem.remove();
  updateCartTotal();
  if (cart.length === 0) {
    document.querySelector('.cart-header').innerHTML +=
      `<p>Your cart is empty</p>`;
  }
});

// code sale
document.addEventListener('DOMContentLoaded', () => {
  const couponBtn = document.querySelector('.coupon-btn');
  const couponInput = document.querySelector('.coupon-cart input');
  if (!couponBtn || !couponInput) return;
  couponBtn.addEventListener('click', () => {
    const code = couponInput.value.trim();
    if (code === 'Tritinbanhtrai' || code === 'Minhquanbanhton') {
      localStorage.setItem('discount', 30);
      alert('30% discount');
    } else {
      localStorage.setItem('discount', 0);
      alert('Invalid coupon');
    }
    updateCartTotal();
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.querySelector(".btn-checkout");
  if (!checkoutBtn) return;
  checkoutBtn.addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    window.location.href = "/checkout/checkout.html"; 
  });
});










