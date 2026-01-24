// --- 1. DỮ LIỆU TOÀN CỤC ---
let userAccount = JSON.parse(localStorage.getItem("userAccount")) || {};
let addresses = JSON.parse(localStorage.getItem("userAddresses")) || [
    { id: 1, name: "Md Rimel", address: "Kingston, 5236, United State", phone: "(+880) 1234-56789", isDefault: true }
];
let editId = null;

// --- 2. HIỂN THỊ THÔNG TIN CƠ BẢN ---
function initProfile() {
    const displayUserName = document.getElementById("display-user-name");
    if (displayUserName) displayUserName.textContent = userAccount.name || "Guest";

    const form = document.getElementById("edit-profile-form");
    if (form) {
        const inputs = form.querySelectorAll("input");
        if (userAccount.name) inputs[0].value = userAccount.name;
        if (userAccount.email) inputs[1].value = userAccount.email;
        if (userAccount.address) inputs[2].value = userAccount.address;
    }
}

// --- 3. QUẢN LÝ ĐỊA CHỈ (ADDRESS BOOK) ---
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

window.editAddress = (id) => {
    const addr = addresses.find(a => a.id === id);
    if (!addr) return;
    editId = id;
    const modal = document.getElementById("address-modal");
    document.querySelector("#address-modal h3").textContent = "Edit Address";
    document.getElementById("new-addr-name").value = addr.name;
    document.getElementById("new-addr-detail").value = addr.address;
    document.getElementById("new-addr-phone").value = addr.phone;
    modal.style.display = "block";
};

window.deleteAddress = (id) => {
    if(confirm("Are you sure you want to delete this address?")) {
        addresses = addresses.filter(a => a.id !== id);
        localStorage.setItem("userAddresses", JSON.stringify(addresses));
        renderAddresses();
    }
};

// --- 4. LOGIC CHÍNH KHI LOAD TRANG ---
document.addEventListener("DOMContentLoaded", () => {
    initProfile();
    renderAddresses();

    // --- A. ĐIỀU HƯỚNG SIDEBAR ---
    const links = document.querySelectorAll(".account-sidebar a");
    const sections = document.querySelectorAll(".content-section");

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            const text = link.innerText.trim();
            let targetId = link.getAttribute("data-target"); // Ưu tiên lấy từ data-target

            // Fallback nếu không có data-target
            if (!targetId) {
                if (text === "My Profile") targetId = "my-profile";
                if (text === "Address Book") targetId = "address-book";
                if (text === "Change Password") targetId = "change-password";
            }

            if (targetId && document.getElementById(targetId)) {
                e.preventDefault();
                links.forEach(l => l.classList.remove("active"));
                sections.forEach(s => s.classList.remove("active"));
                link.classList.add("active");
                document.getElementById(targetId).classList.add("active");
                if (targetId === "address-book") renderAddresses();
            }
        });
    });

    // --- B. FORM CẬP NHẬT PROFILE (Không bao gồm mật khẩu) ---
    const profileForm = document.getElementById("edit-profile-form");
    if (profileForm) {
        profileForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const inputs = profileForm.querySelectorAll("input");
            userAccount.name = inputs[0].value;
            userAccount.email = inputs[1].value;
            userAccount.address = inputs[2].value;

            localStorage.setItem("userAccount", JSON.stringify(userAccount));
            alert("Updated profile successfully!");
            location.reload();
        });
    }

    // --- C. FORM ĐỔI MẬT KHẨU (CHANGE PASSWORD) ---
    const changePassForm = document.getElementById("change-password-form");
    if (changePassForm) {
        changePassForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const currentPass = document.getElementById("current-password").value;
            const newPass = document.getElementById("new-password").value;
            const confirmPass = document.getElementById("confirm-password").value;

            if (currentPass !== userAccount.password) {
                alert("Current password is incorrect!");
                return;
            }
            if (newPass !== confirmPass) {
                alert("New passwords do not match!");
                return;
            }
            
            userAccount.password = newPass;
            localStorage.setItem("userAccount", JSON.stringify(userAccount));
            alert("Password changed successfully!");
            changePassForm.reset();
        });
    }

    // --- D. LOGIC MODAL ĐỊA CHỈ ---
    const modal = document.getElementById("address-modal");
    const btnAdd = document.querySelector(".btn-add");
    const btnClose = document.getElementById("close-modal");
    const addForm = document.getElementById("add-address-form");

    if (btnAdd) {
        btnAdd.onclick = () => {
            editId = null;
            addForm.reset();
            document.querySelector("#address-modal h3").textContent = "Add New Address";
            modal.style.display = "block";
        };
    }
    if (btnClose) btnClose.onclick = () => modal.style.display = "none";
    
    if (addForm) {
        addForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("new-addr-name").value;
            const addressText = document.getElementById("new-addr-detail").value;
            const phone = document.getElementById("new-addr-phone").value;

            if (editId) {
                const index = addresses.findIndex(a => a.id === editId);
                addresses[index] = { ...addresses[index], name, address: addressText, phone };
            } else {
                addresses.push({ id: Date.now(), name, address: addressText, phone, isDefault: false });
            }
            localStorage.setItem("userAddresses", JSON.stringify(addresses));
            modal.style.display = "none";
            renderAddresses();
        });
    }
});