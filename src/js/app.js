// ========================================
// HEADER USER STATUS UPDATE
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  updateHeaderUserStatus();
});

function updateHeaderUserStatus() {
  const currentUser = JSON.parse(localStorage.getItem('esmartboard_current_user'));
  
  // Desktop login link
  const desktopLoginLink = document.querySelector('a[href="login.html"]:not(#mobileLoginLink)');
  
  // Mobile login link
  const mobileLoginLink = document.getElementById('mobileLoginLink');
  
  if (currentUser) {
    // User is logged in - show account link
    if (desktopLoginLink) {
      desktopLoginLink.href = 'account.html';
      desktopLoginLink.innerHTML = `
        <i class="fas fa-user-circle"></i>
        <span class="ml-1">${currentUser.firstName}</span>
      `;
      desktopLoginLink.classList.add('text-primary-600');
    }
    
    if (mobileLoginLink) {
      mobileLoginLink.href = 'account.html';
      mobileLoginLink.innerHTML = `
        <i class="fas fa-user-circle mr-2"></i>
        <span>${currentUser.firstName}</span>
      `;
      mobileLoginLink.classList.add('text-primary-600');
    }
  } else {
    // User is not logged in - show login link
    if (desktopLoginLink) {
      desktopLoginLink.href = 'login.html';
      desktopLoginLink.innerHTML = `
        <i class="fas fa-user"></i>
        <span class="ml-1">Login</span>
      `;
      desktopLoginLink.classList.remove('text-primary-600');
    }
    
    if (mobileLoginLink) {
      mobileLoginLink.href = 'login.html';
      mobileLoginLink.innerHTML = `
        <i class="fas fa-user mr-2"></i>
        <span>Login</span>
      `;
      mobileLoginLink.classList.remove('text-primary-600');
    }
  }
}

// Update header when user logs in or out
window.addEventListener('storage', function(e) {
  if (e.key === 'esmartboard_current_user') {
    updateHeaderUserStatus();
  }
});

// Make function globally accessible
window.updateHeaderUserStatus = updateHeaderUserStatus;

// ========================================
// SWIPER INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  
  // ========================================
  // HERO CAROUSEL - NEW
  // ========================================
  const heroCarousel = document.querySelector('.hero-carousel');
  
  if (heroCarousel) {
    new Swiper('.hero-carousel', {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      speed: 1000,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      navigation: {
        nextEl: '.hero-swiper-button-next',
        prevEl: '.hero-swiper-button-prev',
      },
      pagination: {
        el: '.hero-swiper-pagination',
        clickable: true,
        renderBullet: function (index, className) {
          return '<span class="' + className + '"></span>';
        },
      },
      on: {
        init: function() {
          // Reset animations when carousel initializes
          resetSlideAnimations(this.slides[this.activeIndex]);
        },
        slideChangeTransitionStart: function() {
          // Reset animations on all slides
          this.slides.forEach(slide => {
            const title = slide.querySelector('.hero-title');
            const subtitle = slide.querySelector('.hero-subtitle');
            const buttons = slide.querySelector('.hero-buttons');
            
            if (title) title.style.animation = 'none';
            if (subtitle) subtitle.style.animation = 'none';
            if (buttons) buttons.style.animation = 'none';
          });
        },
        slideChangeTransitionEnd: function() {
          // Restart animations on active slide
          resetSlideAnimations(this.slides[this.activeIndex]);
        }
      }
    });
  }
  
  function resetSlideAnimations(slide) {
    const title = slide.querySelector('.hero-title');
    const subtitle = slide.querySelector('.hero-subtitle');
    const buttons = slide.querySelector('.hero-buttons');
    
    // Force reflow to restart animations
    if (title) {
      title.style.animation = 'none';
      void title.offsetWidth; // Trigger reflow
      title.style.animation = 'fadeInUp 0.8s ease-out 0.3s forwards';
    }
    
    if (subtitle) {
      subtitle.style.animation = 'none';
      void subtitle.offsetWidth;
      subtitle.style.animation = 'fadeInUp 0.8s ease-out 0.5s forwards';
    }
    
    if (buttons) {
      buttons.style.animation = 'none';
      void buttons.offsetWidth;
      buttons.style.animation = 'fadeInUp 0.8s ease-out 0.7s forwards';
    }
  }
  
  // ========================================
  // FEATURED PRODUCTS CAROUSEL
  // ========================================
  const featuredProductsSwiper = document.getElementById('featured-products');
  
  if (featuredProductsSwiper) {
    new Swiper('#featured-products', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 }
      },
    });
  }
});

// ========================================
// MOBILE MENU TOGGLE
// ========================================
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle('show');
    
    // Toggle icon
    const icon = mobileMenuButton.querySelector('i');
    if (mobileMenu.classList.contains('show')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('show');
      const icon = mobileMenuButton.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });
}

// ========================================
// CART FUNCTIONALITY
// ========================================
const cartButton = document.getElementById('cartButton');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const clearCartBtn = document.getElementById('clearCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartSubtotal = document.getElementById('cartSubtotal');

let cart = [];

// Load cart from localStorage on page load
if (localStorage.getItem('esmartboardCart')) {
  cart = JSON.parse(localStorage.getItem('esmartboardCart'));
  updateCartUI();
}

// Open Cart
if (cartButton && cartSidebar) {
  cartButton.addEventListener('click', (e) => {
    e.preventDefault();
    cartSidebar.classList.add('show');
    document.body.style.overflow = 'hidden';
  });
}

// Close Cart
if (closeCart && cartSidebar) {
  closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('show');
    document.body.style.overflow = '';
  });
  
  // Close cart when clicking on the backdrop (outside sidebar)
  cartSidebar.addEventListener('click', (e) => {
    if (e.target === cartSidebar) {
      cartSidebar.classList.remove('show');
      document.body.style.overflow = '';
    }
  });
}

// Clear Cart
if (clearCartBtn) {
  clearCartBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      cart = [];
      saveCart();
      updateCartUI();
      showNotification('Cart cleared', 'info');
    }
  });
}

// Add to Cart Function
function addToCart(name, price, quantity = 1) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ 
      name, 
      price, 
      quantity,
      id: Date.now() + Math.random()
    });
  }

  saveCart();
  updateCartUI();
  showNotification(`${name} added to cart!`, 'success');
}

// Remove Single Item from Cart
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
  showNotification('Item removed from cart', 'info');
}

// Update Quantity
function updateQuantity(index, change) {
  if (cart[index]) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
      removeFromCart(index);
    } else {
      saveCart();
      updateCartUI();
    }
  }
}

// Save Cart to localStorage
function saveCart() {
  localStorage.setItem('esmartboardCart', JSON.stringify(cart));
}

// Update Cart UI
function updateCartUI() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Update all cart count badges
  const cartCountElements = document.querySelectorAll('#cartCount, .mobile-menu .bg-primary-600');
  cartCountElements.forEach(el => {
    if (el) el.textContent = totalItems;
  });

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        <i class="fas fa-shopping-cart text-5xl mb-4 text-gray-300"></i>
        <p class="text-lg">Your cart is empty</p>
        <p class="text-sm mt-2">Add some products to get started!</p>
      </div>
    `;
    cartSubtotal.textContent = '$0.00';
    return;
  }

  let subtotal = 0;
  let cartHTML = '';

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    cartHTML += `
      <div class="flex gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
        <div class="flex-1">
          <h4 class="font-bold text-sm mb-1">${item.name}</h4>
          <p class="text-lg font-semibold text-primary-600">$${item.price.toLocaleString()}</p>
          
          <div class="flex items-center gap-3 mt-3">
            <div class="flex items-center border border-gray-300 rounded">
              <button onclick="updateQuantity(${index}, -1)" class="px-3 py-1 hover:bg-gray-200 transition">
                <i class="fas fa-minus text-xs"></i>
              </button>
              <span class="px-4 py-1 font-semibold border-l border-r border-gray-300">${item.quantity}</span>
              <button onclick="updateQuantity(${index}, 1)" class="px-3 py-1 hover:bg-gray-200 transition">
                <i class="fas fa-plus text-xs"></i>
              </button>
            </div>
            
            <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700 text-sm ml-auto">
              <i class="fas fa-trash"></i> Remove
            </button>
          </div>
        </div>
        
        <div class="text-right">
          <p class="text-sm text-gray-500">Total</p>
          <p class="text-xl font-bold text-gray-800">$${itemTotal.toLocaleString()}</p>
        </div>
      </div>
    `;
  });

  cartItems.innerHTML = cartHTML;
  cartSubtotal.textContent = `$${subtotal.toLocaleString()}`;
}

// Show Notification
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-green-500' : 
                   type === 'error' ? 'bg-red-500' : 
                   'bg-blue-500';
  
  notification.className = `fixed top-24 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 notification-slide-in`;
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

// Make functions globally accessible
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;

// ========================================
// PRODUCT FILTERING
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  // School page filters
  const schoolFilterButtons = document.querySelectorAll('.filter-btn');
  schoolFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      // Update active button
      schoolFilterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter products
      const products = document.querySelectorAll('.product-card-school');
      products.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Corporate page filters
  const corpFilterButtons = document.querySelectorAll('.corp-filter-btn');
  corpFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      // Update active button
      corpFilterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter products
      const products = document.querySelectorAll('.corp-product-card');
      products.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
});

// ========================================
// USE CASE CARDS ANIMATION (Corporate Page)
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, observerOptions);

  const useCaseCards = document.querySelectorAll('.use-case-card');
  useCaseCards.forEach(card => {
    observer.observe(card);
  });
});

// ========================================
// SMOOTH SCROLLING
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href !== '#' && href !== 'javascript:void(0)') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
          
          // Close mobile menu if open
          if (mobileMenu && mobileMenu.classList.contains('show')) {
            mobileMenu.classList.remove('show');
            const icon = mobileMenuButton.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
          }
        }
      }
    });
  });
});

// ========================================
// FORM VALIDATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const contactForms = document.querySelectorAll('.contact-form, form');
  
  contactForms.forEach(form => {
    if (form.classList.contains('search-form')) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      let isValid = true;
      
      for (let [key, value] of formData.entries()) {
        if (!value.trim()) {
          isValid = false;
          break;
        }
      }
      
      if (isValid) {
        showNotification('Thank you! We will contact you soon.', 'success');
        form.reset();
      } else {
        showNotification('Please fill in all fields.', 'error');
      }
    });
  });
});

// ========================================
// ACCOUNT/PROFILE PAGE FUNCTIONALITY
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on the account page
  if (window.location.pathname.includes('account.html')) {
    initializeAccountPage();
  }
});

function initializeAccountPage() {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem('esmartboard_current_user'));
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  // Load user data
  const userNameElement = document.getElementById('userName');
  if (userNameElement) {
    userNameElement.textContent = currentUser.firstName;
  }
  
  loadAccountData();
  loadUserOrders();
  setupAccountEventListeners();
}

function loadAccountData() {
  const currentUser = JSON.parse(localStorage.getItem('esmartboard_current_user'));
  const users = JSON.parse(localStorage.getItem('esmartboard_users') || '[]');
  const user = users.find(u => u.email === currentUser.email);
  
  if (user) {
    // Load profile data
    const profileFirstName = document.getElementById('profileFirstName');
    const profileLastName = document.getElementById('profileLastName');
    const profileEmail = document.getElementById('profileEmail');
    const profilePhone = document.getElementById('profilePhone');
    const profileAccountType = document.getElementById('profileAccountType');
    const memberSince = document.getElementById('memberSince');
    
    if (profileFirstName) profileFirstName.value = user.firstName;
    if (profileLastName) profileLastName.value = user.lastName;
    if (profileEmail) profileEmail.value = user.email;
    if (profilePhone) profilePhone.value = user.phone || '';
    if (profileAccountType) profileAccountType.value = user.accountType || 'Individual';
    
    if (memberSince) {
      const joinDate = new Date(user.createdAt || Date.now());
      memberSince.textContent = joinDate.getFullYear();
    }
  }
}

function loadUserOrders() {
  const currentUser = JSON.parse(localStorage.getItem('esmartboard_current_user'));
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const userOrders = orders.filter(o => o.customerInfo && o.customerInfo.email === currentUser.email);
  
  // Update stats
  const totalOrdersElement = document.getElementById('totalOrders');
  if (totalOrdersElement) {
    totalOrdersElement.textContent = userOrders.length;
  }
  
  const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
  const totalSpentElement = document.getElementById('totalSpent');
  if (totalSpentElement) {
    totalSpentElement.textContent = '$' + totalSpent.toLocaleString();
  }
  
  // Display recent orders (Overview tab)
  const recentOrdersContainer = document.getElementById('recentOrders');
  if (recentOrdersContainer && userOrders.length > 0) {
    const recentOrders = userOrders.slice(0, 3);
    recentOrdersContainer.innerHTML = recentOrders.map(order => `
      <div class="order-card">
        <div class="order-header">
          <div>
            <strong>${order.orderNumber}</strong>
            <p style="color: #6b7280; font-size: 0.875rem; margin-top: 0.25rem;">
              ${new Date(order.date).toLocaleDateString()}
            </p>
          </div>
          <span class="order-status status-completed">Completed</span>
        </div>
        <p style="color: #4b5563; margin-bottom: 0.5rem;">${order.items.length} item(s)</p>
        <p style="font-size: 1.25rem; font-weight: 700; color: #0284c7;">$${order.total.toLocaleString()}</p>
      </div>
    `).join('');
  }
  
  // Display all orders (Orders tab)
  const ordersListContainer = document.getElementById('ordersList');
  if (ordersListContainer) {
    if (userOrders.length === 0) {
      ordersListContainer.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 2rem;">No orders found.</p>';
    } else {
      ordersListContainer.innerHTML = userOrders.map(order => `
        <div class="order-card">
          <div class="order-header">
            <div>
              <strong>${order.orderNumber}</strong>
              <p style="color: #6b7280; font-size: 0.875rem; margin-top: 0.25rem;">
                ${new Date(order.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <span class="order-status status-completed">Completed</span>
          </div>
          ${order.items.map(item => `
            <div style="margin-bottom: 0.5rem;">
              <strong>${item.name}</strong> × ${item.quantity}
              <span style="float: right; color: #0284c7; font-weight: 600;">$${(item.price * item.quantity).toLocaleString()}</span>
            </div>
          `).join('')}
          <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 1.125rem; font-weight: 700; text-align: right;">
              Total: <span style="color: #0284c7;">$${order.total.toLocaleString()}</span>
            </p>
          </div>
        </div>
      `).join('');
    }
  }
}

function setupAccountEventListeners() {
  // Profile form submission
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileUpdate);
  }
  
  // Password form submission
  const passwordForm = document.getElementById('passwordForm');
  if (passwordForm) {
    passwordForm.addEventListener('submit', handlePasswordChange);
  }
}

function handleProfileUpdate(e) {
  e.preventDefault();
  
  const currentUser = JSON.parse(localStorage.getItem('esmartboard_current_user'));
  const users = JSON.parse(localStorage.getItem('esmartboard_users') || '[]');
  const userIndex = users.findIndex(u => u.email === currentUser.email);
  
  if (userIndex !== -1) {
    users[userIndex].firstName = document.getElementById('profileFirstName').value;
    users[userIndex].lastName = document.getElementById('profileLastName').value;
    users[userIndex].phone = document.getElementById('profilePhone').value;
    
    localStorage.setItem('esmartboard_users', JSON.stringify(users));
    
    // Update current user session
    currentUser.firstName = users[userIndex].firstName;
    currentUser.lastName = users[userIndex].lastName;
    localStorage.setItem('esmartboard_current_user', JSON.stringify(currentUser));
    
    // Update displayed name
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
      userNameElement.textContent = currentUser.firstName;
    }
    
    showNotification('Profile updated successfully!', 'success');
  }
}

function handlePasswordChange(e) {
  e.preventDefault();
  
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmNewPassword').value;
  
  if (newPassword !== confirmPassword) {
    showNotification('New passwords do not match!', 'error');
    return;
  }
  
  if (newPassword.length < 6) {
    showNotification('Password must be at least 6 characters long!', 'error');
    return;
  }
  
  const currentUser = JSON.parse(localStorage.getItem('esmartboard_current_user'));
  const users = JSON.parse(localStorage.getItem('esmartboard_users') || '[]');
  const user = users.find(u => u.email === currentUser.email);
  
  if (user && user.password === currentPassword) {
    user.password = newPassword;
    localStorage.setItem('esmartboard_users', JSON.stringify(users));
    showNotification('Password changed successfully!', 'success');
    e.target.reset();
  } else {
    showNotification('Current password is incorrect!', 'error');
  }
}

function showAccountTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Remove active class from all sidebar items
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Show selected tab
  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }
  
  // Add active class to matching sidebar item
  const matchingItem = document.querySelector(`.sidebar-item[data-tab="${tabName}"]`);
  if (matchingItem) {
    matchingItem.classList.add('active');
  }
}

function handleAccountLogout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('esmartboard_current_user');
    window.location.href = 'login.html';
  }
}

function deleteUserAccount() {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
    if (confirm('This will permanently delete all your data. Continue?')) {
      const currentUser = JSON.parse(localStorage.getItem('esmartboard_current_user'));
      const users = JSON.parse(localStorage.getItem('esmartboard_users') || '[]');
      const updatedUsers = users.filter(u => u.email !== currentUser.email);
      
      localStorage.setItem('esmartboard_users', JSON.stringify(updatedUsers));
      localStorage.removeItem('esmartboard_current_user');
      
      showNotification('Your account has been deleted.', 'info');
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    }
  }
}

// Make functions globally accessible for onclick handlers
window.showAccountTab = showAccountTab;
window.handleAccountLogout = handleAccountLogout;
window.deleteUserAccount = deleteUserAccount;

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
}

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
