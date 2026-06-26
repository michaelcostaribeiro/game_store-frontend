export const url = 'http://localhost:8000/'

export const authHeaders = {
    'Content-type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
}