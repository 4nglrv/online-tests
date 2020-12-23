export function createControl(config, validation) {
    return {
        ...config,
        validation,
        valid: !validation,
        touched: false
    }
}

export function validate(value) {
    if (value.length > 0) {
        return true
    } else {
        return false
    }
}

export function validateForm(formControls) {
    let isFormValid = true

    for (let control in formControls) {
        if (formControls.hasOwnProperty(control)) {
            isFormValid = formControls[control].valid && isFormValid
        }
    }

    return isFormValid
}