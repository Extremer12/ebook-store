// bookDetails.js

document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const detailsButtons = document.querySelectorAll('.details-button');
    const modal = document.getElementById('bookModal');
    const paymentModal = document.getElementById('paymentModal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const buyNowBtn = document.querySelector('.buy-now-btn');
    const purchaseForm = document.getElementById('purchaseForm');
    const fileInput = document.getElementById('comprobante');
    const filePreview = document.getElementById('file-preview');

    // Inicializar EmailJS
    emailjs.init("TU_PUBLIC_KEY"); // Reemplaza con tu public key de EmailJS

    // Event Listeners
    detailsButtons.forEach(button => {
        button.addEventListener('click', handleDetailsClick);
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', handleCloseModal);
    });

    buyNowBtn?.addEventListener('click', handleBuyNow);
    
    // Manejo de archivo adjunto
    fileInput?.addEventListener('change', handleFileSelect);

    // Manejo del formulario
    purchaseForm?.addEventListener('submit', handlePurchaseSubmit);

    function handleDetailsClick() {
        const bookCard = this.closest('.ebook');
        if (!bookCard) return;

        const data = {
            title: bookCard.querySelector('h3').textContent,
            price: bookCard.querySelector('.book-price').textContent,
            stars: bookCard.querySelector('.stars').textContent,
            rating: bookCard.querySelector('.rating-number').textContent,
            image: bookCard.querySelector('img').src
        };

        updateBookModal(data);
        modal.style.display = 'block';
    }

    function handleCloseModal() {
        modal.style.display = 'none';
        paymentModal.style.display = 'none';
    }

    function handleBuyNow() {
        modal.style.display = 'none';
        paymentModal.style.display = 'block';
    }

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        const fileSpan = document.querySelector('#upload-label span');
        fileSpan.textContent = file.name;

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                filePreview.innerHTML = `
                    <div class="preview-image">
                        <img src="${e.target.result}" alt="Preview">
                        <span class="file-name">${file.name}</span>
                    </div>
                `;
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'application/pdf') {
            filePreview.innerHTML = `
                <div class="preview-pdf">
                    <i class="fas fa-file-pdf"></i>
                    <span class="file-name">${file.name}</span>
                </div>
            `;
        }
    }

    async function handlePurchaseSubmit(e) {
        e.preventDefault();

        const submitBtn = document.querySelector('.proceed-payment-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        const formData = new FormData(this);
        const file = document.getElementById('comprobante').files[0];

        try {
            // Convert file to base64
            const base64File = await fileToBase64(file);

            // Prepare email data
            const emailData = {
                from_name: document.getElementById('nombre').value,
                from_email: document.getElementById('email').value,
                phone: document.getElementById('telefono').value,
                book_title: document.getElementById('modalBookTitle').textContent,
                book_price: document.getElementById('modalBookPrice').textContent,
                receipt: base64File,
                receipt_name: file.name
            };

            // Send email using EmailJS
            await emailjs.send(
                'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
                'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
                emailData
            );

            showSuccessMessage(emailData.from_email);
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage();
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Pedido';
        }
    }

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    function showSuccessMessage(email) {
        paymentModal.innerHTML = `
            <div class="modal-content payment-modal">
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h2>¡Pedido Enviado!</h2>
                    <p>Hemos recibido tu pedido correctamente.</p>
                    <p>Una vez verificado el pago, recibirás el eBook en: ${email}</p>
                    <button onclick="location.reload()" class="close-success-btn">
                        Aceptar
                    </button>
                </div>
            </div>
        `;
    }

    function showErrorMessage() {
        alert('Hubo un error al procesar tu pedido. Por favor, intenta nuevamente.');
    }

    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    function updateBookModal(data) {
        document.getElementById('modalBookTitle').textContent = data.title;
        document.getElementById('modalBookPrice').textContent = data.price;
        document.getElementById('modalBookRating').textContent = data.stars;
        document.getElementById('modalBookRatingNumber').textContent = data.rating;
        document.getElementById('modalBookCover').src = data.image;
    }

    // Cerrar modales al hacer click fuera
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
        if (e.target === paymentModal) paymentModal.style.display = 'none';
    });

    // Manejar cantidad
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    quantityBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            const currentValue = parseInt(input.value);
            
            if (this.classList.contains('minus') && currentValue > 1) {
                input.value = currentValue - 1;
            } else if (this.classList.contains('plus') && currentValue < 99) {
                input.value = currentValue + 1;
            }
        });
    });

    // Manejar los botones de cantidad en el modal
    const minusBtn = document.querySelector('.minus');
    const plusBtn = document.querySelector('.plus');
    const quantityInput = document.querySelector('.quantity-input');

    minusBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });

    plusBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value < 99) {
            quantityInput.value = value + 1;
        }
    });

    // Function to display the details of the selected eBook
    function displayBookDetails(book) {
        const titleElement = document.querySelector('.book-info h3');
        const priceElement = document.querySelector('.book-info .book-price');
        const ratingElement = document.querySelector('.book-info .book-rating');

        if (titleElement) titleElement.textContent = book.title;
        if (priceElement) priceElement.textContent = `$${book.price.toFixed(2)}`;
        if (ratingElement) ratingElement.textContent = `Rating: ${book.rating} stars`;
    }

    // Function to fetch eBook details based on the selected book ID
    function fetchBookDetails(bookId) {
        const books = [
            { 
                id: 1, 
                title: 'JavaScript Basics', 
                price: 9.99, 
                rating: 4.5 
            },
            { 
                id: 2, 
                title: 'CSS Mastery', 
                price: 14.99, 
                rating: 4.7 
            }
        ];

        const selectedBook = books.find(book => book.id === bookId);
        if (selectedBook) {
            displayBookDetails(selectedBook);
        } else {
            console.log('Book not found');
        }
    }

    // Solo ejecutar fetchBookDetails cuando se hace clic en el botón de detalles
    detailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookId = parseInt(this.closest('.ebook').dataset.id);
            fetchBookDetails(bookId);
        });
    });

    // Manejar el formulario de compra
    purchaseForm?.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        showLoadingState();
        
        try {
            // Simular envío de email
            await simulateEmailSending(formData);
            showSuccessMessage();
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage();
        } finally {
            hideLoadingState();
        }
    });

    function showLoadingState() {
        const btn = document.querySelector('.proceed-payment-btn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        }
    }

    function hideLoadingState() {
        const btn = document.querySelector('.proceed-payment-btn');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Pedido';
        }
    }

    function showSuccessMessage() {
        const paymentModal = document.getElementById('paymentModal');
        if (paymentModal) {
            paymentModal.innerHTML = `
                <div class="modal-content payment-modal">
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <h2>¡Pedido Enviado!</h2>
                        <p>Hemos recibido tu solicitud correctamente.</p>
                        <p>Una vez verificado el pago, recibirás el eBook en tu correo.</p>
                        <button onclick="location.reload()" class="close-success-btn">
                            Aceptar
                        </button>
                    </div>
                </div>
            `;
        }
    }

    function showErrorMessage() {
        alert('Hubo un error al procesar tu pedido. Por favor, intenta nuevamente.');
    }

    function simulateEmailSending(formData) {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    // Mostrar nombre del archivo seleccionado
    fileInput?.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Actualizar texto del label
            uploadLabel.querySelector('span').textContent = file.name;

            // Mostrar preview si es imagen
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    filePreview.innerHTML = `
                        <div class="preview-image">
                            <img src="${e.target.result}" alt="Preview">
                            <span class="file-name">${file.name}</span>
                        </div>
                    `;
                };
                reader.readAsDataURL(file);
            } else {
                // Si es PDF mostrar ícono
                filePreview.innerHTML = `
                    <div class="preview-pdf">
                        <i class="fas fa-file-pdf"></i>
                        <span class="file-name">${file.name}</span>
                    </div>
                `;
            }
        }
    });

    // Manejar envío del formulario
    purchaseForm?.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nombre', document.getElementById('nombre').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('telefono', document.getElementById('telefono').value);
        formData.append('libro', document.getElementById('modalBookTitle').textContent);
        formData.append('precio', document.getElementById('modalBookPrice').textContent);
        formData.append('comprobante', fileInput.files[0]);

        // Mostrar estado de carga
        const submitBtn = document.querySelector('.proceed-payment-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        try {
            // Enviar email usando EmailJS
            await emailjs.send(
                'YOUR_SERVICE_ID',
                'YOUR_TEMPLATE_ID',
                {
                    to_email: 'cristianbordon258@gmail.com',
                    from_name: formData.get('nombre'),
                    from_email: formData.get('email'),
                    telefono: formData.get('telefono'),
                    libro: formData.get('libro'),
                    precio: formData.get('precio')
                }
            );

            showSuccessMessage();
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage();
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Pedido';
        }
    });
});