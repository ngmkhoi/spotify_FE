import httpRequest from "./utils/httpRequest.js";
import { validateSignup, validateEmail, validateField } from './utils/validation.js';

// Auth Modal Functionality
document.addEventListener("DOMContentLoaded", function () {
    // Get DOM elements
    const signupBtn = document.querySelector(".signup-btn");
    const loginBtn = document.querySelector(".login-btn");
    const authModal = document.getElementById("authModal");
    const modalClose = document.getElementById("modalClose");
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    const showLoginBtn = document.getElementById("showLogin");
    const showSignupBtn = document.getElementById("showSignup");
    const authButtons = document.querySelector('.auth-buttons');
    const userAvatar = document.getElementById("userAvatar");
    const userDropdown = document.getElementById("userDropdown");
    const userGreeting = document.getElementById("userGreeting");

    const signupFormElement = signupForm?.querySelector('.auth-form-content');
    const signupEmailInput = document.getElementById('signupEmail');
    const signupPasswordInput = document.getElementById('signupPassword');
    const signupConfirmPasswordInput = document.getElementById('signupConfirmPassword');
    const signupEmailFormGroup = signupEmailInput?.closest('.form-group');
    const signupPasswordFormGroup = signupPasswordInput?.closest('.form-group');
    const signupConfirmPasswordFormGroup = signupConfirmPasswordInput?.closest('.form-group');

    const loginFormElement = loginForm?.querySelector('.auth-form-content');
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginEmailFormGroup = loginEmailInput?.closest('.form-group');
    const loginPasswordFormGroup = loginPasswordInput?.closest('.form-group');

    // Function to sanitize input
    function sanitizeInput(input) {
    return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    
    // Function to show Toast message
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; padding: 12px 24px;
            background: ${type === 'success' ? '#1db954' : '#f87171'};
            color: white; border-radius: 8px; z-index: 100;
            opacity: 0; transition: opacity 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 100);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Function to update header UI
    async function updateHeader() {
    const token = localStorage.getItem('access_token');
    let user = JSON.parse(localStorage.getItem('current_user')); // Kiểm tra user trong localStorage trước

    if (token && !user) {
        try {
            const response = await httpRequest.get('users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            user = response.user || response;
            // Sanitize trước khi lưu
            user.email = sanitizeInput(user.email || 'User');
            user.avatar_url = sanitizeInput(user.avatar_url || './icon/person-circle.svg');
            localStorage.setItem('current_user', JSON.stringify(user));
        } catch (error) {
            console.error('Lỗi khi lấy thông tin user:', error.message);
            localStorage.removeItem('current_user');
        }
    }

    if (token && user) {
        const displayName = sanitizeInput(user.email || 'User');
        const avatarUrl = sanitizeInput(user.avatar_url || './icon/person-circle.svg');

        authButtons.style.display = 'none';
        userAvatar.style.display = 'block';

        // Tạo img thay vì innerHTML
        const img = document.createElement('img');
        img.src = avatarUrl;
        img.alt = displayName;
        img.style.width = '32px';
        img.style.height = '32px';
        img.style.borderRadius = '50%';
        userAvatar.innerHTML = '';
        userAvatar.appendChild(img);

        userAvatar.title = `Xin chào ${displayName}`;
            if (userGreeting) {
                userGreeting.textContent = `Xin chào ${displayName}`;
                userGreeting.classList.remove('hidden');
            }
        } else {
            authButtons.style.display = 'flex';
            userAvatar.style.display = 'none';
            if (userGreeting) userGreeting.classList.add('hidden');
        }
    }

    // Function to show signup form
    function showSignupForm() {
        signupForm.style.display = "block";
        loginForm.style.display = "none";
    }

    // Function to show login form
    function showLoginForm() {
        signupForm.style.display = "none";
        loginForm.style.display = "block";
    }

    // Function to open modal
    function openModal() {
        authModal.classList.add("show");
        document.body.style.overflow = "hidden";
    }

    // Close modal function
    function closeModal() {
        authModal.classList.remove("show");
        document.body.style.overflow = "auto";
    }

    //Clear forms
    function clearForm(formElement) {
        // Xóa giá trị các input
        const inputs = formElement.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
        });

        // Xóa trạng thái lỗi
        const formGroups = formElement.querySelectorAll('.form-group');
        formGroups.forEach(formGroup => {
            formGroup.classList.remove('invalid');
            const errorSpan = formGroup.querySelector('.error-message span');
            if (errorSpan) {
                errorSpan.textContent = '';
            }
        });
    }

    // Open modal with Sign Up form
    signupBtn?.addEventListener("click", function () {
        showSignupForm();
        openModal();
    });

    // Open modal with Login form
    loginBtn?.addEventListener("click", function () {
        showLoginForm();
        openModal();
    });

    // Close modal when clicking close button
    modalClose?.addEventListener("click", closeModal);

    // Close modal when clicking overlay
    authModal?.addEventListener("click", function (e) {
        if (e.target === authModal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && authModal?.classList.contains("show")) {
            closeModal();
        }
    });

    // Switch to Login form
    showLoginBtn?.addEventListener("click", function () {
        showLoginForm();
    });

    // Switch to Signup form
    showSignupBtn?.addEventListener("click", function () {
        showSignupForm();
    });

    // Signup Form Validation
    // Xóa class invalid ban đầu
    signupEmailFormGroup.classList.remove('invalid');
    signupPasswordFormGroup.classList.remove('invalid');
    signupConfirmPasswordFormGroup.classList.remove('invalid');

    // Validate thời gian thực khi blur
    signupEmailInput.addEventListener('blur', () => validateField(signupEmailInput, 'signup'));
    signupPasswordInput.addEventListener('blur', () => validateField(signupPasswordInput, 'signup'));
    signupConfirmPasswordInput.addEventListener('blur', () => validateField(signupConfirmPasswordInput, 'signup', signupPasswordInput.value));

    // Xử lý submit signup
    signupFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();

        const isEmailValid = validateField(signupEmailInput, 'signup');
        const isPasswordValid = validateField(signupPasswordInput, 'signup');
        const isConfirmPasswordValid = validateField(signupConfirmPasswordInput, 'signup', signupPasswordInput.value);

        if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
            return;
        }

        const credential = {
            email: signupEmailInput.value,
            password: signupPasswordInput.value,
        };

        try {
            const { user, access_token } = await httpRequest.post('auth/register', credential);
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('current_user', JSON.stringify(user));

            // Tự động đăng nhập
            const loginResponse = await httpRequest.post('auth/login', {
                email: credential.email,
                password: credential.password
            });
            
            localStorage.setItem('access_token', loginResponse.access_token);
            localStorage.setItem('current_user', JSON.stringify(loginResponse.user || user));

            // Cập nhật header UI
            await updateHeader();

            // Xóa form và trạng thái lỗi
            clearForm(signupFormElement);

            // Hiển thị Toast và đóng modal
            showToast('Đăng ký thành công!', 'success');
            closeModal();
        } catch (error) {
            const errorMessage = error.response?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
            signupEmailFormGroup.classList.add('invalid');
            signupEmailFormGroup.querySelector('.error-message span').textContent = errorMessage;
        }
    });

    // Login Form Validation
    // Xóa class invalid ban đầu
    loginEmailFormGroup.classList.remove('invalid');
    loginPasswordFormGroup.classList.remove('invalid');

    // Validate thời gian thực khi blur
    loginEmailInput.addEventListener('blur', () => validateField(loginEmailInput, 'login'));
    loginPasswordInput.addEventListener('blur', () => validateField(loginPasswordInput, 'login'));

    // Xử lý submit login
    loginFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();

        const isEmailValid = validateField(loginEmailInput, 'login');
        const isPasswordValid = validateField(loginPasswordInput, 'login');

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        const credential = {
            email: loginEmailInput.value,
            password: loginPasswordInput.value
        };

        try{
            const loginResponse = await httpRequest.post('auth/login', credential);
            localStorage.setItem('access_token', loginResponse.access_token);

            const userRespone = await httpRequest.get('users/me', {
                headers: { Authorization: `Bearer ${loginResponse.access_token}` }
            })
            const user = userRespone.user || userRespone;
            localStorage.setItem('current_user', JSON.stringify(user));

            await updateHeader();

            // Xóa form và trạng thái lỗi
            clearForm(loginFormElement);

            showToast('Đăng nhập thành công!', 'success');
            
            closeModal();
        }catch (error) {
            const errorMessage = error.response?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
        // Hiển thị lỗi cụ thể, giả sử API trả về message chứa 'email' hoặc 'password'
        if (errorMessage.toLowerCase().includes('email')) {
            loginEmailFormGroup.classList.add('invalid');
            loginEmailFormGroup.querySelector('.error-message span').textContent = 'Email không tồn tại';
        } else if (errorMessage.toLowerCase().includes('password')) {
            loginPasswordFormGroup.classList.add('invalid');
            loginPasswordFormGroup.querySelector('.error-message span').textContent = 'Mật khẩu không đúng';
        } else {
            // Lỗi chung, hiển thị ở cả hai
            loginEmailFormGroup.classList.add('invalid');
            loginPasswordFormGroup.classList.add('invalid');
            loginEmailFormGroup.querySelector('.error-message span').textContent = errorMessage;
        }
        }
    })

    // User Menu Dropdown Functionality
    userAvatar?.addEventListener("click", function (e) {
        e.stopPropagation();
        userDropdown.classList.toggle("show");
    });

    document.addEventListener("click", function (e) {
        if (!userAvatar?.contains(e.target) && !userDropdown?.contains(e.target)) {
            userDropdown.classList.remove("show");
        }
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && userDropdown?.classList.contains("show")) {
            userDropdown.classList.remove("show");
        }
    });

    //Logout Button Functionality
    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn?.addEventListener("click", async function () {
        userDropdown.classList.remove("show");
        localStorage.clear();
        await updateHeader();
        showToast('Đăng xuất thành công!', 'success');
    });

    // Khởi tạo header
    updateHeader();
});

// Other functionality
document.addEventListener("DOMContentLoaded", async function () {
    try {
        const { artists } = await httpRequest.get('artists');
        console.log(artists);
    } catch (error) {
        console.error('Error fetching artists:', error.message);
        alert('Không thể lấy danh sách nghệ sĩ!');
    }
});