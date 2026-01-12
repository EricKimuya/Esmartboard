// Authentication JavaScript

// Toggle Password Visibility
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const button = input.parentElement.querySelector('.toggle-password i');
  
  if (input.type === 'password') {
    input.type = 'text';
    button.classList.remove('fa-eye');
    button.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    button.classList.remove('fa-eye-slash');
    button.classList.add('fa-eye');
  }
}

// Password Strength Checker
const passwordInput = document.getElementById('signupPassword');
if (passwordInput) {
  passwordInput.addEventListener('input', checkPasswordStrength);
}

function checkPasswordStrength() {
  const password = passwordInput.value;
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');
  
  let strength = 0;
  
  // Check length
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  
  // Check for lowercase and uppercase
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
  
  // Check for numbers
  if (password.match(/[0-9]/)) strength++;
  
  // Check for special characters
  if (password.match(/[^a-zA-Z0-9]/)) strength++;
  
  // Update UI
  strengthBar.className = 'password-strength-fill';
  
  if (strength <= 2) {
    strengthBar.classList.add('weak');
    strengthText.textContent = 'Password strength: Weak';
    strengthText.className = 'text-xs text-red-600 mt-1';
  } else if (strength <= 4) {
    strengthBar.classList.add('medium');
    strengthText.textContent = 'Password strength: Medium';
    strengthText.className = 'text-xs text-yellow-600 mt-1';
  } else {
    strengthBar.classList.add('strong');
    strengthText.textContent = 'Password strength: Strong';
    strengthText.className = 'text-xs text-green-600 mt-1';
  }
}

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}

function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  // Check if user exists in localStorage
  const users = JSON.parse(localStorage.getItem('esmartboard_users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Save current session
    localStorage.setItem('esmartboard_current_user', JSON.stringify({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      accountType: user.accountType,
      loginTime: new Date().toISOString()
    }));
    
    // Show success message
    showNotification('Login successful! Redirecting...', 'success');
    
    // Redirect after 1 second
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } else {
    showNotification('Invalid email or password', 'error');
  }
}

// Signup Form Handler
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', handleSignup);
}

function handleSignup(e) {
  e.preventDefault();
  
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('signupEmail').value;
  const phone = document.getElementById('phone').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const accountType = document.querySelector('input[name="accountType"]:checked').value;
  const terms = document.getElementById('terms').checked;
  const newsletter = document.getElementById('newsletter').checked;
  
  // Validation
  if (password !== confirmPassword) {
    showNotification('Passwords do not match!', 'error');
    return;
  }
  
  if (password.length < 8) {
    showNotification('Password must be at least 8 characters long', 'error');
    return;
  }
  
  if (!terms) {
    showNotification('Please accept the Terms of Service', 'error');
    return;
  }
  
  // Check if email already exists
  const users = JSON.parse(localStorage.getItem('esmartboard_users') || '[]');
  if (users.find(u => u.email === email)) {
    showNotification('Email already registered. Please login.', 'error');
    return;
  }
  
  // Create new user
  const newUser = {
    id: Date.now(),
    firstName,
    lastName,
    email,
    phone,
    password, // In production, this should be hashed!
    accountType,
    newsletter,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('esmartboard_users', JSON.stringify(users));
  
  // Auto login
  localStorage.setItem('esmartboard_current_user', JSON.stringify({
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    phone: newUser.phone,
    accountType: newUser.accountType,
    loginTime: new Date().toISOString()
  }));
  
  showNotification('Account created successfully! Redirecting...', 'success');
  
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
}

// Show Notification
function showNotification(message, type = 'success') {
  // Check if the global showNotification exists (from main app.js)
  if (typeof window.showNotification === 'function') {
    window.showNotification(message, type);
    return;
  }
  
  // Fallback notification
  const notification = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-green-500' : 
                   type === 'error' ? 'bg-red-500' : 
                   'bg-blue-500';
  
  notification.className = `fixed top-24 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
  notification.style.animation = 'slideIn 0.3s ease-out';
  notification.innerHTML = `
    <div class="flex items-center gap-2">
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Social Login Handlers (For future implementation)
document.querySelectorAll('.social-login-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const provider = this.querySelector('i').classList.contains('fa-google') ? 'Google' : 'Facebook';
    showNotification(`${provider} login will be available soon!`, 'info');
  });
});

// Check if user is already logged in on page load
document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('esmartboard_current_user'));
  
  if (currentUser) {
    // Update header to show user info
    updateHeaderForLoggedInUser(currentUser);
  }
});

// Update header when user is logged in
function updateHeaderForLoggedInUser(user) {
  // This function will be called from index.html
  // For now, just store the user data
  console.log('User logged in:', user.email);
}

// Logout function (to be used on other pages)
function logout() {
  localStorage.removeItem('esmartboard_current_user');
  showNotification('Logged out successfully', 'success');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1000);
}

// Make logout available globally
window.logout = logout;