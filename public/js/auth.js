// ============ UTILIDADES ============

// Guardar token y usuario
function saveAuth(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

// Obtener token
function getToken() {
    return localStorage.getItem('token');
}

// Obtener usuario
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
}

// Verificar si está autenticado
function isAuthenticated() {
    return !!getToken();
}

// Realizar petición autenticada
async function authFetch(url, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return fetch(url, { ...options, headers });
}

// ============ REGISTRO ============
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleRegister(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPassword').value,
        phone: document.getElementById('regPhone').value,
        neuroProfile: {
            type: document.getElementById('regNeuroType').value,
            defaultPreferences: {
                noiseLevel: document.getElementById('regNoise').value,
                lighting: document.getElementById('regLighting').value,
                seating: document.getElementById('regSeating').value,
                musicVolume: document.getElementById('regMusic').value,
                preferPictogramMenu: document.getElementById('regPictogram').checked
            }
        }
    };
    
    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const data = await res.json();
        
        if (data.success) {
            saveAuth(data.data.token, data.data.user);
            alert('✅ Registro exitoso');
            window.location.href = '/reservar.html';
        } else {
            alert('❌ ' + (data.error || 'Error al registrarse'));
        }
    } catch (error) {
        alert('Error de conexión');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const credentials = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };
    
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        
        const data = await res.json();
        
        if (data.success) {
            saveAuth(data.data.token, data.data.user);
            alert('✅ Bienvenido ' + data.data.user.name);
            
            // Redirigir según rol
            if (data.data.user.role === 'admin') {
                window.location.href = '/admin.html';
            } else {
                window.location.href = '/reservar.html';
            }
        } else {
            alert('❌ ' + (data.error || 'Credenciales inválidas'));
        }
    } catch (error) {
        alert('Error de conexión');
    }
}