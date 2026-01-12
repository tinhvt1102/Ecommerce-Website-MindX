document.addEventListener("DOMContentLoaded", () => {
    const wishlistContainer = document.querySelector(".wishlist-list");

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

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
                            <img src="../img/icon-delete.png" alt="Remove">
                        </button>
                    </div>

                    <div class="picture-1">
                        <img src="${imagePath}" alt="${item.name}">
                    </div>

                </div>

                <div class="content-1">
                    <p class="product-name-1">${item.name}</p>
                    <span class="price-new-1">${item.price}</span>
                </div>
            </div>
        `;
    }).join("");

    /* ===== REMOVE WISHLIST ITEM ===== */
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".product-card");
            const id = card.dataset.id;

            wishlist = wishlist.filter(item => item.id !== id);
            localStorage.setItem("wishlist", JSON.stringify(wishlist));

            card.remove();
            const countEl = document.querySelector(".wishlist-count");
countEl.textContent = `Wishlist (${wishlist.length})`;


            // Nếu xóa hết → hiện empty message
            if (wishlist.length === 0) {
                wishlistContainer.innerHTML = "<p>Wishlist is empty.</p>";
            }
        });
    });
});
// ===== JUST FOR YOU =====
const jfyContainer = document.querySelector(".just-for-you");
const jfyData = JSON.parse(localStorage.getItem("justForYou"));

if (jfyData && jfyContainer) {
    const imagePath = jfyData.img.startsWith('./')
        ? `../${jfyData.img.slice(2)}`
        : jfyData.img;

    jfyContainer.innerHTML = `
        <div class="product-card">
            <div class="product-top-1">
                <div class="picture-1">
                    <img src="${imagePath}" alt="${jfyData.name}">
                </div>

                <button class="add-to-cart-1">
                    <img src="../img/Cart1.png" alt=""> Add To Cart
                </button>
            </div>

            <div class="content-1">
                <p class="product-name-1">${jfyData.name}</p>
                <span class="price-new-1">${jfyData.price}</span>
            </div>
        </div>
    `;

    // Scroll mượt xuống Just For You
    setTimeout(() => {
        jfyContainer.scrollIntoView({ behavior: "smooth" });
    }, 300);
}
