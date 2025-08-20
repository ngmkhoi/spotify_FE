function clearForm(formElement) {
    const inputs = formElement.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = '';
    });

    const formGroups = formElement.querySelectorAll('.form-group');
    formGroups.forEach(formGroup => {
        formGroup.classList.remove('invalid');
        const errorSpan = formGroup.querySelector('.error-message span');
        if (errorSpan) {
            errorSpan.textContent = '';
        }
    });
}

export default clearForm;