// Store uploaded images in localStorage
const STORAGE_KEY = 'daredevil-gallery-images';

// Load images from localStorage
function loadStoredImages() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

// Save images to localStorage
function saveImages(images) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
}

document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const galleryGrid = document.getElementById('galleryGrid');
    const uploadStatus = document.getElementById('uploadStatus');

    if (!imageInput || !galleryGrid || !uploadStatus) {
        console.error('Required elements not found');
        return;
    }

    // Load existing images
    loadImages();

    // Handle image upload
    imageInput.addEventListener('change', handleImageUpload);

    function loadImages() {
        showStatus('Loading images...', 'info');
        try {
            const images = loadStoredImages();
            galleryGrid.innerHTML = ''; // Clear existing images
            
            if (images.length === 0) {
                showStatus('No images uploaded yet', 'info');
            } else {
                images.forEach(imageData => {
                    addImageToGallery(imageData);
                });
                showStatus('Images loaded successfully', 'success');
            }
        } catch (error) {
            console.error('Error loading images:', error);
            showStatus('Failed to load images', 'error');
        }
    }

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showStatus('Please select an image file', 'error');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            showStatus('Image must be less than 5MB', 'error');
            return;
        }

        showStatus('Processing image...', 'info');

        // Read file as Data URL
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imageData = {
                    url: e.target.result,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    uploadedAt: new Date().toISOString()
                };

                // Add to gallery
                addImageToGallery(imageData);

                // Save to localStorage
                const images = loadStoredImages();
                images.push(imageData);
                saveImages(images);

                showStatus('Image uploaded successfully!', 'success');
                imageInput.value = ''; // Clear the input
            } catch (error) {
                console.error('Error processing image:', error);
                showStatus('Failed to process image', 'error');
            }
        };

        reader.onerror = () => {
            console.error('Error reading file');
            showStatus('Failed to read image file', 'error');
        };

        reader.readAsDataURL(file);
    }

    function addImageToGallery(imageData) {
        const container = document.createElement('div');
        container.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = imageData.url;
        img.alt = imageData.name || 'Gallery Image';
        img.loading = 'lazy';
        
        // Add loading indicator
        img.style.opacity = '0';
        img.onload = () => {
            img.style.transition = 'opacity 0.3s ease-in';
            img.style.opacity = '1';
        };

        // Add image info
        const infoContainer = document.createElement('div');
        infoContainer.className = 'image-info';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'image-name';
        nameSpan.textContent = imageData.name;
        
        const sizeSpan = document.createElement('span');
        sizeSpan.className = 'image-size';
        sizeSpan.textContent = formatSize(imageData.size);
        
        const dateSpan = document.createElement('span');
        dateSpan.className = 'image-date';
        dateSpan.textContent = new Date(imageData.uploadedAt).toLocaleDateString();
        
        infoContainer.appendChild(nameSpan);
        infoContainer.appendChild(sizeSpan);
        infoContainer.appendChild(dateSpan);
        
        // Add delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = function() {
            if (confirm('Delete this image?')) {
                // Remove from DOM
                container.remove();
                
                // Remove from localStorage
                const images = loadStoredImages();
                const updatedImages = images.filter(img => img.url !== imageData.url);
                saveImages(updatedImages);
                
                showStatus('Image deleted', 'info');
            }
        };
        
        container.appendChild(img);
        container.appendChild(infoContainer);
        container.appendChild(deleteBtn);
        galleryGrid.appendChild(container);
    }

    function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function showStatus(message, type) {
        uploadStatus.textContent = message;
        uploadStatus.className = `status ${type}`;
        uploadStatus.style.display = 'block';
        
        // Hide status after 3 seconds
        setTimeout(() => {
            uploadStatus.style.display = 'none';
        }, 3000);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navigation background change on scroll
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.style.backgroundColor = 'rgba(0, 43, 91, 0.95)'; // Captain America blue
        } else {
            nav.style.backgroundColor = 'rgba(0, 43, 91, 0.9)';
        }
    });

    // Shield animation for loading states
    const addShieldLoader = (element) => {
        const loader = document.createElement('div');
        loader.className = 'shield-loader';
        element.appendChild(loader);
        setTimeout(() => loader.remove(), 2000);
    };

    // Interactive character cards
    document.querySelectorAll('.character-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05) rotate(2deg)';
            card.style.boxShadow = '0 8px 16px rgba(0, 43, 91, 0.3)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1) rotate(0)';
            card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        });
    });

    // Dynamic hero showcase
    const heroImage = document.querySelector('.main-hero-image img');
    if (heroImage) {
        heroImage.addEventListener('load', () => {
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'scale(1)';
        });
    }

    // Contact form handling with shield animation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addShieldLoader(contactForm);
            setTimeout(() => {
                alert('Thank you for your message. We will get back to you soon.');
                contactForm.reset();
            }, 2000);
        });
    }

    // Enhanced fade-in animation for sections
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                if (entry.target.classList.contains('hero-section')) {
                    entry.target.classList.add('shield-reveal');
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(section);
    });

    // Intersection observer code
    const observerOptions2 = {
        threshold: 0.1
    };

    const observer2 = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions2);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer2.observe(section);
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});
