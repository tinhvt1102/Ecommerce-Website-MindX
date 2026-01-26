document.addEventListener("DOMContentLoaded", function () {
    const btnVerify = document.getElementById("btn-verify");
    const forgotForm = document.getElementById("forgot-form");
    const stepVerify = document.getElementById("step-verify");
    const stepReset = document.getElementById("step-reset");

    const storedUser = JSON.parse(localStorage.getItem("userAccount"));
    if (btnVerify) {
        btnVerify.addEventListener("click", function () {
            const emailInput = document.getElementById("reset-email").value.trim();
            if (!storedUser) {
                alert("The account does not exist. Please register first!");
                return;
            }
            if (emailInput === storedUser.email) {
                stepVerify.style.display = "none";
                stepReset.style.display = "block";
            } else {
                alert("This email does not match the registered account!");
            }
        });
    }

    // XỬ LÝ KHI NHẤN SAVE CHANGES
    if (forgotForm) {
        forgotForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const newPass = document.getElementById("new-password").value;
            const confirmPass = document.getElementById("confirm-password").value;
            if (newPass !== confirmPass) {
                alert("New passwords do not match!");
                return;
            }
            storedUser.password = newPass;
            localStorage.setItem("userAccount", JSON.stringify(storedUser));
            alert("Password changed successfully! Please log in again.");
            window.location.href = "/login-feature/login.html"; 
        });
    }
});