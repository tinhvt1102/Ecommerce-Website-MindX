document.addEventListener("DOMContentLoaded", function () {
    const btnLogin = document.getElementById("btn-login");

    if (btnLogin) {
        btnLogin.addEventListener("click", function (e) {
            e.preventDefault(); // Không cho trang load lại

            // 1. Lấy thông tin người dùng vừa nhập vào form Login
            const emailInput = document.getElementById("login-email").value;
            const passInput = document.getElementById("login-pass").value;

            // 2. Lấy dữ liệu đã lưu trong LocalStorage từ bước Signup
            const storedUser = JSON.parse(localStorage.getItem("userAccount"));

            // 3. Kiểm tra logic
            if (!storedUser) {
                alert("Tài khoản không tồn tại. Vui lòng đăng ký trước!");
                window.location.href = "signup.html";
                return;
            }

            if (emailInput === storedUser.email && passInput === storedUser.password) {
                // Đăng nhập đúng
                alert("Đăng nhập thành công! Chào mừng " + storedUser.name + " quay trở lại.");
                
                // Lưu trạng thái đã đăng nhập (để Header hiển thị tên bạn chẳng hạn)
                localStorage.setItem("isLoggedIn", "true");
                
                // Chuyển về trang chủ
                window.location.href = "index.html";
            } else {
                // Đăng nhập sai
                alert("Email hoặc mật khẩu không đúng. Thử lại nhé!");
            }
        });
    }
});