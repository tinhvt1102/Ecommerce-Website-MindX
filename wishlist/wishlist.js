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
        <div class="product-card">
            <div class="product-top-1">
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

    // XÓA KHỎI WISHLIST
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const card = btn.closest(".product-card");
            const id = card.dataset.id;

            wishlist = wishlist.filter(item => item.id !== id);
            localStorage.setItem("wishlist", JSON.stringify(wishlist));

            card.remove();
        });
    });
});
