export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return { valid: false, message: 'Vui lòng nhập email hợp lệ' };
    }
    return { valid: true };
}

export function validateUsername(username) {
    if (!username || username.length < 3) {
        return { valid: false, message: 'Username phải có ít nhất 3 ký tự' };
    }
    return { valid: true };
}

export function validateSignup(email, password, username, confirmPassword) {
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        return emailValidation;
    }
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
        return usernameValidation;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!password || !passwordRegex.test(password)) {
        return { valid: false, message: 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số' };
    }
    if (password !== confirmPassword) {
        return { valid: false, message: 'Mật khẩu xác nhận không khớp' };
    }
    return { valid: true };
}

export function validateLogin(email, password) {
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        return emailValidation;
    }
    if (!password) {
        return { valid: false, message: 'Vui lòng nhập mật khẩu' };
    }
    return { valid: true };
}

export function validateField(field, formType, passwordValue = '') {
    const formGroup = field.closest('.form-group');
    if (!formGroup) {
        return false;
    }
    const errorSpan = formGroup.querySelector('.error-message span');
    if (!errorSpan) {
        return false;
    }
    if (field.type === 'email') {
        const validation = validateEmail(field.value);
        if (!validation.valid) {
            formGroup.classList.add('invalid');
            errorSpan.textContent = validation.message;
            return false;
        } else {
            formGroup.classList.remove('invalid');
            return true;
        }
    } else if (field.type === 'text' && field.id === 'signupUsername') {
        const validation = validateUsername(field.value);
        if (!validation.valid) {
            formGroup.classList.add('invalid');
            errorSpan.textContent = validation.message;
            return false;
        } else {
            formGroup.classList.remove('invalid');
            return true;
        }
    } else if (field.type === 'password' && field.id === 'signupPassword') {
        if (formType === 'signup') {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
            if (!field.value || !passwordRegex.test(field.value)) {
                formGroup.classList.add('invalid');
                errorSpan.textContent = 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số';
                return false;
            }
            formGroup.classList.remove('invalid');
            return true;
        }
    } else if (field.type === 'password' && field.id === 'signupConfirmPassword') {
        if (field.value !== passwordValue) {
            formGroup.classList.add('invalid');
            errorSpan.textContent = 'Mật khẩu xác nhận không khớp';
            return false;
        }
        formGroup.classList.remove('invalid');
        return true;
    } else if (field.type === 'password' && formType === 'login') {
        if (!field.value) {
            formGroup.classList.add('invalid');
            errorSpan.textContent = 'Vui lòng nhập mật khẩu';
            return false;
        }
        formGroup.classList.remove('invalid');
        return true;
    }
    return false;
}