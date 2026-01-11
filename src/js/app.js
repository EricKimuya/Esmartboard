// ========================================
// SWIPER INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
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

// Add to Cart Function - ENHANCED
function addToCart(name, price, quantity = 1) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ 
      name, 
      price, 
      quantity,
      id: Date.now() + Math.random() // Unique ID for each item
    });
  }

  saveCart();
  updateCartUI();
  showNotification(`${name} added to cart!`, 'success');
  
  // Optional: Open cart sidebar briefly to show item was added
  // Uncomment next 3 lines if you want this behavior
  // cartSidebar.classList.add('show');
  // document.body.style.overflow = 'hidden';
  // setTimeout(() => { cartSidebar.classList.remove('show'); document.body.style.overflow = ''; }, 2000);
}

// Remove Single Item from Cart - NEW
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
  showNotification('Item removed from cart', 'info');
}

// Update Quantity - NEW
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

// Update Cart UI - ENHANCED with better styling
function updateCartUI() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Update all cart count badges (header + mobile menu)
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

// Show Notification - NEW
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
// FORM VALIDATION (if contact forms exist)
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const contactForms = document.querySelectorAll('.contact-form, form');
  
  contactForms.forEach(form => {
    // Skip if it's a search form or doesn't have submit
    if (form.classList.contains('search-form')) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      let isValid = true;
      
      // Basic validation
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

// Log cart updates (for debugging - remove in production)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('Cart initialized:', cart);
}