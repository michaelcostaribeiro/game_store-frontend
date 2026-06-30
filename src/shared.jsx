export const url = import.meta.env.VITE_BACKEND_URL

export const authHeaders = {
    'Content-type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
}