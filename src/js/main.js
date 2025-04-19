import { fetchEbooks } from './store.js';

document.addEventListener('DOMContentLoaded', function() {
    // Inicialización de ebooks
    const ebooks = fetchEbooks();
    initializeEbooks();
    initializeMenu();

    function initializeEbooks() {
        const ebookList = document.getElementById('ebook-list');
        if (!ebookList) return;

        ebooks.forEach(ebook => {
            const ebookItem = document.createElement('div');
            ebookItem.classList.add('ebook-item');
            ebookItem.innerHTML = `
                <h3>${ebook.title}</h3>
                <p>Price: $${ebook.price.toFixed(2)}</p>
                <p>Rating: ${'★'.repeat(Math.floor(ebook.rating))}${'☆'.repeat(5 - Math.floor(ebook.rating))}</p>
                <button class="details-btn" data-id="${ebook.id}">View Details</button>
            `;
            ebookList.appendChild(ebookItem);
        });

        // Event delegation para los botones de detalles
        ebookList.addEventListener('click', function(e) {
            if (e.target.classList.contains('details-btn')) {
                const id = e.target.dataset.id;
                viewDetails(id);
            }
        });
    }

    function initializeMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const mainNav = document.querySelector('.main-nav');

        if (!menuToggle || !mainNav) return;

        // Toggle menu functionality
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            }
        });
    }

    function viewDetails(id) {
        // Redireccionar a la página de detalles
        window.location.href = `pages/bookDetail.html?id=${id}`;
    }
});
