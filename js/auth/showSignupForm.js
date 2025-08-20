function showSignupForm() {
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    signupForm.style.display = "block";
    loginForm.style.display = "none";
}

export default showSignupForm;