document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const idFromUrl = params.get("id");

  let product = null;

  // 1) lấy từ localStorage
  try {
    product = JSON.parse(localStorage.getItem("selectedProduct"));
  } catch (e) {
    product = null;
  }

  // 2) fallback theo ?id=... từ PRODUCTS
  if ((!product || (idFromUrl && String(product.id) !== String(idFromUrl)))
      && Array.isArray(window.PRODUCTS)) {
    product = window.PRODUCTS.find(p => String(p.id) === String(idFromUrl));
  }

  if (!product) {
    console.warn("No product selected");
    return;
  }

  // chuẩn hoá path ảnh cho /detail/detail.html
  const toDetailImgPath = (img) => {
    if (!img) return "";
    let path = String(img).trim();

    // ./img/... -> ../img/...
    if (path.startsWith("./img/")) path = "../img/" + path.slice("./img/".length);
    // img/... -> ../img/...
    else if (path.startsWith("img/")) path = "../" + path;
    // /img/... -> ../img/... (an toàn khi detail nằm trong /detail/)
    else if (path.startsWith("/img/")) path = ".." + path;

    return encodeURI(path);
  };

  const imgEl = document.querySelector(".product-img1");
  const nameEl = document.querySelector(".product-info h1");
  const priceEl = document.querySelector(".product-info h2");
  const descEl = document.querySelector(".product-description p");

  if (imgEl) imgEl.src = toDetailImgPath(product.img);
  if (nameEl) nameEl.textContent = product.name ?? "";
  if (priceEl) priceEl.textContent = `$${product.price ?? ""}`;
  if (descEl) descEl.textContent = product.details ?? "";
});
