document.addEventListener("DOMContentLoaded", function () {
    // Lấy các phần tử từ HTML
    const btnVerify = document.getElementById("btn-verify");
    const forgotForm = document.getElementById("forgot-form");
    const stepVerify = document.getElementById("step-verify");
    const stepReset = document.getElementById("step-reset");

    // Lấy tài khoản duy nhất đang lưu trong LocalStorage
    const storedUser = JSON.parse(localStorage.getItem("userAccount"));

    // BƯỚC 1: KIỂM TRA EMAIL KHI NHẤN CONTINUE
    if (btnVerify) {
        btnVerify.addEventListener("click", function () {
            const emailInput = document.getElementById("reset-email").value.trim();

            if (!storedUser) {
                alert("Không tìm thấy tài khoản nào. Vui lòng đăng ký trước!");
                return;
            }

            // So sánh email nhập vào với email trong LocalStorage
            if (emailInput === storedUser.email) {
                // Nếu khớp, ẩn phần nhập email và hiện phần nhập mật khẩu mới
                stepVerify.style.display = "none";
                stepReset.style.display = "block";
            } else {
                alert("Email này không khớp với tài khoản đã đăng ký!");
            }
        });
    }

    // BƯỚC 2: XỬ LÝ KHI NHẤN SAVE CHANGES (SUBMIT FORM)
    if (forgotForm) {
        forgotForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Chặn load lại trang

            const newPass = document.getElementById("new-password").value;
            const confirmPass = document.getElementById("confirm-password").value;

            if (newPass !== confirmPass) {
                alert("Mật khẩu xác nhận không khớp!");
                return;
            }

            // Cập nhật mật khẩu mới vào đối tượng user
            storedUser.password = newPass;

            // Lưu đè lại vào LocalStorage
            localStorage.setItem("userAccount", JSON.stringify(storedUser));

            alert("Đã thay đổi mật khẩu thành công! Hãy đăng nhập lại.");
            
            // Chuyển hướng về trang Login
            window.location.href = "/login-feature/login.html"; 
        });
    }
});