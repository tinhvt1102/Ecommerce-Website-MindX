// Profile
document.addEventListener("DOMContentLoaded", () => {
    // 1. LẤY DỮ LIỆU TỪ LOCALSTORAGE
    let userAccount = JSON.parse(localStorage.getItem("userAccount")) || {};

    // 2. HIỂN THỊ TÊN LÊN PHẦN WELCOME
    const displayUserName = document.getElementById("display-user-name");
    if (displayUserName) {
        displayUserName.textContent = userAccount.name || "Guest";
    }

    // 3. TỰ ĐỘNG ĐIỀN THÔNG TIN VÀO FORM (NẾU CÓ)
    const form = document.getElementById("edit-profile-form");
    if (form) {
        const inputs = form.querySelectorAll("input");
        // Gán giá trị mặc định dựa trên placeholder hoặc dữ liệu lưu trữ
        if (userAccount.name) inputs[0].value = userAccount.name;
        if (userAccount.email) inputs[1].value = userAccount.email;
        if (userAccount.address) inputs[2].value = userAccount.address;
        // 4. XỬ LÝ SỰ KIỆN LƯU THAY ĐỔI (SAVE CHANGES)
        form.addEventListener("submit", (e) => {
            e.preventDefault(); // Ngăn trang web load lại

            // Cập nhật đối tượng user mới từ input
            const fullname = inputs[0].value;
            const email = inputs[1].value;
            const address = inputs[2].value;

            const currentPassword = inputs[3].value;
            const newPass = inputs[4].value;
            const confirmPass = inputs[5].value;

            if (newPass || confirmPass) {
                if (!currentPassword) {
                    alert("Vui lòng nhập mật khẩu hiện tại để thực hiện thay đổi!");
                    window.location.reload();
                    return;
                }
                if (currentPassword !== userAccount.password) {
                    alert("Mật khẩu hiện tại không chính xác!");
                    window.location.reload();
                    return;
                }
                if (newPass !== confirmPass) {
                    alert("Xác nhận mật khẩu mới không khớp!");
                    window.location.reload();
                    return;
                }
                userAccount.password = newPass;
            }

            userAccount.name = fullname;
            userAccount.email = email;
            userAccount.address = address;

            // Lưu vào LocalStorage
            localStorage.setItem("userAccount", JSON.stringify(userAccount));
            alert("Đã cập nhật thông tin thành công!");
            window.location.reload();
        });

        // 5. NÚT CANCEL - RESET LẠI FORM
        const btnCancel = form.querySelector(".btn-cancel");
        if (btnCancel) {
            btnCancel.addEventListener("click", () => {
                if (confirm("Bạn có muốn hủy các thay đổi chưa lưu?")) {
                    window.location.reload();
                }
            });
        }
    }
});

// load trang sidebar
document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".account-sidebar a");
    const sections = document.querySelectorAll(".content-section");

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            const text = link.innerText.trim();
            let targetId= "";
            if (text === "My Profile") targetId ="my-profile";
            if (text === "Address Book") targetId ="address-book";            
            if (targetId) {
                 e.preventDefault();
            
                // Xóa active cũ
                links.forEach(l => l.classList.remove("active"));
                sections.forEach(s => s.classList.remove("active"));

                // Thêm active mới
                link.classList.add("active");
                document.getElementById(targetId).classList.add("active");
                
                if (targetId === "address-book") renderAddresses();            }
        });
    });
});

// 1. Quản lý dữ liệu địa chỉ toàn cục
let addresses = JSON.parse(localStorage.getItem("userAddresses")) || [
    { id: 1, name: "Md Rimel", address: "Kingston, 5236, United State", phone: "(+880) 1234-56789", isDefault: true }
];

let editId = null; // Biến dùng để kiểm tra đang Sửa (id) hay Thêm mới (null)

// 2. Hàm hiển thị danh sách địa chỉ (Đã thêm nút Sửa)
function renderAddresses() {
    const grid = document.querySelector(".address-grid");
    if (!grid) return;

    grid.innerHTML = addresses.map(addr => `
        <div class="address-card ${addr.isDefault ? 'default' : ''}">
            <div class="card-header">
                ${addr.isDefault ? '<span class="badge">Default</span>' : '<span></span>'}
                <div class="card-actions">
                    <button class="btn-icon" onclick="editAddress(${addr.id})">✏️</button>
                    <button class="btn-icon" onclick="deleteAddress(${addr.id})">🗑️</button>
                </div>
            </div>
            <p><strong>${addr.name}</strong></p>
            <p>${addr.address}</p>
            <p>${addr.phone}</p>
        </div>
    `).join('');
}

// 3. Hàm mở Modal để Sửa địa chỉ
window.editAddress = (id) => {
    const addr = addresses.find(a => a.id === id);
    if (!addr) return;

    editId = id; // Gán ID đang sửa vào biến toàn cục
    
    // Thay đổi giao diện Modal cho phù hợp với việc chỉnh sửa
    const modal = document.getElementById("address-modal");
    document.querySelector("#address-modal h3").textContent = "Edit Address";
    
    // Đổ dữ liệu cũ vào các ô input
    document.getElementById("new-addr-name").value = addr.name;
    document.getElementById("new-addr-detail").value = addr.address;
    document.getElementById("new-addr-phone").value = addr.phone;

    modal.style.display = "block";
};

// 4. Hàm xóa địa chỉ
window.deleteAddress = (id) => {
    if(confirm("Are you sure you want to delete this address?")) {
        addresses = addresses.filter(a => a.id !== id);
        localStorage.setItem("userAddresses", JSON.stringify(addresses));
        renderAddresses();
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // --- PHẦN 1: LOGIC CHUYỂN TAB (Giữ nguyên của bạn) ---
    const links = document.querySelectorAll(".account-sidebar a");
    const sections = document.querySelectorAll(".content-section");

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("data-target") || (link.innerText.trim() === "My Profile" ? "my-profile" : "");
            if (targetId) {
                e.preventDefault();
                links.forEach(l => l.classList.remove("active"));
                sections.forEach(s => s.classList.remove("active"));
                link.classList.add("active");
                const targetSection = document.getElementById(targetId);
                if(targetSection) targetSection.classList.add("active");
                if(targetId === "address-book") renderAddresses();
            }
        });
    });

    // --- PHẦN 2: LOGIC MODAL (Đã sửa để dùng chung Thêm/Sửa) ---
    const modal = document.getElementById("address-modal");
    const btnAdd = document.querySelector(".btn-add"); 
    const btnClose = document.getElementById("close-modal");
    const addForm = document.getElementById("add-address-form");

    if(btnAdd) {
        btnAdd.onclick = () => {
            editId = null; // Khi nhấn Add New thì reset về null
            addForm.reset(); // Xóa trắng form
            document.querySelector("#address-modal h3").textContent = "Add New Address";
            modal.style.display = "block";
        };
    }

    if(btnClose) btnClose.onclick = () => modal.style.display = "none";

    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = "none";
    }

    if(addForm) {
        addForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("new-addr-name").value;
            const addressText = document.getElementById("new-addr-detail").value;
            const phone = document.getElementById("new-addr-phone").value;

            if (editId) {
                // LOGIC CHỈNH SỬA: Tìm vị trí địa chỉ cũ và ghi đè
                const index = addresses.findIndex(a => a.id === editId);
                addresses[index] = { ...addresses[index], name, address: addressText, phone };
            } else {
                // LOGIC THÊM MỚI
                const newAddress = {
                    id: Date.now(),
                    name: name,
                    address: addressText,
                    phone: phone,
                    isDefault: false
                };
                addresses.push(newAddress);
            }

            // Lưu dữ liệu và cập nhật giao diện
            localStorage.setItem("userAddresses", JSON.stringify(addresses));
            addForm.reset();
            modal.style.display = "none";
            renderAddresses();
        });
    }

    renderAddresses();
});