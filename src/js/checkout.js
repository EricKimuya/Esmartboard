// Checkout Page Logic
let currentStep = 1;
let discountAmount = 0;
let couponApplied = false;

// Load cart data on page load
document.addEventListener('DOMContentLoaded', () => {
  loadCheckoutCart();
  updateOrderSummary();
  setupPaymentMethodListeners();
  
  // Check if cart is empty
  const cart = JSON.parse(localStorage.getItem('esmartboardCart') || '[]');
  if (cart.length === 0) {
    alert('Your cart is empty!');
    window.location.href = 'school.html';
  }
});

// Load cart items in checkout
function loadCheckoutCart() {
  const cart = JSON.parse(localStorage.getItem('esmartboardCart') || '[]');
  const checkoutCartItems = document.getElementById('checkoutCartItems');
  
  if (cart.length === 0) {
    checkoutCartItems.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        <i class="fas fa-shopping-cart text-4xl mb-3"></i>
        <p>Your cart is empty</p>
      </div>
    `;
    return;
  }
  
  checkoutCartItems.innerHTML = cart.map((item, index) => `
    <div class="checkout-item">
      <div class="checkout-item-main">
        <h4 class="checkout-item-title">${item.name}</h4>
        <p class="checkout-item-qty">Quantity: ${item.quantity}</p>
      </div>
      <div class="checkout-item-price">$${(item.price * item.quantity).toLocaleString()}</div>
      <button onclick="removeItemFromCheckout(${index})" class="checkout-item-remove" aria-label="Remove item">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `).join('');
}

// Remove item from checkout
function removeItemFromCheckout(index) {
  const cart = JSON.parse(localStorage.getItem('esmartboardCart') || '[]');
  cart.splice(index, 1);
  localStorage.setItem('esmartboardCart', JSON.stringify(cart));
  loadCheckoutCart();
  updateOrderSummary();
  
  if (cart.length === 0) {
    alert('Your cart is empty! Redirecting to shop...');
    window.location.href = 'school.html';
  }
}

// Update order summary
function updateOrderSummary() {
  const cart = JSON.parse(localStorage.getItem('esmartboardCart') || '[]');
  const summaryItems = document.getElementById('summaryItems');
  
  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal - discountAmount;
  
  // Update summary items
  summaryItems.innerHTML = cart.map(item => `
    <div class="flex justify-between text-sm">
      <span>${item.name} × ${item.quantity}</span>
      <span>$${(item.price * item.quantity).toLocaleString()}</span>
    </div>
  `).join('');
  
  // Update totals
  document.getElementById('summarySubtotal').textContent = `$${subtotal.toLocaleString()}`;
  document.getElementById('summaryDiscount').textContent = discountAmount > 0 ? `-$${discountAmount.toLocaleString()}` : '$0';
  document.getElementById('summaryTotal').textContent = `$${total.toLocaleString()}`;
}

// Apply coupon code
function applyCoupon() {
  const couponCode = document.getElementById('couponCode').value.trim().toUpperCase();
  const message = document.getElementById('couponMessage');
  const cart = JSON.parse(localStorage.getItem('esmartboardCart') || '[]');
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Sample coupon codes
  const coupons = {
    'SCHOOL10': { type: 'percent', value: 10, description: '10% off for schools' },
    'WELCOME20': { type: 'percent', value: 20, description: '20% off for new customers' },
    'BULK500': { type: 'fixed', value: 500, description: '$500 off bulk orders' }
  };
  
  if (couponApplied) {
    message.innerHTML = '<p class="text-yellow-600"><i class="fas fa-info-circle mr-2"></i>Coupon already applied</p>';
    return;
  }
  
  if (coupons[couponCode]) {
    const coupon = coupons[couponCode];
    
    if (coupon.type === 'percent') {
      discountAmount = Math.round(subtotal * (coupon.value / 100));
    } else {
      discountAmount = coupon.value;
    }
    
    couponApplied = true;
    message.innerHTML = `<p class="text-green-600"><i class="fas fa-check-circle mr-2"></i>${coupon.description} applied!</p>`;
    updateOrderSummary();
  } else {
    message.innerHTML = '<p class="text-red-600"><i class="fas fa-times-circle mr-2"></i>Invalid coupon code</p>';
  }
}

// Step navigation
function nextStep(step) {
  // Hide current step
  document.getElementById(`step${currentStep}`).classList.remove('active');
  
  // Show next step
  document.getElementById(`step${step}`).classList.add('active');
  
  // Update progress
  updateProgress(step);
  
  currentStep = step;
  window.scrollTo(0, 0);
}

function prevStep(step) {
  nextStep(step);
}

function updateProgress(step) {
  // Update circles
  for (let i = 1; i <= 4; i++) {
    const circle = document.getElementById(`step${i}-circle`);
    const line = document.getElementById(`line${i}`);
    const label = document.getElementById(`step${i}-label`);
    
    if (i <= step) {
      circle.classList.add('active');
      if (line) line.classList.add('active');
      if (label) {
        label.classList.remove('text-gray-400');
        label.classList.add('text-blue-600');
      }
    } else {
      circle.classList.remove('active');
      if (line) line.classList.remove('active');
      if (label) {
        label.classList.remove('text-blue-600');
        label.classList.add('text-gray-400');
      }
    }
  }
}

// Validate and proceed to payment
function validateAndProceed() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  const city = document.getElementById('city').value.trim();
  const county = document.getElementById('county').value.trim();
  
  if (!firstName || !lastName || !email || !phone || !address || !city || !county) {
    alert('Please fill in all required fields');
    return;
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address');
    return;
  }
  
  // Store customer info
  const customerInfo = {
    firstName, lastName, email, phone,
    organization: document.getElementById('organization').value.trim(),
    address, city, county,
    postalCode: document.getElementById('postalCode').value.trim(),
    deliveryNotes: document.getElementById('deliveryNotes').value.trim()
  };
  localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
  
  nextStep(3);
}

// Setup payment method listeners
function setupPaymentMethodListeners() {
  const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
  
  paymentMethods.forEach(method => {
    method.addEventListener('change', (e) => {
      // Hide all forms
      document.querySelectorAll('.payment-form').forEach(form => {
        form.classList.add('hidden');
      });
      
      // Show selected form
      const selectedForm = document.getElementById(`${e.target.value}Form`);
      if (selectedForm) {
        selectedForm.classList.remove('hidden');
      }
    });
  });
}

// Process payment
function processPayment() {
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
  
  // Simulate payment processing
  const loadingMessage = document.createElement('div');
  loadingMessage.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  loadingMessage.innerHTML = `
    <div class="bg-white rounded-xl p-8 text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-lg font-semibold">Processing your order...</p>
    </div>
  `;
  document.body.appendChild(loadingMessage);
  
  setTimeout(() => {
    document.body.removeChild(loadingMessage);
    completeOrder();
  }, 2000);
}

// Complete order
function completeOrder() {
  // Generate order number
  const orderNumber = 'ORD-' + Date.now();
  document.getElementById('orderNumber').textContent = '#' + orderNumber;
  
  // Save order to localStorage (in production, this would be sent to server)
  const cart = JSON.parse(localStorage.getItem('esmartboardCart') || '[]');
  const customerInfo = JSON.parse(localStorage.getItem('customerInfo') || '{}');
  
  const order = {
    orderNumber,
    date: new Date().toISOString(),
    items: cart,
    customerInfo,
    subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    discount: discountAmount,
    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) - discountAmount
  };
  
  // Store order
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // Clear cart
  localStorage.removeItem('esmartboardCart');
  
  // Move to confirmation step
  nextStep(4);
  
  // Send confirmation email (simulated)
  sendOrderConfirmation(order);
}

// Simulate sending confirmation email
function sendOrderConfirmation(order) {
  const serviceId = 'YOUR_EMAILJS_SERVICE_ID';
  const templateId = 'YOUR_EMAILJS_TEMPLATE_ID';

  if (!window.emailjs) {
    console.warn('EmailJS not loaded. Skipping email send.');
    return;
  }

  const itemsSummary = order.items
    .map(item => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString()}`)
    .join('\n');

  const templateParams = {
    order_number: order.orderNumber,
    order_date: new Date(order.date).toLocaleString(),
    customer_name: `${order.customerInfo.firstName || ''} ${order.customerInfo.lastName || ''}`.trim(),
    customer_email: order.customerInfo.email || '',
    customer_phone: order.customerInfo.phone || '',
    organization: order.customerInfo.organization || '',
    address: order.customerInfo.address || '',
    city: order.customerInfo.city || '',
    county: order.customerInfo.county || '',
    postal_code: order.customerInfo.postalCode || '',
    subtotal: `$${order.subtotal.toLocaleString()}`,
    discount: order.discount > 0 ? `-$${order.discount.toLocaleString()}` : '$0',
    total: `$${order.total.toLocaleString()}`,
    items: itemsSummary
  };

  emailjs.send(serviceId, templateId, templateParams)
    .then(() => {
      console.log('Order confirmation sent to:', order.customerInfo.email);
    })
    .catch((error) => {
      console.error('Failed to send order confirmation:', error);
    });
}
