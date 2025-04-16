const ebookData = [
    {
        id: 1,
        title: "Learn JavaScript",
        price: 9.99,
        rating: 4.5,
        description: "A comprehensive guide to JavaScript programming.",
    },
    {
        id: 2,
        title: "Mastering CSS",
        price: 14.99,
        rating: 4.7,
        description: "An in-depth look at CSS for modern web design.",
    },
    {
        id: 3,
        title: "HTML & CSS: Design and Build Websites",
        price: 19.99,
        rating: 4.8,
        description: "A beginner's guide to HTML and CSS.",
    },
];

function fetchEbooks() {
    return ebookData;
}

function getEbookById(id) {
    return ebookData.find(ebook => ebook.id === id);
}

export { fetchEbooks, getEbookById };

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const categoryPills = document.querySelectorAll('.category-pill');
    
    // Buscador de libros
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        searchBooks(searchTerm);
    });

    // Filtrado por categorías
    categoryPills.forEach(pill => {
        pill.addEventListener('click', function() {
            const category = this.textContent.toLowerCase();
            filterByCategory(category);
            
            // Actualizar pill activo
            categoryPills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Función de búsqueda
    function searchBooks(searchTerm) {
        const books = document.querySelectorAll('.ebook');
        
        books.forEach(book => {
            const title = book.querySelector('h3').textContent.toLowerCase();
            if (title.includes(searchTerm)) {
                book.style.display = 'block';
            } else {
                book.style.display = 'none';
            }
        });
    }

    // Función de filtrado por categoría
    function filterByCategory(category) {
        const books = document.querySelectorAll('.ebook');
        
        books.forEach(book => {
            if (category === 'todos') {
                book.style.display = 'block';
            } else {
                const bookCategory = book.dataset.category?.toLowerCase();
                book.style.display = bookCategory === category ? 'block' : 'none';
            }
        });
    }
});