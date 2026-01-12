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
// document.addEventListener("DOMContentLoaded", function () {
//     loadHTML("header.html", "header-placeholder");
//     loadHTML("footer.html", "footer-placeholder");
//     if (window.location.pathname.includes("signup.html")) {
//     }
// });

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
document.addEventListener("DOMContentLoaded", function () {
    // Load Header và truyền hàm initHeaderLogic vào để chạy sau cùng
    loadHTML("/reuseable/header.html", "header-placeholder", initHeaderLogic);

    loadHTML("/reuseable/footer.html", "footer-placeholder");

    if (window.location.pathname.includes("../signup-feature/signup.html")) {
        // Logic cho trang signup
    }
});
// ===== Right-Left =====

// 1. Chọn danh sách sản phẩm (khung chứa các card)
const productContainer = document.querySelector('.product');

// 2. Chọn 2 nút mũi tên
const btnLeft = document.querySelector('.left');
const btnRight = document.querySelector('.right');

// 3. Xử lý khi bấm nút Right (Tiến tới)
btnRight.addEventListener('click', () => {
    // Cuộn sang phải một khoảng bằng độ rộng của 1 card (270px) + gap (30px)
    productContainer.scrollLeft += 300;
});

// 4. Xử lý khi bấm nút Left (Lùi lại)
btnLeft.addEventListener('click', () => {
    // Cuộn sang trái
    productContainer.scrollLeft -= 300;
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
            // Lấy thông tin từ thẻ cha (product-card)
            const productCard = btn.closest('.product-card');
            // Tìm sale trong card (nếu có)
            const saleEl = productCard.querySelector('[class^="sale-tag"]');
            const product = {
                id: productCard.dataset.id,
                name: productCard.dataset.name,
                price: productCard.dataset.price,
                img: productCard.dataset.img,
                sale: saleEl ? saleEl.innerText.replace('%', '').replace('-', '') : null
                
            };

            // Lấy danh sách wishlist hiện tại từ LocalStorage (nếu chưa có thì tạo mảng rỗng)
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

            // Kiểm tra xem sản phẩm đã có trong wishlist chưa
            const index = wishlist.findIndex(item => item.id === product.id);

            if (index === -1) {
                // Chưa có -> Thêm vào
                wishlist.push(product);
                btn.style.backgroundColor = '#DB4444'; // Tô đỏ nút ngay lập tức
                btn.querySelector('img').style.filter = 'brightness(0) invert(1)';
                alert("Đã thêm vào Wishlist!");
                localStorage.setItem('wishlist', JSON.stringify(wishlist));

                // 👉 CHUYỂN SANG TRANG WISHLIST
                // window.location.href = './wishlist/wishlist.html';

            } else {
                // Có rồi -> Xóa ra (Bỏ yêu thích)
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
document.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();

        const productCard = btn.closest(".product-card");
        if (!productCard) return;

        const product = {
            id: productCard.dataset.id,
            name: productCard.dataset.name,
            price: productCard.dataset.price,
            img: productCard.dataset.img
        };

        // Lưu product để Just For You dùng
        localStorage.setItem("justForYou", JSON.stringify(product));

        // Chuyển sang wishlist.html
        window.location.href = "./wishlist/wishlist.html";
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const viewBtns = document.querySelectorAll(".view-btn");

    viewBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const productCard = btn.closest(".product-card");
            if (!productCard) return;

            // Lấy sale nếu có
            const saleEl = productCard.querySelector('[class^="sale-tag"]');

            const product = {
                id: productCard.dataset.id,
                name: productCard.dataset.name,
                price: productCard.dataset.price,
                img: productCard.dataset.img,
                sale: saleEl ? saleEl.innerText.replace('%', '').replace('-', '') : null
            };

            let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

            const exists = wishlist.some(item => item.id === product.id);

            if (!exists) {
                wishlist.push(product);
                localStorage.setItem("wishlist", JSON.stringify(wishlist));

                alert("Đã thêm vào Wishlist!");
            } else {
                alert("Sản phẩm đã có trong Wishlist!");
            }

            // 👉 CHUYỂN SANG TRANG WISHLIST
            window.location.href = "./wishlist/wishlist.html";
        });
    });
});

