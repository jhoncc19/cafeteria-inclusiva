// ============ VARIABLES GLOBALES ============
const ORDER_STORAGE_KEY = 'cafe_aroma_orders';
const SUBSCRIBERS_STORAGE_KEY = 'cafe_aroma_subscribers';
const MESSAGES_STORAGE_KEY = 'cafe_aroma_messages';
let cart = [];
let currentTestimonial = 0;
let testimonialInterval;

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Inicializar carrito desde localStorage
    loadCartFromStorage();
    
    // Mostrar loader
    showLoader();
    
    // Inicializar componentes
    initializeOrderButtons();
    initializeNewsletterForm();
    initializeContactForm();
    initializeMenuFilter();
    initializeTestimonialsSlider();
    updateCartBadge();
    
    // Ocultar loader después de cargar
    setTimeout(hideLoader, 1500);
}

// ============ LOADER ============
function showLoader() {
    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
        loader.style.display = 'flex';
    }
}

function hideLoader() {
    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
}

// ============ CARRITO DE COMPRAS ============
function loadCartFromStorage() {
    const savedCart = localStorage.getItem(ORDER_STORAGE_KEY);
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            cart = [];
        }
    }
}

function saveCartToStorage() {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(cart));
}

function addToCart(product, price) {
    const existingItem = cart.find(item => item.product === product);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            product: product,
            price: price,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartBadge();
    showNotification(`${product} agregado al carrito`, 'success');
}

function removeFromCart(product) {
    cart = cart.filter(item => item.product !== product);
    saveCartToStorage();
    updateCartBadge();
    
    // Actualizar modal si está abierto
    const modal = document.querySelector('.cart-modal');
    if (modal) {
        showCartModal();
    }
}

function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    badges.forEach(badge => {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
    });
}

function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function clearCart() {
    cart = [];
    saveCartToStorage();
    updateCartBadge();
}

// ============ BOTONES DE ORDEN ============
function initializeOrderButtons() {
    const orderButtons = document.querySelectorAll('.btn-order');
    
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = this.dataset.product;
            const price = parseFloat(this.dataset.price);
            
            if (product && price) {
                addToCart(product, price);
                
                // Animación del botón
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check me-1"></i> Agregado';
                this.classList.add('btn-success');
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.classList.remove('btn-success');
                    this.disabled = false;
                }, 1500);
            }
        });
    });
}

// ============ FILTRO DE MENÚ ============
function initializeMenuFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                // Actualizar botones activos
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filtrar items
                menuItems.forEach(item => {
                    const category = item.dataset.category;
                    
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

// ============ SLIDER DE TESTIMONIOS ============
function initializeTestimonialsSlider() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    
    if (testimonials.length > 1) {
        // Mostrar solo el primer testimonio
        showTestimonial(0);
        
        // Auto-avanzar cada 5 segundos
        testimonialInterval = setInterval(() => {
            changeTestimonial(1);
        }, 5000);
    }
}

function changeTestimonial(direction) {
    const testimonials = document.querySelectorAll('.testimonial-card');
    
    if (testimonials.length === 0) return;
    
    currentTestimonial = (currentTestimonial + direction + testimonials.length) % testimonials.length;
    showTestimonial(currentTestimonial);
    
    // Resetear el intervalo
    clearInterval(testimonialInterval);
    testimonialInterval = setInterval(() => {
        changeTestimonial(1);
    }, 5000);
}

function showTestimonial(index) {
    const testimonials = document.querySelectorAll('.testimonial-card');
    
    testimonials.forEach((testimonial, i) => {
        if (i === index) {
            testimonial.classList.add('active');
        } else {
            testimonial.classList.remove('active');
        }
    });
}

// ============ FORMULARIO NEWSLETTER ============
function initializeNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (validateEmail(email)) {
                // Guardar suscriptor
                const subscribers = JSON.parse(localStorage.getItem(SUBSCRIBERS_STORAGE_KEY) || '[]');
                
                // Verificar si ya está suscrito
                if (subscribers.some(sub => sub.email === email)) {
                    showNotification('Ya estás suscrito a nuestro newsletter', 'error');
                    return;
                }
                
                subscribers.push({
                    email: email,
                    date: new Date().toISOString()
                });
                
                localStorage.setItem(SUBSCRIBERS_STORAGE_KEY, JSON.stringify(subscribers));
                
                showNotification('¡Gracias por suscribirte! Recibirás nuestras novedades', 'success');
                this.reset();
            } else {
                showNotification('Por favor ingresa un email válido', 'error');
            }
        });
    }
}

// ============ FORMULARIO CONTACTO ============
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: this.querySelector('#name')?.value || '',
                email: this.querySelector('#email')?.value || '',
                phone: this.querySelector('#phone')?.value || '',
                message: this.querySelector('#message')?.value || '',
                date: new Date().toISOString()
            };
            
            // Validar
            if (!formData.name || !formData.email || !formData.message) {
                showNotification('Todos los campos son obligatorios', 'error');
                return;
            }
            
            if (!validateEmail(formData.email)) {
                showNotification('Email inválido', 'error');
                return;
            }
            
            // Guardar mensaje
            const messages = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || '[]');
            messages.push(formData);
            localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
            
            showNotification('Mensaje enviado exitosamente. Te contactaremos pronto.', 'success');
            this.reset();
        });
    }
}

// ============ NOTIFICACIONES ============
function showNotification(message, type = 'success') {
    // Eliminar notificaciones existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    notification.innerHTML = `<i class="fas ${icon} me-2"></i>${message}`;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-100%)';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// ============ MODAL DE CARRITO ============
function showCartModal() {
    const existingModal = document.querySelector('.cart-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.onclick = function(e) {
        if (e.target === this) {
            this.remove();
        }
    };
    
    let cartContent = `
        <div class="cart-content bg-white p-4 rounded">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="mb-0"><i class="fas fa-shopping-cart me-2"></i>Tu Carrito</h2>
                <button class="btn-close" onclick="this.closest('.cart-modal').remove()"></button>
            </div>
    `;
    
    if (cart.length === 0) {
        cartContent += `
            <div class="text-center py-4">
                <i class="fas fa-shopping-cart mb-3" style="font-size: 3rem;"></i>
                <p>Tu carrito está vacío</p>
                <a href="menu.html" class="btn btn-primary">Ver Menú</a>
            </div>
        `;
    } else {
        cartContent += '<div class="cart-items">';
        cart.forEach(item => {
            cartContent += `
                <div class="cart-item d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
                    <div>
                        <h6 class="mb-1">${item.product}</h6>
                        <small class="text-muted">${item.quantity} x $${item.price.toFixed(2)}</small>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="fw-bold me-3">$${(item.price * item.quantity).toFixed(2)}</span>
                        <button class="btn btn-sm btn-danger" onclick="removeFromCart('${item.product}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        cartContent += '</div>';
        
        cartContent += `
            <div class="cart-total d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
                <span class="fw-bold">Total:</span>
                <span class="fs-5 fw-bold">$${calculateTotal().toFixed(2)}</span>
            </div>
            <div class="d-grid gap-2">
                <button class="btn btn-primary" onclick="checkout()">
                    <i class="fas fa-credit-card me-2"></i>Proceder al Pago
                </button>
                <button class="btn btn-outline-danger" onclick="clearCart(); showCartModal();">
                    <i class="fas fa-trash me-2"></i>Vaciar Carrito
                </button>
            </div>
        `;
    }
    
    cartContent += '</div>';
    modal.innerHTML = cartContent;
    document.body.appendChild(modal);
    
    // Animación de entrada
    const cartContentElement = modal.querySelector('.cart-content');
    cartContentElement.style.transform = 'scale(0.8)';
    cartContentElement.style.opacity = '0';
    cartContentElement.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
        cartContentElement.style.transform = 'scale(1)';
        cartContentElement.style.opacity = '1';
    }, 50);
}

function checkout() {
    if (cart.length === 0) return;
    
    showNotification('¡Gracias por tu compra! Tu pedido está siendo preparado', 'success');
    clearCart();
    
    // Cerrar modal
    const modal = document.querySelector('.cart-modal');
    if (modal) {
        modal.remove();
    }
}

// ============ VALIDACIONES ============
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\(\)]{7,}$/;
    return phoneRegex.test(phone);
}

// ============ EXPORTACIÓN DE FUNCIONES ============
window.cafeteriaApp = {
    addToCart,
    removeFromCart,
    showCartModal,
    showNotification,
    validateEmail,
    validatePhone,
    clearCart,
    checkout,
    changeTestimonial
};