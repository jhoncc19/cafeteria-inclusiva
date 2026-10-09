// ============ NAVBAR Y FOOTER AUTOMÁTICOS ============
document.addEventListener('DOMContentLoaded', function() {
    insertNavbar();
    insertFooter();
});

function insertNavbar() {
    const currentPage = getCurrentPage();
    
    const navbarHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
            <div class="container">
                <a class="navbar-brand" href="index.html">
                    <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=50&h=50&fit=crop" alt="Café Aroma" class="rounded-circle me-2" width="40" height="40">
                    <span class="brand-text">Café Aroma</span>
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <a class="nav-link ${currentPage === 'index' ? 'active' : ''}" href="index.html">
                                <i class="fas fa-home me-1"></i> Inicio
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${currentPage === 'menu' ? 'active' : ''}" href="menu.html">
                                <i class="fas fa-utensils me-1"></i> Menú
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${currentPage === 'nosotros' ? 'active' : ''}" href="nosotros.html">
                                <i class="fas fa-users me-1"></i> Nosotros
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${currentPage === 'historia' ? 'active' : ''}" href="historia.html">
                                <i class="fas fa-book-open me-1"></i> Historia
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${currentPage === 'locales' ? 'active' : ''}" href="locales.html">
                                <i class="fas fa-map-marker-alt me-1"></i> Locales
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${currentPage === 'reservar' ? 'active' : ''}" href="reservar.html">
                                <i class="fas fa-calendar-check me-1"></i> Reservar
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${currentPage === 'mapa-ruido' ? 'active' : ''}" href="mapa-ruido.html">
                                <i class="fas fa-volume-down me-1"></i> Mapa de Ruido
                            </a>
                        </li>
                    </ul>
                    <button class="btn btn-outline-light ms-3 cart-button" onclick="showCartModal()">
                        <i class="fas fa-shopping-cart"></i>
                        <span class="badge bg-danger cart-badge" style="display: none;">0</span>
                    </button>
                    <ul class="navbar-nav">
                        <li class="nav-item ms-3">
                            <a class="nav-link" href="login.html" id="userLink">
                                <i class="fas fa-user me-1"></i> 
                                <span id="userName">Iniciar Sesión</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    `;
    
    // Insertar navbar al inicio del body
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
    
    // Inicializar el scroll del navbar
    initializeNavbarScroll();
}

function insertFooter() {
    const footerHTML = `
        <footer class="footer bg-dark text-white pt-5 pb-3 mt-5">
            <div class="container">
                <div class="row g-4">
                    <div class="col-lg-4 col-md-6">
                        <h5 class="mb-4"><i class="fas fa-coffee me-2"></i>Café Aroma</h5>
                        <p>Desde 1995 sirviendo el mejor café artesanal. Nuestra pasión por el café nos impulsa a ofrecer siempre la mejor experiencia.</p>
                        <div class="social-links mt-3">
                            <a href="#" class="me-3"><i class="fab fa-facebook"></i></a>
                            <a href="#" class="me-3"><i class="fab fa-instagram"></i></a>
                            <a href="#" class="me-3"><i class="fab fa-twitter"></i></a>
                            <a href="#"><i class="fab fa-tiktok"></i></a>
                        </div>
                    </div>
                    <div class="col-lg-2 col-md-6">
                        <h5 class="mb-4">Enlaces Rápidos</h5>
                        <ul class="list-unstyled">
                            <li class="mb-2"><a href="index.html" class="text-white">Inicio</a></li>
                            <li class="mb-2"><a href="menu.html" class="text-white">Menú</a></li>
                            <li class="mb-2"><a href="nosotros.html" class="text-white">Nosotros</a></li>
                            <li class="mb-2"><a href="historia.html" class="text-white">Historia</a></li>
                            <li><a href="locales.html" class="text-white">Locales</a></li>
                        </ul>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <h5 class="mb-4">Contacto</h5>
                        <p><i class="fas fa-phone me-2"></i>(555) 123-4567</p>
                        <p><i class="fas fa-envelope me-2"></i>info@cafearoma.com</p>
                        <p><i class="fas fa-clock me-2"></i>Lun-Sáb: 8:00 - 21:00</p>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <h5 class="mb-4">Ubicación Principal</h5>
                        <p><i class="fas fa-map-marker-alt me-2"></i>Av San Carlos 1980, Huancayo</p>
                        <a href="locales.html" class="btn btn-outline-light btn-sm">Ver todas las sedes</a>
                    </div>
                </div>
                <hr class="mt-4">
                <p class="text-center mb-0">&copy; 2026 Café Aroma. Todos los derechos reservados.</p>
            </div>
        </footer>
    `;
    
    // Insertar footer al final del body
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    if (!page || page === 'index.html') return 'index';
    if (page === 'menu.html') return 'menu';
    if (page === 'nosotros.html') return 'nosotros';
    if (page === 'historia.html') return 'historia';
    if (page === 'locales.html') return 'locales';
    if (page === 'reservar.html') return 'reservar';
    if (page === 'mapa-ruido.html') return 'mapa-ruido';
    if (page === 'login.html') return 'login';
    if (page === 'registro.html') return 'registro';
    
    return 'index';
}

function initializeNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// ============ ACTUALIZAR USUARIO ============
function updateUserDisplay() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const userName = document.getElementById('userName');
    const userLink = document.getElementById('userLink');
    
    if (user && userName) {
        userName.textContent = user.name.split(' ')[0];
        userLink.href = '#';
        userLink.onclick = (e) => {
            e.preventDefault();
            if (confirm('¿Cerrar sesión?')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'index.html';
            }
        };
    }
}

document.addEventListener('DOMContentLoaded', updateUserDisplay);