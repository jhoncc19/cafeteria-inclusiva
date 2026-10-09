const API_URL = '/api';
let productModal;
let editingProductId = null;

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    productModal = new bootstrap.Modal(document.getElementById('productModal'));
    loadProducts();
    loadUsers();
});

// ============ PRODUCTOS ============

// Leer productos
async function loadProducts() {
    try {
        const res = await fetch(`${API_URL}/products?limit=100`);
        const data = await res.json();
        
        const tbody = document.getElementById('productsTable');
        tbody.innerHTML = '';
        
        if (!data.success || data.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay productos</td></tr>';
            return;
        }
        
        data.data.forEach(product => {
            tbody.innerHTML += `
                <tr>
                    <td><img src="${product.image || 'https://via.placeholder.com/50'}" 
                             style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"></td>
                    <td>${product.name}</td>
                    <td><span class="badge bg-primary">${product.category}</span></td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>${product.stock}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editProduct('${product._id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product._id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Abrir modal para crear
function openProductModal() {
    editingProductId = null;
    document.getElementById('productModalTitle').textContent = 'Nuevo Producto';
    document.getElementById('productForm').reset();
    productModal.show();
}

// Abrir modal para editar
async function editProduct(id) {
    try {
        const res = await fetch(`${API_URL}/products/${id}`);
        const data = await res.json();
        
        if (data.success) {
            const p = data.data;
            document.getElementById('productModalTitle').textContent = 'Editar Producto';
            document.getElementById('productName').value = p.name;
            document.getElementById('productCategory').value = p.category;
            document.getElementById('productPrice').value = p.price;
            document.getElementById('productStock').value = p.stock;
            document.getElementById('productDescription').value = p.description || '';
            document.getElementById('productImage').value = p.image || '';
            editingProductId = id;
            productModal.show();
        }
    } catch (error) {
        alert('Error al cargar producto');
    }
}

// Guardar (crear o actualizar)
async function saveProduct() {
    const productData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        description: document.getElementById('productDescription').value,
        image: document.getElementById('productImage').value
    };

    try {
        const url = editingProductId 
            ? `${API_URL}/products/${editingProductId}` 
            : `${API_URL}/products`;
        
        const method = editingProductId ? 'PUT' : 'POST';
        
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        
        const data = await res.json();
        
        if (data.success) {
            productModal.hide();
            loadProducts();
            alert('✅ Producto guardado');
        } else {
            alert('❌ ' + data.error);
        }
    } catch (error) {
        alert('Error al guardar');
    }
}

// Eliminar
async function deleteProduct(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    
    try {
        const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
        const data = await res.json();
        
        if (data.success) {
            loadProducts();
            alert('✅ Producto eliminado');
        }
    } catch (error) {
        alert('Error al eliminar');
    }
}

// ============ USUARIOS ============

async function loadUsers() {
    try {
        const res = await fetch(`${API_URL}/users`);
        const data = await res.json();
        
        const tbody = document.getElementById('usersTable');
        tbody.innerHTML = '';
        
        if (!data.success || data.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">No hay usuarios</td></tr>';
            return;
        }
        
        data.data.forEach(user => {
            tbody.innerHTML += `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td><span class="badge bg-info">${user.role}</span></td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="deleteUser('${user._id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deleteUser(id) {
    if (!confirm('¿Eliminar este usuario?')) return;
    
    try {
        await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
        loadUsers();
    } catch (error) {
        alert('Error al eliminar');
    }
}