// // ===== LOAD HEADER TỰ ĐỘNG =====
// function loadHTML(file, elementId) {
//     fetch(file)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error("Không load được " + file);
//             }
//             return response.text();
//         })
//         .then(data => {
//             document.getElementById(elementId).innerHTML = data;
//         })
//         .catch(error => {
//             console.error("Lỗi load HTML:", error);
//         });
// }


// // Khi trang load xong
function initSearchLogic() {
  const searchInput = document.querySelector(".search-box input");
  if (!searchInput) return;
  searchInput.parentElement.style.position = "relative";

  const getProducts = () => {
    if (Array.isArray(window.PRODUCTS) && window.PRODUCTS.length) return window.PRODUCTS;
    return [...document.querySelectorAll(".product-card")].map(card => ({
      id: card.dataset.id,
      name: card.dataset.name,
      price: card.dataset.price,
      img: card.dataset.img,
      details: card.dataset.details
    }));
  };

  const normalize = (s) =>
    (s || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  const searchProducts = (query, list) => {
    const q = normalize(query);
    const tokens = q.split(" ").filter(t => t.length >= 2);
    if (tokens.length === 0) return [];
    const scored = list
      .map(p => {
        const name = normalize(p.name);
        let score = 0;
        tokens.forEach(t => {
          if (name.includes(t)) score += 1;
        });
        return { p, score };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.map(x => x.p);
  };

  // result box
  const resultBox = document.createElement("div");
  resultBox.className = "search-result-box";
  resultBox.style.cssText = `
    position:absolute;
    top:45px;
    left:0;
    width:100%;
    background:#fff;
    border:1px solid #ddd;
    z-index:9999;
    display:none;
    max-height:260px;
    overflow:auto;
  `;
  searchInput.parentElement.style.position = "relative";
  searchInput.parentElement.appendChild(resultBox);

  const goDetail = (product) => {
  if (!product) return;
  localStorage.setItem("selectedProduct", JSON.stringify(product));
  window.location.href = `/detail/detail.html?id=${product.id}`;
};


  // ENTER SEARCH
  searchInput.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  e.preventDefault();

  const products = getProducts();
  const keyword = searchInput.value;

  const matched = searchProducts(keyword, products);

  if (!matched.length) {
    alert("No product found.");
    return;
  }

  goDetail(matched[0]);

  
});


  // LIVE SUGGEST
  searchInput.addEventListener("input", () => {
    const products = getProducts();
    const keyword = searchInput.value;

    resultBox.innerHTML = "";

    if (normalize(keyword).length < 3) {
      resultBox.style.display = "none";
      return;
    }

    const matched = searchProducts(keyword, products).slice(0, 6);

    matched.forEach(p => {
      const div = document.createElement("div");
      div.style.padding = "10px";
      div.style.cursor = "pointer";
      div.style.borderBottom = "1px solid #eee";
      div.innerHTML = `<strong>${p.name}</strong> - $${p.price}`;

      div.onclick = () => goDetail(p);

      resultBox.appendChild(div);
    });

    resultBox.style.display = matched.length ? "block" : "none";
  });

  // click outside -> hide
  document.addEventListener("click", (e) => {
    if (!resultBox.contains(e.target) && e.target !== searchInput) {
      resultBox.style.display = "none";
    }
  });
}



// ===== LOAD HTML TỰ ĐỘNG =====
function loadHTML(file, elementId, callback) {
    fetch(file)
        .then(response => {
            if (!response.ok) throw new Error("Không load được " + file);
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            if (callback) callback();
        })
        .catch(error => console.error("Lỗi load HTML:", error));
}

function initHeaderLogic() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userContainer = document.querySelector('.user-container');
    const signUpLink = document.querySelector('.nav-links a[href="signup.html"]');

    if (isLoggedIn) {
        if (userContainer) userContainer.style.display = 'flex';
        if (signUpLink) signUpLink.style.display = 'none';
    } else {
        if (userContainer) userContainer.style.display = 'none';
        if (signUpLink) signUpLink.style.display = 'block';
    }
    const logoutBtn = document.querySelector('.user-dropdown a:last-child');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            window.location.reload();
        });
    }
}

// Khi trang load xong
document.addEventListener("DOMContentLoaded", () => {
  loadHTML("/reuseable/header.html", "header-placeholder", () => {
    initHeaderLogic();
    initSearchLogic();
    updateWishlistBadge();
    updateCartBadge(); 
  });

  loadHTML("/reuseable/footer.html", "footer-placeholder");
  const productContainer = document.querySelector(".product");
  const btnLeft = document.querySelector(".left");
  const btnRight = document.querySelector(".right");

  if (productContainer && btnLeft && btnRight) {
    btnRight.addEventListener("click", () => (productContainer.scrollLeft += 300));
    btnLeft.addEventListener("click", () => (productContainer.scrollLeft -= 300));
  }
});



// ===== VIEW ALL BUTTON =====

document.addEventListener('DOMContentLoaded', () => {
    const viewAllBtn = document.querySelector('.view-product button');
    const productContainer = document.querySelector('.product');
    const arrows = document.querySelector('.frame726');

    if (viewAllBtn && productContainer) {
        viewAllBtn.addEventListener('click', () => {
            const isExpanding = productContainer.classList.toggle('full-grid');

            if (isExpanding) {
                viewAllBtn.innerText = "Show Less";
                if (arrows) arrows.style.display = 'none';
                productContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                viewAllBtn.innerText = "View All Products";
                if (arrows) arrows.style.display = 'flex';
                productContainer.scrollLeft = 0;
            }
        });
    }
});


// wishlist //
document.addEventListener('DOMContentLoaded', () => {
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', () => {

            const productCard = btn.closest('.product-card');
            const saleEl = productCard.querySelector('[class^="sale-tag"]');
            const product = {
                id: productCard.dataset.id,
                name: productCard.dataset.name,
                price: productCard.dataset.price,
                img: productCard.dataset.img,
                sale: saleEl ? saleEl.innerText.replace('%', '').replace('-', '') : null
                
            };
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            const index = wishlist.findIndex(item => item.id === product.id);

            if (index === -1) {
                wishlist.push(product);
                btn.style.backgroundColor = '#DB4444'; 
                btn.querySelector('img').style.filter = 'brightness(0) invert(1)';
                alert("Added to Wishlist!");
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
            } else {
                wishlist.splice(index, 1);
                btn.style.backgroundColor = 'white';
                btn.querySelector('img').style.filter = 'none';
                alert("Deleted from Wishlist!");
            }
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        });
    });
});
// just for you
function addToJustForYou(product) {
  let jfy = JSON.parse(localStorage.getItem("justForYou")) || [];
  if (!Array.isArray(jfy)) jfy = [jfy];
  const exists = jfy.some(item => item.id === product.id);
  if (exists) return false;
  jfy.unshift(product);
  localStorage.setItem("justForYou", JSON.stringify(jfy));
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const productCard = btn.closest(".product-card");
      if (!productCard) return;
      const saleEl = productCard.querySelector('[class^="sale-tag"]');
      const product = {
        id: productCard.dataset.id,
        name: productCard.dataset.name,
        price: productCard.dataset.price,
        img: productCard.dataset.img,
        details: productCard.dataset.details,
        sale: saleEl ? saleEl.innerText.replace('%','').replace('-','') : null
      };
      const added = addToJustForYou(product);
      if (added) alert("Added to Just For You!");
      else alert("The product is already!");
    });
  });
});

// cart
function normalizeImgPath(img) {
  if (!img) return "";
  if (img.startsWith("./")) return "/" + img.slice(2);
  if (img.startsWith("../")) return "/" + img.replace(/^(\.\.\/)+/, "");
  return img;
}
function addToCart(product) {
  if (!product || !product.id) return;
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const id = String(product.id);
  const existing = cart.find(item => String(item.id) === id);
  if (existing) {
    existing.quantity = Number(existing.quantity || 1) + 1;
  } else {
    cart.push({
      id: id,
      name: product.name,
      price: Number(product.price),
      img: normalizeImgPath(product.img),
      details: product.details || "",
      quantity: 1
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  const cartCountEl = document.querySelector(".cart-count");
  if (cartCountEl) cartCountEl.textContent = cart.reduce((s, i) => s + Number(i.quantity || 1), 0);
}
document.addEventListener("click", (e) => {
  const addBtn = e.target.closest('[class^="add-to-cart-"]');
  if (!addBtn) return;
  const card = addBtn.closest(".product-card");
  if (!card) return;
  const id = card.dataset.id;
  const product = (window.PRODUCTS || []).find(p => String(p.id) === String(id)) || {
    id: card.dataset.id,
    name: card.dataset.name,
    price: card.dataset.price,
    img: card.dataset.img,
    details: card.dataset.details
  };

  // addToCart(product);
  const added = addToCart(product);
      if (added) alert("Added to Cart!");
      else alert("The product is already!");
});

function updateWishlistBadge() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const badge = document.querySelector(".wishlist-countt, .wishlist-count");
  if (badge) badge.textContent = wishlist.length;
}
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const badge = document.querySelector(".cart-count");
  if (!badge) return;
  const totalQty = cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  badge.textContent = totalQty;
}

// time //
document.addEventListener("DOMContentLoaded", () => {
  const countdown = document.querySelector(".countdown");
  if (!countdown) return;
  const values = countdown.querySelectorAll(".value");
  if (values.length < 4) return;
  const [daysEl, hoursEl, minutesEl, secondsEl] = values;
  const KEY = "flashSaleDeadline";
  const DAY_MS = 24 * 60 * 60 * 1000;
  let deadline = Number(localStorage.getItem(KEY));
  if (!deadline || deadline <= Date.now()) {
    deadline = Date.now() + DAY_MS;
    localStorage.setItem(KEY, String(deadline));
  }
  const pad2 = (n) => String(n).padStart(2, "0");
  function tick() {
    let diff = deadline - Date.now();
    if (diff <= 0) {
      deadline = Date.now() + DAY_MS;
      localStorage.setItem(KEY, String(deadline));
      diff = deadline - Date.now();
    }
    const days = Math.floor(diff / DAY_MS);
    const hours = Math.floor((diff % DAY_MS) / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((diff % (60 * 1000)) / 1000);
    daysEl.textContent = pad2(days);
    hoursEl.textContent = pad2(hours);
    minutesEl.textContent = pad2(minutes);
    secondsEl.textContent = pad2(seconds);
  }
  tick();
  setInterval(tick, 1000);
});

