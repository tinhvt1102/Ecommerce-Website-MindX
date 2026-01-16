document.addEventListener("DOMContentLoaded", () => {
  const product = JSON.parse(localStorage.getItem("selectedProduct"));
  if (!product) {
    console.warn("No product selected");
    return;
  }

  const imagePath = product.img.startsWith('./')
    ? `/${product.img.slice(2)}`
    : product.img;

  const imgEl = document.querySelector(".product-img1");
  const nameEl = document.querySelector(".product-info h1");
  const priceEl = document.querySelector(".product-info h2");
  const descEl = document.querySelector(".product-description p");

  if (imgEl) imgEl.src = imagePath;
  if (nameEl) nameEl.innerText = product.name;
  if (priceEl) priceEl.innerText = `$${product.price}`;
  if (descEl) descEl.innerText = product.details;
});
