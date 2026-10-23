const validateSignUpData = (req) => {
    const { firstName, lastName, age, gender, email, password } = req.body || {}

    if (!firstName || typeof firstName !== 'string' || !firstName.trim()) {
        throw new Error('First name is required')
    }

    if (lastName !== undefined && (typeof lastName !== 'string' || !lastName.trim())) {
        throw new Error('Last name must be a string when provided')
    }

    if (age !== undefined && (Number.isNaN(Number(age)) || Number(age) < 0)) {
        throw new Error('Age must be a non-negative number')
    }

    if (gender !== undefined && !['male', 'female', 'others'].includes(String(gender).toLowerCase())) {
        throw new Error('Invalid gender')
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        throw new Error('Valid email is required')
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
        throw new Error('Password must be at least 6 characters long')
    }

    return true
}

module.exports = validateSignUpData
