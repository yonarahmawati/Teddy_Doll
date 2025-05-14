/**
 * auth.js
 * Manajemen autentikasi dan sesi pengguna menggunakan localStorage dan sessionStorage.
 */

/**
 * Daftarkan user baru.
 * @param {string} username 
 * @param {string} password 
 * @returns {boolean} true jika berhasil, false jika username sudah ada
 */
export function registerUser(username, password) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    username = username.trim().toLowerCase();
    if (users.find(u => u.username === username)) {
        return false; // username sudah ada
    }
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    return true;
}

/**
 * Login user.
 * @param {string} username 
 * @param {string} password 
 * @returns {string} 'success' jika login berhasil,
 *                   'not_registered' jika user tidak ditemukan,
 *                   'wrong_password' jika password salah
 */
export function loginUser(username, password) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    username = username.trim().toLowerCase();
    console.log('loginUser called with username:', username);
    const user = users.find(u => u.username === username);
    if (!user) {
        console.log('loginUser: user not registered');
        return 'not_registered';
    }
    if (user.password !== password) {
        console.log('loginUser: wrong password');
        return 'wrong_password';
    }
    sessionStorage.setItem('loggedInUser', username);
    console.log('loginUser: success');
    return 'success';
}

/**
 * Logout user.
 */
export function logoutUser() {
    sessionStorage.removeItem('loggedInUser');
}

/**
 * Cek apakah user sudah login.
 * @returns {string|null} username jika login, null jika tidak
 */
export function getLoggedInUser() {
    const user = sessionStorage.getItem('loggedInUser');
    return user ? user.trim().toLowerCase() : null;
}

/**
 * Proteksi halaman agar hanya bisa diakses jika user sudah login.
 * Jika belum login, redirect ke halaman login.
 */
export function protectPage() {
    if (!getLoggedInUser()) {
        window.location.href = 'login.html';
    }
}
