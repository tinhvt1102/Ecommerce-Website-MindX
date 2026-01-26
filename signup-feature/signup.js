document.addEventListener("DOMContentLoaded", function () {
    const btnSignup = document.getElementById("btn-signup");
    if (btnSignup) {
        btnSignup.addEventListener("click", function (e) {
            e.preventDefault();
            const name = document.getElementById("signup-name").value.trim();
            const email = document.getElementById("signup-email").value.trim();
            const pass = document.getElementById("signup-pass").value;
            if (name === "" || email === "" || pass === "") {
                alert("Please fill in all the information");
                return;
            }
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert("Invalid email format! Please check again.");
                return;
            }
            const userData = {
                name: name,
                email: email,
                password: pass
            };
            localStorage.setItem("userAccount", JSON.stringify(userData));
            console.log("Saved:", userData);
            alert("Registration successful!");
            window.location.href = "/login-feature/login.html"; 
        });
    }
});