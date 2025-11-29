document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.image-gallery');
    const filterButtons = document.querySelectorAll('.filter-button');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeButton = document.querySelector('.close-button');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');

    let images = [];
    let currentIndex = 0;
    let imageObserver;

    const imageData = [
        { "src": "images/landscape-1.jpg", "category": "landscape", "alt": "Scenic landscape with rolling hills" },
        { "src": "images/landscape-2.jpg", "category": "landscape", "alt": "Mountain landscape at sunset" },
        { "src": "images/landscape-3.jpg", "category": "landscape", "alt": "Green valley landscape view" },
        { "src": "images/landscape-4.jpg", "category": "landscape", "alt": "Landscape with forest and river" },
        { "src": "images/mountain-1.jpg", "category": "mountains", "alt": "Majestic mountain peak" },
        { "src": "images/mountain-2.jpg", "category": "mountains", "alt": "Snow-covered mountain range" },
        { "src": "images/mountain-3.jpg", "category": "mountains", "alt": "Mountain landscape with clouds" },
        { "src": "images/mountain-4.jpg", "category": "mountains", "alt": "Rocky mountain terrain" },
        { "src": "images/mountain-5.jpg", "category": "mountains", "alt": "Mountain panoramic view" },
        { "src": "images/waterfall-1.jpg", "category": "waterfall", "alt": "Cascading waterfall in forest" },
        { "src": "images/waterfall-2.jpg", "category": "waterfall", "alt": "Powerful waterfall landscape" },
        { "src": "images/waterfall-3.jpg", "category": "waterfall", "alt": "Hidden waterfall in jungle" },
        { "src": "images/desert-1.jpg", "category": "desert", "alt": "Sand dunes desert landscape" },
        { "src": "images/desert-2.jpg", "category": "desert", "alt": "Desert sunset with dunes" },
        { "src": "images/desert-3.jpg", "category": "desert", "alt": "Desert canyon view" },
        { "src": "images/ocean-1.jpg", "category": "ocean", "alt": "Peaceful ocean waves" },
        { "src": "images/ocean-2.jpg", "category": "ocean", "alt": "Ocean sunset view" },
        { "src": "images/ocean-3.jpg", "category": "ocean", "alt": "Ocean beach landscape" },
        { "src": "images/ocean-4.jpg", "category": "ocean", "alt": "Ocean cliff view" },
        { "src": "images/ocean-5.jpg", "category": "ocean", "alt": "Ocean wave close-up" },
        // { "src": "images/nature-1.jpg", "category": "all", "alt": "Nature wildlife scene" },
        { "src": "images/nature-2.jpg", "category": "all", "alt": "Nature forest landscape" },
        { "src": "images/nature-3.jpg", "category": "all", "alt": "Nature flora photography" },
        { "src": "images/nature-4.jpg", "category": "all", "alt": "Nature wildlife habitat" },
        { "src": "images/nature-5.jpg", "category": "all", "alt": "Nature scenic view" }
    ];

    // Initialize Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
        imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
    }

    function createGallery(filter = 'all') {
        gallery.innerHTML = '';
        let filteredImages;

        if (filter === 'all') {
            filteredImages = imageData;
        } else {
            filteredImages = imageData.filter(img => img.category === filter);
        }

        images = filteredImages.map(imgData => imgData.src);

        filteredImages.forEach((imgData, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');
            galleryItem.dataset.index = index;
            galleryItem.addEventListener('click', () => openLightbox(index));

            const img = document.createElement('img');
            img.dataset.src = imgData.src;
            img.alt = imgData.alt;
            img.loading = 'lazy';

            // Set a placeholder or low quality image
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23e0e0e0" width="400" height="300"/%3E%3C/svg%3E';

            // Observe image for lazy loading
            if (imageObserver) {
                imageObserver.observe(img);
            } else {
                img.src = imgData.src;
            }

            const overlay = document.createElement('div');
            overlay.classList.add('overlay');

            const overlayText = document.createElement('div');
            overlayText.classList.add('overlay-text');
            const category = imgData.category === 'all' ? 'General' : imgData.category.charAt(0).toUpperCase() + imgData.category.slice(1);
            overlayText.innerHTML = `<h3>${category}</h3>`;

            overlay.appendChild(overlayText);
            galleryItem.appendChild(img);
            galleryItem.appendChild(overlay);
            gallery.appendChild(galleryItem);
        });
    }

    function openLightbox(index) {
        currentIndex = index;
        lightboxImage.src = images[currentIndex];
        lightboxImage.alt = `Full size image of ${imageData[index].alt}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImage.src = images[currentIndex];
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImage.src = images[currentIndex];
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.dataset.filter;
            createGallery(filter);
        });
    });

    closeButton.addEventListener('click', closeLightbox);
    prevButton.addEventListener('click', showPrevImage);
    nextButton.addEventListener('click', showNextImage);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });

    createGallery();
});