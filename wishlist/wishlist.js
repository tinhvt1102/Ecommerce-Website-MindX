document.addEventListener("DOMContentLoaded", () => {
    const wishlistContainer = document.querySelector(".wishlist-list");
    

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const countEl = document.querySelector(".wishlist-count");
    countEl.textContent = `Wishlist (${wishlist.length})`;
    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = "<p>Wishlist is empty.</p>";
        return;
    }

    wishlistContainer.innerHTML = wishlist.map(item => {
        const imagePath = item.img.startsWith('./')
            ? `../${item.img.slice(2)}`
            : item.img;
            

        return `
            <div class="product-card" data-id="${item.id}">
                
                <div class="product-top-1">

                    <!-- ICON REMOVE -->
                    <div class="action-icons-1">
                        <button class="icon-btn-1 remove-btn">
                            <img src="/img/icon-delete.png" alt="Remove">
                        </button>
                    </div> 

                    <div class="picture-1">
                        <img src="${imagePath}" alt="${item.name}">
                    </div>

                </div>

                <div class="content-1">
                    <p class="product-name-1">${item.name}</p>
                    <span class="price-new-1">$${item.price}</span>
                </div>
            </div>
        `;
    }).join("");

    /*  REMOVE WISHLIST  */
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".product-card");
            const id = card.dataset.id;

            wishlist = wishlist.filter(item => item.id !== id);
            localStorage.setItem("wishlist", JSON.stringify(wishlist));

            card.remove();
            const countEl = document.querySelector(".wishlist-count");
            countEl.textContent = `Wishlist (${wishlist.length})`;


            // Nếu xóa hết hiện empty message
            if (wishlist.length === 0) {
                wishlistContainer.innerHTML = "<p>Wishlist is empty.</p>";
            }
        });
    });
});
//  JUST FOR YOU 
const jfyContainer = document.querySelector(".jfy-products");

function resolveImgPath(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("./")) return `../${path.slice(2)}`;
  if (path.startsWith("/")) return `..${path}`;
  if (path.startsWith("img/")) return `../${path}`;
  return path;
}

function renderJFY() {
  if (!jfyContainer) return;

  let jfy = JSON.parse(localStorage.getItem("justForYou")) || [];

  // nếu  trước đó lưu 1 object thì convert về array
  if (!Array.isArray(jfy)) jfy = [jfy];

  if (jfy.length === 0) {
    jfyContainer.innerHTML = "<p>Just For You is empty.</p>";
    return;
  }

  jfyContainer.innerHTML = jfy
    .map((item) => {
      const imagePath = resolveImgPath(item.img);

      return `
  <div class="product-card" data-id="${item.id}">
    <div class="product-top-1">

      <!-- ICON REMOVE -->
      <div class="action-icons-1">
        <button class="icon-btn-1 jfy-remove-btn" type="button" title="Remove">
          <img src="/img/icon-delete.png" alt="Remove">
        </button>
      </div>

      <div class="picture-1">
        <img src="${imagePath}" alt="${item.name}">
      </div>

      <button class="add-to-cart-1" type="button">
        <img src="/img/Cart1.png" alt=""> Add To Cart
      </button>

    </div>

    <div class="content-1">
      <p class="product-name-1">${item.name}</p>
      <span class="price-new-1">$${item.price}</span>
    </div>
  </div>
`;

    })
    .join("");
}

// remove sản phẩm  JFY 
jfyContainer?.addEventListener("click", (e) => {
  const btn = e.target.closest(".jfy-remove-btn");
  if (!btn) return;

  const card = btn.closest(".product-card");
  const id = card?.dataset?.id;
  if (!id) return;

  let jfy = JSON.parse(localStorage.getItem("justForYou")) || [];
  if (!Array.isArray(jfy)) jfy = [jfy];

  jfy = jfy.filter((item) => item.id !== id);
  localStorage.setItem("justForYou", JSON.stringify(jfy));

  renderJFY();
});

document.addEventListener("DOMContentLoaded", () => {
  renderJFY();
});
