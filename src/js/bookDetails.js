import { fetchEbooks, getEbookById } from './store.js';

// bookDetails.js

document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const detailsButtons = document.querySelectorAll('.details-button');
    const modal = document.getElementById('bookModal');
    const paymentModal = document.getElementById('paymentModal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const buyNowBtn = document.querySelector('.buy-now-btn');
    const fileInput = document.getElementById('comprobante');
    const filePreview = document.getElementById('file-preview');
    const purchaseForm = document.getElementById('purchaseForm');
    const uploadLabel = document.getElementById('upload-label');

    // Inicializar EmailJS
    emailjs.init("-avaKSi0GQ1MQ2I-4"); // Reemplaza con tu public key de EmailJS

    // Event Listeners
    detailsButtons.forEach(button => {
        button.addEventListener('click', handleDetailsClick);
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', handleCloseModal);
    });

    buyNowBtn?.addEventListener('click', handleBuyNow);
    
    // Manejo de archivo
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }

    // Manejo del formulario
    if (purchaseForm) {
        purchaseForm.addEventListener('submit', handleFormSubmit);
    }

    // Función para manejar la selección de archivos
    async function handleFileSelect(e) {
        const file = e.target.files[0];
        console.log('Archivo seleccionado:', file); // Debug

        if (!file) {
            filePreview.innerHTML = '';
            return;
        }

        // Actualizar label
        const span = uploadLabel?.querySelector('span');
        if (span) span.textContent = file.name;

        // Limpiar preview anterior
        filePreview.innerHTML = '';

        // Crear preview según tipo de archivo
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.style.cssText = `
                max-width: 200px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                margin: 10px auto;
                display: block;
            `;
            filePreview.appendChild(img);
            console.log('Preview de imagen creado'); // Debug
        } else if (file.type === 'application/pdf') {
            const div = document.createElement('div');
            div.className = 'preview-pdf';
            div.innerHTML = `
                <i class="fas fa-file-pdf"></i>
                <span class="file-name">${file.name}</span>
            `;
            filePreview.appendChild(div);
            console.log('Preview de PDF creado'); // Debug
        }
    }

    // Función para manejar el envío del formulario
    async function handleFormSubmit(e) {
        e.preventDefault();
        console.log('Iniciando envío del formulario'); // Debug

        const submitBtn = document.querySelector('.proceed-payment-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        try {
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;
            const libro = document.getElementById('modalBookTitle').textContent;
            const precio = document.getElementById('modalBookPrice').textContent;
            const file = fileInput.files[0];

            if (!file) {
                throw new Error('Por favor adjunta el comprobante de pago');
            }

            const base64File = await fileToBase64(file);
            console.log('Archivo convertido a base64'); // Debug

            const templateParams = {
                libro: libro,
                de_nombre: nombre,
                de_correo_electronico: email,
                telefono: telefono,
                precio: precio,
                comprobante: base64File
            };

            console.log('Enviando email...'); // Debug

            const response = await emailjs.send(
                'service_kfjagfc',    // Tu Service ID
                'template_f01zwii',   // Tu Template ID
                templateParams
            );

            console.log('Respuesta EmailJS:', response); // Debug

            if (response.status === 200) {
                alert(`¡Pedido enviado con éxito! Recibirás el eBook en ${email} una vez verificado el pago.`);
                document.getElementById('paymentModal').style.display = 'none';
                purchaseForm.reset();
                filePreview.innerHTML = '';
                uploadLabel.querySelector('span').textContent = 'Adjuntar comprobante de pago';
            } else {
                throw new Error('Error en el envío del email');
            }

        } catch (error) {
            console.error('Error detallado:', error); // Debug
            alert('Error al enviar el pedido: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Pedido';
        }
    }

    // Función auxiliar para convertir archivo a base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

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

    async function handlePurchaseSubmit(e) {
        e.preventDefault();
        console.log('Iniciando envío del formulario...');

        const submitBtn = document.querySelector('.proceed-payment-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        try {
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;
            const libro = document.getElementById('modalBookTitle').textContent;
            const precio = document.getElementById('modalBookPrice').textContent;
            const fileInput = document.getElementById('comprobante');

            if (!fileInput.files || !fileInput.files[0]) {
                throw new Error('Por favor adjunta el comprobante de pago');
            }

            const file = fileInput.files[0];
            const base64File = await fileToBase64(file);

            // Usar exactamente los mismos nombres que en la prueba exitosa de EmailJS
            const templateParams = {
                libro: libro,
                de_nombre: nombre,
                de_correo_electronico: email,
                telefono: telefono,
                precio: precio,
                comprobante: base64File
            };

            console.log('Enviando email con parámetros:', templateParams);

            const response = await emailjs.send(
                "service_kfjagfc",      // Tu Service ID verificado
                "template_f01zwii",     // Tu Template ID
                templateParams
            );

            console.log('Respuesta de EmailJS:', response);

            if (response.status === 200) {
                alert(`¡Pedido enviado con éxito! Recibirás el eBook en ${email} una vez verificado el pago.`);
                document.getElementById('paymentModal').style.display = 'none';
                document.getElementById('purchaseForm').reset();
                document.getElementById('file-preview').innerHTML = '';
            } else {
                throw new Error('Error en el envío del email');
            }

        } catch (error) {
            console.error('Error detallado:', error);
            alert('Error al enviar el pedido: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Pedido';
        }
    }

    function showSuccessMessage(email) {
        alert(`¡Pedido enviado con éxito! Recibirás el eBook en ${email} una vez verificado el pago.`);
        document.getElementById('paymentModal').style.display = 'none';
        document.getElementById('purchaseForm').reset();
    }

    function showErrorMessage() {
        alert('Hubo un error al procesar el pedido. Por favor, intenta nuevamente.');
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

    // Agregar verificación antes de usar los botones
    if (minusBtn && plusBtn && quantityInput) {
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
    }

    // Function to display the details of the selected eBook
    function displayBookDetails(bookId) {
        const book = getEbookById(bookId); // Ahora puedes usar la función importada
        if (book) {
            const titleElement = document.querySelector('.book-info h3');
            const priceElement = document.querySelector('.book-info .book-price');
            const ratingElement = document.querySelector('.book-info .book-rating');

            if (titleElement) titleElement.textContent = book.title;
            if (priceElement) priceElement.textContent = `$${book.price.toFixed(2)}`;
            if (ratingElement) ratingElement.textContent = `Rating: ${book.rating} stars`;
        }
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

    function reinitializePurchaseForm() {
        if (purchaseForm) {
            // Remover handlers existentes
            const newPurchaseForm = purchaseForm.cloneNode(true);
            purchaseForm.parentNode.replaceChild(newPurchaseForm, purchaseForm);
            
            // Remover los otros event listeners y agregar solo el principal
            newPurchaseForm.addEventListener('submit', handlePurchaseSubmit);
            
            // Actualizar la referencia
            return newPurchaseForm;
        }
        return null;
    }

    // Inicializar el formulario
    const updatedForm = reinitializePurchaseForm();
});

document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('comprobante');
    const filePreview = document.getElementById('file-preview');
    const purchaseForm = document.getElementById('purchaseForm');

    // Función para comprimir imagen
    async function compressImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calcular nuevas dimensiones manteniendo proporción
                    if (width > height) {
                        if (width > 800) {
                            height *= 800 / width;
                            width = 800;
                        }
                    } else {
                        if (height > 800) {
                            width *= 800 / height;
                            height = 800;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Convertir a base64 con calidad reducida
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(compressedBase64);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // Manejador de archivo
    if (fileInput) {
        fileInput.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (!file) return;

            console.log('Archivo seleccionado:', file.name, 'Tamaño:', file.size/1024/1024, 'MB');

            // Mostrar preview
            filePreview.innerHTML = '';
            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.style.cssText = 'max-width: 200px; margin: 10px auto; display: block; border-radius: 8px;';
                filePreview.appendChild(img);
            } else if (file.type === 'application/pdf') {
                filePreview.innerHTML = `
                    <div class="preview-pdf">
                        <i class="fas fa-file-pdf"></i>
                        <span class="file-name">${file.name}</span>
                    </div>`;
            }
        });
    }

    // Manejador del formulario
    if (purchaseForm) {
        purchaseForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const form = e.target; // Guardar referencia al formulario actual
            const submitBtn = form.querySelector('.proceed-payment-btn');
            
            try {
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                }

                const file = fileInput?.files[0];
                if (!file) {
                    throw new Error('Por favor adjunta el comprobante de pago');
                }

                let comprobante;
                if (file.type.startsWith('image/')) {
                    comprobante = await compressImage(file);
                } else if (file.type === 'application/pdf') {
                    if (file.size > 500000) {
                        throw new Error('El PDF es demasiado grande. Máximo 500KB permitido');
                    }
                    comprobante = await fileToBase64(file);
                }

                const templateParams = {
                    libro: document.getElementById('modalBookTitle')?.textContent || '',
                    de_nombre: form.querySelector('#nombre')?.value || '',
                    de_correo_electronico: form.querySelector('#email')?.value || '',
                    telefono: form.querySelector('#telefono')?.value || '',
                    precio: document.getElementById('modalBookPrice')?.textContent || '',
                    comprobante: comprobante
                };

                const response = await emailjs.send(
                    'service_kfjagfc',
                    'template_f01zwii',
                    templateParams
                );

                if (response.status === 200) {
                    alert(`¡Pedido enviado con éxito! Recibirás el eBook en ${templateParams.de_correo_electronico} una vez verificado el pago.`);
                    if (form) {
                        form.reset();
                        filePreview.innerHTML = '';
                        const paymentModal = document.getElementById('paymentModal');
                        if (paymentModal) paymentModal.style.display = 'none';
                    }
                } else {
                    throw new Error('Error en el envío del email');
                }

            } catch (error) {
                console.error('Error detallado:', error);
                alert('Error: ' + (error.text || error.message || 'Error al procesar el pedido'));
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Pedido';
                }
            }
        });
    }

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
});

async function sendPurchaseEmail(formData) {
    try {
        const fileInput = document.getElementById('comprobante');
        const file = fileInput.files[0];
        
        if (!file) {
            throw new Error('No se encontró el archivo adjunto');
        }

        // Verificar tamaño del archivo
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > 5) {
            throw new Error('El archivo es demasiado grande. Máximo 5MB permitido');
        }

        // Convertir a base64 y comprimir si es necesario
        let base64File;
        if (file.type.startsWith('image/')) {
            base64File = await compressImage(file);
        } else {
            base64File = await fileToBase64(file);
        }

        const templateParams = {
            libro: document.getElementById('summaryBookTitle').textContent,
            de_nombre: formData.get('nombre'),
            de_correo_electronico: formData.get('email'),
            telefono: formData.get('telefono'),
            precio: document.getElementById('summaryPrice').textContent,
            comprobante: base64File
        };

        console.log('Enviando email...'); // Debug
        const response = await emailjs.send(
            'service_kfjagfc',
            'template_f01zwii',
            templateParams
        );

        console.log('Respuesta:', response); // Debug
        return response;

    } catch (error) {
        console.error('Error en sendPurchaseEmail:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const fileInput = document.getElementById('comprobante');
    const filePreview = document.getElementById('file-preview');
    const purchaseForm = document.getElementById('purchaseForm');
    const uploadLabel = document.getElementById('upload-label');
    
    // Inicializar EmailJS
    emailjs.init("-avaKSi0GQ1MQ2I-4");

    // Manejador de archivo
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }

    // Manejador del formulario - SOLO UN EVENT LISTENER
    if (purchaseForm) {
        purchaseForm.addEventListener('submit', handleFormSubmit);
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('.proceed-payment-btn');

        try {
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            }

            const file = fileInput?.files[0];
            if (!file) {
                throw new Error('Por favor adjunta el comprobante de pago');
            }

            let comprobante = await processFile(file);

            const templateParams = {
                libro: document.getElementById('modalBookTitle')?.textContent || '',
                de_nombre: form.querySelector('#nombre')?.value || '',
                de_correo_electronico: form.querySelector('#email')?.value || '',
                telefono: form.querySelector('#telefono')?.value || '',
                precio: document.getElementById('modalBookPrice')?.textContent || '',
                comprobante: comprobante
            };

            const response = await emailjs.send(
                'service_kfjagfc',
                'template_f01zwii',
                templateParams
            );

            if (response.status === 200) {
                alert(`¡Pedido enviado con éxito! Recibirás el eBook en ${templateParams.de_correo_electronico} una vez verificado el pago.`);
                resetForm(form);
            } else {
                throw new Error('Error en el envío del email');
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + (error.text || error.message || 'Error al procesar el pedido'));
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Pedido';
            }
        }
    }

    function resetForm(form) {
        if (form) {
            form.reset();
            if (filePreview) filePreview.innerHTML = '';
            if (uploadLabel) {
                const span = uploadLabel.querySelector('span');
                if (span) span.textContent = 'Adjuntar comprobante de pago';
            }
            const paymentModal = document.getElementById('paymentModal');
            if (paymentModal) paymentModal.style.display = 'none';
        }
    }

    async function processFile(file) {
        if (file.type.startsWith('image/')) {
            return await compressImage(file);
        } else if (file.type === 'application/pdf') {
            if (file.size > 500000) {
                throw new Error('El PDF es demasiado grande. Máximo 500KB permitido');
            }
            return await fileToBase64(file);
        }
        throw new Error('Tipo de archivo no soportado');
    }

    // ... resto del código existente (handleFileSelect, compressImage, fileToBase64) ...
});

document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const fileInput = document.getElementById('comprobante');
    const filePreview = document.getElementById('file-preview');
    const purchaseForm = document.getElementById('purchaseForm');
    const uploadLabel = document.getElementById('upload-label');

    // Event Listeners
    if (fileInput) {
        fileInput.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (!file) return;

            console.log('Archivo seleccionado:', file.name, 'Tamaño:', file.size/1024/1024, 'MB');

            // Actualizar label
            if (uploadLabel) {
                const span = uploadLabel.querySelector('span');
                if (span) span.textContent = file.name;
            }

            // Mostrar preview
            if (filePreview) {
                filePreview.innerHTML = '';
                if (file.type.startsWith('image/')) {
                    const img = document.createElement('img');
                    img.src = URL.createObjectURL(file);
                    img.style.cssText = 'max-width: 200px; margin: 10px auto; display: block; border-radius: 8px;';
                    filePreview.appendChild(img);
                } else if (file.type === 'application/pdf') {
                    filePreview.innerHTML = `
                        <div class="preview-pdf">
                            <i class="fas fa-file-pdf"></i>
                            <span class="file-name">${file.name}</span>
                        </div>`;
                }
            }
        });
    }

    // Manejador del formulario
    if (purchaseForm) {
        purchaseForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = e.target.querySelector('.proceed-payment-btn');
            
            try {
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                }

                const file = fileInput?.files[0];
                if (!file) {
                    throw new Error('Por favor adjunta el comprobante de pago');
                }

                let comprobante;
                if (file.type.startsWith('image/')) {
                    comprobante = await compressImage(file);
                } else if (file.type === 'application/pdf') {
                    if (file.size > 500000) {
                        throw new Error('El PDF es demasiado grande. Máximo 500KB permitido');
                    }
                    comprobante = await fileToBase64(file);
                }

                const templateParams = {
                    libro: document.getElementById('summaryBookTitle')?.textContent || '',
                    de_nombre: document.getElementById('nombre')?.value || '',
                    de_correo_electronico: document.getElementById('email')?.value || '',
                    telefono: document.getElementById('telefono')?.value || '',
                    precio: document.getElementById('summaryPrice')?.textContent || '',
                    comprobante: comprobante
                };

                const response = await emailjs.send(
                    'service_kfjagfc',
                    'template_f01zwii',
                    templateParams
                );

                if (response.status === 200) {
                    alert(`¡Pedido enviado con éxito! Recibirás el eBook en ${templateParams.de_correo_electronico} una vez verificado el pago.`);
                    e.target.reset();
                    if (filePreview) filePreview.innerHTML = '';
                    if (uploadLabel) {
                        const span = uploadLabel.querySelector('span');
                        if (span) span.textContent = 'Adjuntar comprobante de pago';
                    }
                    const paymentModal = document.getElementById('paymentModal');
                    if (paymentModal) paymentModal.style.display = 'none';
                }

            } catch (error) {
                console.error('Error detallado:', error);
                alert('Error: ' + (error.text || error.message || 'Error al procesar el pedido'));
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Pedido';
                }
            }
        });
    }

    // Funciones auxiliares
    async function compressImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > height && width > 800) {
                        height *= 800 / width;
                        width = 800;
                    } else if (height > 800) {
                        width *= 800 / height;
                        height = 800;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
});
