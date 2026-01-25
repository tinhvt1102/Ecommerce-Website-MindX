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
  if (!e.target.closest('.plus') &&
      !e.target.closest('.minus')) return;

  const btn = e.target.closest('button');
  const cartItem = btn.closest('.cart-product');
  const id = cartItem.dataset.id;

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const item = cart.find(p => p.id === id);

  if (btn.classList.contains('plus')) {
    item.quantity++;
  } else {
    item.quantity = Math.max(1, item.quantity - 1);
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  // Update UI
  cartItem.querySelector('.qty-input').value = item.quantity;
  cartItem.querySelector('.cart-subtotal p').innerText =`$${item.price * item.quantity}`;

  updateCartTotal(currentDiscount);
});

document.addEventListener('click', (e) => {
  const removeBtn = e.target.closest('.remove-item');
  if (!removeBtn) return;

  const cartItem = removeBtn.closest('.cart-product');
  const id = cartItem.dataset.id;

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Xóa sản phẩm theo id
  cart = cart.filter(item => item.id !== id);

  localStorage.setItem('cart', JSON.stringify(cart));

  // Xóa UI
  cartItem.remove();
  
  updateCartTotal();

  // Nếu cart trống
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
      alert('🎉 Giảm 30% thành công!');
    } else {
      localStorage.setItem('discount', 0);
      alert('❌ Coupon không hợp lệ');
    }

    updateCartTotal();
  });
});