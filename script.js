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


  // lấy data từ PRODUCTS fallback DOM nếu cần
  const getProducts = () => {
    if (Array.isArray(window.PRODUCTS) && window.PRODUCTS.length) return window.PRODUCTS;

    //lấy từ DOM nếu trang có product-card
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

  // ✅ match theo token: gõ 3-4 từ bất kỳ trong tên, không cần đúng thứ tự
  const searchProducts = (query, list) => {
    const q = normalize(query);
    const tokens = q.split(" ").filter(t => t.length >= 2); // cho phép 2 ký tự trở lên (HV, G-92)

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
            // Nếu có hàm callback thì chạy nó sau khi HTML đã hiện ra
            if (callback) callback();
        })
        .catch(error => console.error("Lỗi load HTML:", error));
}

function initHeaderLogic() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // Lấy các phần tử cần điều khiển (đảm bảo id/class này có trong header.html)
    const userContainer = document.querySelector('.user-container');
    const signUpLink = document.querySelector('.nav-links a[href="signup.html"]'); // Giả sử nút Sign Up là link này

    if (isLoggedIn) {
        // Đã đăng nhập: Hiện Icon User, ẩn nút Sign Up
        if (userContainer) userContainer.style.display = 'flex';
        if (signUpLink) signUpLink.style.display = 'none';
    } else {
        // Chưa đăng nhập: Ẩn Icon User, hiện nút Sign Up
        if (userContainer) userContainer.style.display = 'none';
        if (signUpLink) signUpLink.style.display = 'block';
    }

    // Xử lý nút Logout trong dropdown
    const logoutBtn = document.querySelector('.user-dropdown a:last-child'); // Link Logout cuối cùng
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn'); // Xóa trạng thái
            window.location.reload(); // Load lại trang để menu biến mất
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
     // ✅ quan trọng: phải gọi sau khi header load xong
  });

  loadHTML("/reuseable/footer.html", "footer-placeholder");

  // ✅ Right-Left đưa vào đây + check null để không crash trang khác
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
            // .toggle() sẽ tự động: thêm class nếu chưa có, xóa class nếu đã có
            const isExpanding = productContainer.classList.toggle('full-grid');

            if (isExpanding) {
                // TRẠNG THÁI: XEM TẤT CẢ (SHOW ALL)
                viewAllBtn.innerText = "Show Less";
                if (arrows) arrows.style.display = 'none';

                // Cuộn mượt lên đầu danh sách để dễ nhìn
                productContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                // TRẠNG THÁI: THU GỌN (SHOW LESS)
                viewAllBtn.innerText = "View All Products";
                if (arrows) arrows.style.display = 'flex';

                // Đưa thanh cuộn ngang về vị trí đầu tiên
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

            // Lấy thông tin từ  product-card

            const productCard = btn.closest('.product-card');
            // Tìm sale trong card 
            const saleEl = productCard.querySelector('[class^="sale-tag"]');
            const product = {
                id: productCard.dataset.id,
                name: productCard.dataset.name,
                price: productCard.dataset.price,
                img: productCard.dataset.img,
                sale: saleEl ? saleEl.innerText.replace('%', '').replace('-', '') : null
                
            };

            // Lấy danh sách wishlist hiện tại từ LocalStorage
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

            // Kiểm tra xem sản phẩm đã có trong wishlist
            const index = wishlist.findIndex(item => item.id === product.id);

            if (index === -1) {
                wishlist.push(product);
                btn.style.backgroundColor = '#DB4444'; 
                btn.querySelector('img').style.filter = 'brightness(0) invert(1)';
                alert("Đã thêm vào Wishlist!");
                localStorage.setItem('wishlist', JSON.stringify(wishlist));

                //  CHUYỂN SANG TRANG WISHLIST
                // window.location.href = './wishlist/wishlist.html';

            } else {
                // Có rồi xóa ra 
                wishlist.splice(index, 1);
                btn.style.backgroundColor = 'white';
                btn.querySelector('img').style.filter = 'none';
                alert("Đã xóa khỏi Wishlist!");
            }

            // Lưu lại mảng mới vào LocalStorage
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        });
    });
});
// just for you
function addToJustForYou(product) {
  let jfy = JSON.parse(localStorage.getItem("justForYou")) || [];

  // Nếu trước đó lưu dạng object thì convert sang array
  if (!Array.isArray(jfy)) jfy = [jfy];

  // Không trùng
  const exists = jfy.some(item => item.id === product.id);
  if (exists) return false;

  // Cho sản phẩm mới lên đầu danh sách
  jfy.unshift(product);

  // giới hạn tối đa 8 sản phẩm
  // jfy = jfy.slice(0, 8);

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
      else alert("The product is already");
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

  //  cập nhật badge cart nếu bạn có .cart-count
  const cartCountEl = document.querySelector(".cart-count");
  if (cartCountEl) cartCountEl.textContent = cart.reduce((s, i) => s + Number(i.quantity || 1), 0);
}
document.addEventListener("click", (e) => {
  const addBtn = e.target.closest('[class^="add-to-cart-"]');
  if (!addBtn) return;

  const card = addBtn.closest(".product-card");
  if (!card) return;

  const id = card.dataset.id;

  // lấy từ PRODUCTS 
  const product = (window.PRODUCTS || []).find(p => String(p.id) === String(id)) || {
    id: card.dataset.id,
    name: card.dataset.name,
    price: card.dataset.price,
    img: card.dataset.img,
    details: card.dataset.details
  };

  // addToCart(product);

  const added = addToCart(product);

      if (added) alert("Đã thêm vào Cart!");
      else alert("Sản phẩm đã có trong Cart!");

  //  chuyển trang cart
  // window.location.href = "/cart/cart.html"; // 
});

function updateWishlistBadge() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const badge = document.querySelector(".wishlist-countt"); // badge ở header

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

  // tránh load lại sau khi f5
  let deadline = Number(localStorage.getItem(KEY));

  //  set 24h mới
  if (!deadline || deadline <= Date.now()) {
    deadline = Date.now() + DAY_MS;
    localStorage.setItem(KEY, String(deadline));
  }

  const pad2 = (n) => String(n).padStart(2, "0");

  function tick() {
    let diff = deadline - Date.now();

    // reset lại
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

