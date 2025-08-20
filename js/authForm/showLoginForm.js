function showLoginForm() {
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    signupForm.style.display = "none";
    loginForm.style.display = "block";
}

export default showLoginForm;