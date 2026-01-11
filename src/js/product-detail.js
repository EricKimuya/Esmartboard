// Product Database
const products = {
  'school-classroom-55': {
    name: 'E-Touch Classroom 55"',
    price: 1899,
    originalPrice: 2299,
    description: 'Perfect for 30 students with built-in teaching tools and wireless screen mirroring.',
    category: 'School',
    categoryLink: 'school.html',
    badge: 'BUDGET PICK',
    specs: ['55"', '4K', 'Android', '20-Touch'],
    images: ['./public/css/images/screen3.jpg', './public/css/images/screen6.jpg', './public/css/images/screen.jpg', './public/css/images/SMART-SBID-6286S-V3-PW.jpg']
  },
  'school-pro-65': {
    name: 'E-Touch Pro 65"',
    price: 2499,
    originalPrice: 2999,
    description: 'Perfect for classrooms with 20-point touch, built-in teaching software, and wireless screen mirroring.',
    category: 'School',
    categoryLink: 'school.html',
    badge: 'BEST SELLER',
    specs: ['65"', '4K', 'Android', '20-Touch'],
    images: ['./public/css/images/screen6.jpg', './public/css/images/screen3.jpg', './public/css/images/screen.jpg', './public/css/images/SMART-SBID-6286S-V3-PW.jpg']
  },
  'school-elite-75': {
    name: 'E-Touch Elite 75"',
    price: 3499,
    originalPrice: 4199,
    description: 'Large classrooms with premium anti-glare and AI teaching assistant.',
    category: 'School',
    categoryLink: 'school.html',
    badge: 'PREMIUM',
    specs: ['75"', '4K', 'Android', '20-Touch'],
    images: ['./public/css/images/screen.jpg', './public/css/images/screen6.jpg', './public/css/images/screen3.jpg', './public/css/images/SMART-SBID-6286S-V3-PW.jpg']
  },
  'corp-conference-65': {
    name: 'E-Touch Conference 65"',
    price: 3499,
    originalPrice: 4299,
    description: 'Perfect for conference rooms with Teams/Zoom integration and wireless presentation.',
    category: 'Corporate',
    categoryLink: 'corporate.html',
    badge: 'BEST VALUE',
    specs: ['65"', '4K', 'Windows', '20-Touch'],
    images: ['./public/css/images/screen6.jpg', './public/css/images/screen3.jpg', './public/css/images/screen.jpg', './public/css/images/SMART-SBID-6286S-V3-PW.jpg']
  },
  'corp-executive-75': {
    name: 'E-Touch Executive 75"',
    price: 4399,
    originalPrice: 5499,
    description: 'Executive boardrooms with 4K video and enterprise security.',
    category: 'Corporate',
    categoryLink: 'corporate.html',
    badge: 'ENTERPRISE',
    specs: ['75"', '4K', 'Windows', '20-Touch'],
    images: ['./public/css/images/screen.jpg', './public/css/images/screen6.jpg', './public/css/images/screen3.jpg', './public/css/images/SMART-SBID-6286S-V3-PW.jpg']
  },
  'corp-premium-86': {
    name: 'E-Touch Premium 86"',
    price: 6499,
    originalPrice: 8499,
    description: 'Ultimate boardroom experience with 8K Ultra HD and AI features.',
    category: 'Corporate',
    categoryLink: 'corporate.html',
    badge: 'PREMIUM',
    specs: ['86"', '8K', 'Dual OS', '20-Touch'],
    images: ['./public/css/images/SMART-SBID-6286S-V3-PW.jpg', './public/css/images/screen.jpg', './public/css/images/screen6.jpg', './public/css/images/screen3.jpg']
  }
};

// Get product ID from URL
function getProductFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('product') || 'school-pro-65'; // Default product
}

// Load product data
let currentProduct = null;
let currentQuantity = 1;

function loadProductData() {
  const productId = getProductFromURL();
  currentProduct = products[productId];
  
  if (!currentProduct) {
    window.location.href = 'index.html';
    return;
  }
  
  // Update page content
  document.getElementById('productName').textContent = currentProduct.name;
  document.getElementById('productDescription').textContent = currentProduct.description;
  document.getElementById('productPrice').textContent = `$${currentProduct.price.toLocaleString()}`;
  document.getElementById('productBadge').textContent = currentProduct.badge;
  document.getElementById('breadcrumb-category').textContent = currentProduct.category;
  document.getElementById('breadcrumb-category').href = currentProduct.categoryLink;
  document.getElementById('breadcrumb-product').textContent = currentProduct.name;
  
  // Update main image
  document.getElementById('mainImage').src = currentProduct.images[0];
  
  // Update thumbnails
  const thumbnails = document.querySelectorAll('.thumbnail');
  thumbnails.forEach((thumb, index) => {
    if (currentProduct.images[index]) {
      thumb.src = currentProduct.images[index];
    }
  });
  
  // Update page title
  document.title = `${currentProduct.name} - Esmartboard`;
}

// Change main image
function changeImage(thumbnail, index) {
  // Update main image
  document.getElementById('mainImage').src = thumbnail.src;
  
  // Update active thumbnail
  document.querySelectorAll('.thumbnail').forEach(t => {
    t.classList.remove('active', 'border-blue-600');
    t.classList.add('border-transparent');
  });
  thumbnail.classList.add('active', 'border-blue-600');
  thumbnail.classList.remove('border-transparent');
}

// Update quantity
function updateProductQuantity(change) {
  currentQuantity = Math.max(1, currentQuantity + change);
  document.getElementById('productQuantity').textContent = currentQuantity;
}

// Add to cart
function addProductToCart() {
  if (currentProduct && typeof addToCart === 'function') {
    addToCart(currentProduct.name, currentProduct.price, currentQuantity);
    currentQuantity = 1;
    document.getElementById('productQuantity').textContent = '1';
  }
}

// Toggle wishlist
function toggleWishlist(button) {
  const icon = button.querySelector('i');
  if (icon.classList.contains('far')) {
    icon.classList.remove('far');
    icon.classList.add('fas');
    button.classList.add('text-red-500');
    showNotification('Added to wishlist', 'success');
  } else {
    icon.classList.remove('fas');
    icon.classList.add('far');
    button.classList.remove('text-red-500');
    showNotification('Removed from wishlist', 'info');
  }
}

// Tab switching
function switchTab(tabName) {
  // Update buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Update content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(tabName).classList.add('active');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadProductData();
});

// Helper function for notifications (if not in main app.js)
function showNotification(message, type) {
  if (typeof window.showNotification === 'function') {
    window.showNotification(message, type);
  } else {
    console.log(`${type}: ${message}`);
  }
}