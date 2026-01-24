document.addEventListener("DOMContentLoaded", function () {
    const btnSignup = document.getElementById("btn-signup");

    if (btnSignup) {
        btnSignup.addEventListener("click", function (e) {
            e.preventDefault(); // Chặn trang web load lại

            // 1. Lấy dữ liệu từ các ô Input
            const name = document.getElementById("signup-name").value.trim();
            const email = document.getElementById("signup-email").value.trim();
            const pass = document.getElementById("signup-pass").value;

            // Kiểm tra xem dữ liệu có trống không
            if (name === "" || email === "" || pass === "") {
                alert("Vui lòng điền đẩy đủ thông tin");
                return;
            }
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert("Định dạng Email không hợp lệ! Vui lòng kiểm tra lại.");
                return;
            }
            // 2. Tạo đối tượng người dùng
            const userData = {
                name: name,
                email: email,
                password: pass
            };

            // 3. Lưu vào LocalStorage
            localStorage.setItem("userAccount", JSON.stringify(userData));

            console.log("Đã lưu thành công:", userData);
            alert("Đăng ký thành công rồi!");

            // 4. Chuyển hướng sang trang Login
            window.location.href = "/login-feature/login.html"; 
        });
    }
});