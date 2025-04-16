document.addEventListener('DOMContentLoaded', () => {
    const ebookList = document.getElementById('ebook-list');

    // Function to display eBooks
    function displayEbooks() {
        ebooks.forEach(ebook => {
            const ebookItem = document.createElement('div');
            ebookItem.classList.add('ebook-item');
            ebookItem.innerHTML = `
                <h3>${ebook.title}</h3>
                <p>Price: $${ebook.price.toFixed(2)}</p>
                <p>Rating: ${'★'.repeat(Math.floor(ebook.rating))}${'☆'.repeat(5 - Math.floor(ebook.rating))}</p>
                <button onclick="viewDetails(${ebook.id})">View Details</button>
            `;
            ebookList.appendChild(ebookItem);
        });
    }

    // Function to handle viewing details
    window.viewDetails = function(id) {
        // Redirect to the book detail page
        window.location.href = `pages/bookDetail.html?id=${id}`;
    };

    displayEbooks();
});

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');

    // Toggle menu functionality
    menuToggle?.addEventListener('click', function() {
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
});