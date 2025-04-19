import { getEbookById } from './store.js';

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

    showLoadingState(button) {
        if (button) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        }
    }

    hideLoadingState(button) {
        if (button) {
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Pedido';
        }
    }

    async processOrder(orderData) {
        const submitBtn = document.querySelector('.proceed-payment-btn');
        try {
            this.showLoadingState(submitBtn);
            // ... proceso de orden ...
            return true;
        } catch (error) {
            console.error('Error al procesar la orden:', error);
            return false;
        } finally {
            this.hideLoadingState(submitBtn);
        }
    }
}

// Initialize cart
const cart = new Cart();

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
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

        async processOrder(orderData) {
            try {
                const submitBtn = document.querySelector('.proceed-payment-btn');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
                }

                // ... proceso de orden ...

                return true;
            } catch (error) {
                console.error('Error al procesar la orden:', error);
                return false;
            } finally {
                const submitBtn = document.querySelector('.proceed-payment-btn');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Pedido';
                }
            }
        }
    }

    const cart = new Cart();

    // Manejadores de eventos
    document.addEventListener('click', function(e) {
        // Botón de agregar al carrito
        if (e.target.closest('.add-to-cart-btn')) {
            const modalBookInfo = document.querySelector('.modal-book-info');
            if (!modalBookInfo) {
                console.log('No se encontró la información del libro');
                return;
            }

            const bookInfo = {
                id: modalBookInfo.dataset.bookId,
                title: document.getElementById('modalBookTitle')?.textContent || '',
                price: parseFloat(document.getElementById('modalBookPrice')?.textContent?.replace('$', '') || '0'),
                image: document.getElementById('modalBookCover')?.src || ''
            };

            console.log('Agregando libro:', bookInfo);
            cart.addItem(bookInfo);
        }

        // Botón de comprar ahora
        if (e.target.closest('.buy-now-btn')) {
            const summaryTitle = document.getElementById('summaryBookTitle');
            const summaryPrice = document.getElementById('summaryPrice');
            
            if (!summaryTitle || !summaryPrice) {
                console.error('Elementos de resumen no encontrados');
                return;
            }

            const bookTitle = document.getElementById('modalBookTitle')?.textContent || '';
            const bookPrice = document.getElementById('modalBookPrice')?.textContent || '';

            summaryTitle.textContent = bookTitle;
            summaryPrice.textContent = bookPrice;

            document.getElementById('bookModal').style.display = 'none';
            document.getElementById('paymentModal').style.display = 'block';
        }
    });

    // Exportar instancia del carrito
    window.carrito = cart;

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
        const fileInput = document.getElementById('comprobante');
        const file = fileInput.files[0];
        
        // Convertir el archivo a base64
        const base64File = await fileToBase64(file);
        
        const templateParams = {
            libro: document.getElementById('summaryBookTitle').textContent,
            de_nombre: formData.get('nombre'),
            de_correo_electronico: formData.get('email'),
            telefono: formData.get('telefono'),
            precio: document.getElementById('summaryPrice').textContent,
            comprobante: base64File
        };

        console.log('Enviando email con parámetros:', templateParams);

        const response = await emailjs.send(
            "service_kfjagfc",      // Tu Service ID
            "template_f01zwii",     // Tu Template ID
            templateParams
        );

        console.log('Respuesta de EmailJS:', response);

        if (response.status !== 200) {
            throw new Error('Error al enviar el email');
        }

        return response;
    }

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    function addToCart(bookId) {
        const book = getEbookById(bookId); // Usar la función importada
        const bookInfo = {
            id: book.id,
            title: book.title,
            price: book.price,
            quantity: 1
        };
        cart.addItem(bookInfo);
    }
});
