class Cart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.init();
    }

    init() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const { items, total } = JSON.parse(savedCart);
            this.items = items;
            this.total = total;
        }
        this.updateCartUI();
    }

    addItem(book) {
        this.items.push(book);
        this.calculateTotal();
        this.saveCart();
        this.updateCartUI();
        this.showNotification('Producto agregado al carrito');
    }

    removeItem(bookId) {
        this.items = this.items.filter(item => item.id !== bookId);
        this.calculateTotal();
        this.saveCart();
        this.updateCartUI();
    }

    calculateTotal() {
        this.total = this.items.reduce((sum, item) => sum + item.price, 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify({
            items: this.items,
            total: this.total
        }));
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.items.length;
        }
    }
}

// Initialize cart
const cart = new Cart();

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const buyNowBtn = document.querySelector('.buy-now-btn');
    const paymentModal = document.getElementById('paymentModal');
    const purchaseForm = document.getElementById('purchaseForm');

    // Add to cart button
    addToCartBtn?.addEventListener('click', function() {
        const bookInfo = {
            id: this.dataset.bookId,
            title: document.getElementById('modalBookTitle').textContent,
            price: parseFloat(document.getElementById('modalBookPrice').textContent.replace('$', '')),
            quantity: 1
        };
        cart.addItem(bookInfo);
    });

    // Buy now button
    buyNowBtn?.addEventListener('click', function() {
        const bookInfo = {
            title: document.getElementById('modalBookTitle').textContent,
            price: document.getElementById('modalBookPrice').textContent
        };
        
        // Update payment modal with book info
        document.getElementById('summaryBookTitle').textContent = bookInfo.title;
        document.getElementById('summaryPrice').textContent = bookInfo.price;
        
        // Show payment modal
        document.getElementById('bookModal').style.display = 'none';
        paymentModal.style.display = 'block';
    });

    // Purchase form submission
    purchaseForm?.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const fileInput = document.getElementById('comprobante');
        
        if (!fileInput.files[0]) {
            alert('Por favor adjunte el comprobante de pago');
            return;
        }

        showLoadingState();
        
        try {
            // Here you would add the EmailJS logic to send the form data
            await sendPurchaseEmail(formData);
            showSuccessMessage(formData.get('email'));
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al procesar su pedido. Por favor intente nuevamente.');
        } finally {
            hideLoadingState();
        }
    });

    function showLoadingState() {
        const btn = document.querySelector('.proceed-payment-btn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    }

    function hideLoadingState() {
        const btn = document.querySelector('.proceed-payment-btn');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Pedido';
    }

    function showSuccessMessage(email) {
        const modal = document.getElementById('paymentModal');
        modal.innerHTML = `
            <div class="modal-content payment-modal">
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h2>¡Pedido Enviado!</h2>
                    <p>Hemos recibido tu pedido correctamente.</p>
                    <p>Una vez verificado el pago, enviaremos el eBook a: ${email}</p>
                    <button onclick="location.reload()" class="close-success-btn">
                        Aceptar
                    </button>
                </div>
            </div>
        `;
    }

    async function sendPurchaseEmail(formData) {
        // Simulate email sending - Replace with actual EmailJS implementation
        return new Promise(resolve => setTimeout(resolve, 2000));
    }
});