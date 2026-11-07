export const MIN_PASSWORD_LENGTH = 8
export const MAX_PASSWORD_LENGTH = 72 // matches the backend and BCrypt's limit

export const validateEmail = (email) => {
    const value = email?.trim()
    return !!value && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
}