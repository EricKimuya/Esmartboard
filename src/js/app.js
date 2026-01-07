const swiper = new Swiper('#featured-products', {
  slidesPerView: 1,
  spaceBetween: 20,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    640: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
  mobileMenu.classList.toggle('show');
});

const cartButton = document.getElementById('cartButton');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const clearCart = document.getElementById('clearCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartSubtotal = document.getElementById('cartSubtotal');

let cart = [];

if (localStorage.getItem('esmartboardCart')) {
  cart = JSON.parse(localStorage.getItem('esmartboardCart'));
  updateCartUI();
}

cartButton.addEventListener('click', () => {
  cartSidebar.classList.add('show');
  document.body.style.overflow = 'hidden';
});

closeCart.addEventListener('click', () => {
  cartSidebar.classList.remove('show');
  document.body.style.overflow = '';
});

clearCart.addEventListener('click', () => {
  cart = [];
  saveCart();
  updateCartUI();
});

function addToCart(name, price, quantity = 1) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ name, price, quantity });
  }

  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('esmartboardCart', JSON.stringify(cart));
}

function updateCartUI() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;

  if (cart.length === 0) {
    cartItems.innerHTML = 'Your cart is empty';
    cartSubtotal.textContent = '$0.00';
    return;
  }

  let subtotal = 0;
  cartItems.innerHTML = '';

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    cartItems.innerHTML += `
      <div>
        <strong>${item.name}</strong>
        <span>$${itemTotal.toFixed(2)}</span>
      </div>
    `;
  });

  cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
}
