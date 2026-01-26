document.addEventListener("DOMContentLoaded", function () {
    const btnLogin = document.getElementById("btn-login");

    if (btnLogin) {
        btnLogin.addEventListener("click", function (e) {
            e.preventDefault();
            const emailInput = document.getElementById("login-email").value;
            const passInput = document.getElementById("login-pass").value;
            const storedUser = JSON.parse(localStorage.getItem("userAccount"));
            if (!storedUser) {
                alert("The account does not exist. Please register first!");
                window.location.href = "/signup-feature/signup.html";
                return;
            }
            if (emailInput === storedUser.email && passInput === storedUser.password) {
                alert("Login successful! Welcome back "+storedUser.name);
                localStorage.setItem("isLoggedIn", "true");
                window.location.href = "/index.html";
            } else {
                alert("Incorrect email or password. Please try again!");
            }
        });
    }
});