/**
 * userManagement.js
 * 
 * This file manages user registration, login verification,
 * shopping cart management, and checkout using localStorage.
 * 
 * Usage:
 * - Register users are stored in localStorage under 'registeredUsers'.
 * - Logged in user info is stored in localStorage under 'loggedInUser'.
 * - Cart items are stored in localStorage under 'cartItems'.
 * 
 * Functions:
 * - registerUser(username, password)
 * - loginUser(username, password)
 * - logoutUser()
 * - isUserLoggedIn()
 * - getLoggedInUser()
 * - addToCart(item)
 * - getCartItems()
 * - clearCart()
 * - checkout()
 * 
 * Integration:
 * - Call registerUser on registration form submit.
 * - Call loginUser on login form submit.
 * - Use isUserLoggedIn to check login status on pages.
 * - Use addToCart to add items to cart.
 * - Use checkout to process checkout.
 */

(function() {
  // Helper to get registered users from localStorage
  function getRegisteredUsers() {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
  }

  // Helper to save registered users to localStorage
  function saveRegisteredUsers(users) {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
  }

  // Register a new user
  window.registerUser = function(username, password) {
    if (!username || !password) {
      return 'empty_fields';
    }
    let users = getRegisteredUsers();
    const userExists = users.some(u => u.username === username);
    if (userExists) {
      return 'exists';
    }
    users.push({ username, password });
    saveRegisteredUsers(users);
    return 'success';
  };

  // Login user
  window.loginUser = function(username, password) {
    if (!username || !password) {
      return 'empty_fields';
    }
    let users = getRegisteredUsers();
    const user = users.find(u => u.username === username);
    if (!user) {
      return 'not_registered';
    }
    if (user.password !== password) {
      return 'wrong_password';
    }
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    return 'success';
  };

  // Logout user
  window.logoutUser = function() {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('cartItems');
    alert('Anda telah logout.');
  };

  // Check if user is logged in
  window.isUserLoggedIn = function() {
    return localStorage.getItem('loggedInUser') !== null;
  };

  // Get logged in user info
  window.getLoggedInUser = function() {
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
  };

  // Add item to cart
  window.addToCart = function(item) {
    if (!window.isUserLoggedIn()) {
      alert('Silakan login terlebih dahulu untuk menambahkan barang ke keranjang.');
      return false;
    }
    let cart = localStorage.getItem('cartItems');
    cart = cart ? JSON.parse(cart) : [];
    cart.push(item);
    localStorage.setItem('cartItems', JSON.stringify(cart));
    // alert('Barang berhasil ditambahkan ke keranjang.'); // Dihapus agar tidak muncul ganda
    return true;
  };

  // Get cart items
  window.getCartItems = function() {
    let cart = localStorage.getItem('cartItems');
    return cart ? JSON.parse(cart) : [];
  };

  // Clear cart
  window.clearCart = function() {
    localStorage.removeItem('cartItems');
  };

  // Checkout
  window.checkout = function() {
    if (!window.isUserLoggedIn()) {
      alert('Silakan login terlebih dahulu untuk melakukan checkout.');
      return false;
    }
    let cart = window.getCartItems();
    if (cart.length === 0) {
      alert('Keranjang belanja kosong.');
      return false;
    }
    // For simplicity, just clear cart and show invoice message
    window.clearCart();
    alert('Checkout berhasil. Terima kasih telah berbelanja.');
    // Redirect to invoice page or show invoice here if needed
    return true;
  };

  // Update quantity of item in cart by index
  window.updateQuantity = function(index, newQuantity) {
    if (newQuantity < 1) return;
    let cart = window.getCartItems();
    if (index < 0 || index >= cart.length) return;
    cart[index].quantity = newQuantity;
    localStorage.setItem('cartItems', JSON.stringify(cart));
  };

  // Update password user yang sudah terdaftar
  window.updatePassword = function(username, newPassword) {
    if (!username || !newPassword) {
      return 'empty_fields';
    }
    let users = getRegisteredUsers();
    const userIndex = users.findIndex(u => u.username === username);
    if (userIndex === -1) {
      return 'not_registered';
    }
    users[userIndex].password = newPassword;
    saveRegisteredUsers(users);

    // Jika user yang sedang login adalah user ini, update juga loggedInUser
    const loggedInUser = window.getLoggedInUser();
    if (loggedInUser && loggedInUser.username === username) {
      loggedInUser.password = newPassword;
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    }
    return 'success';
  };
})();
