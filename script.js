// Store uploaded images in localStorage
let uploadedImages = JSON.parse(localStorage.getItem('daredevilGallery')) || [];
let galleryImages = [];

// Get API base URL based on environment
const apiBaseUrl = 'https://daredevil-zacjn4ufs-ajr1073s-projects.vercel.app';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    const imageInput = document.getElementById('imageInput');
    const galleryGrid = document.getElementById('galleryGrid');
    const uploadStatus = document.createElement('div');
    uploadStatus.id = 'uploadStatus';
    document.body.appendChild(uploadStatus);

    // Load existing images from localStorage
    const savedImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    savedImages.forEach(imageUrl => addImageToGallery(imageUrl));

    // Load existing images
    loadImages();

    // Handle image upload
    imageInput.addEventListener('change', handleImageUpload);

    async function loadImages() {
        showStatus('Loading images...', 'info');
        try {
            const response = await fetch(`${apiBaseUrl}/images`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                mode: 'cors'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to load images: ${errorText}`);
            }

            const images = await response.json();
            if (images.length === 0) {
                showStatus('No images uploaded yet', 'info');
            } else {
                images.forEach(image => addImageToGallery(image.url));
                showStatus('Images loaded successfully', 'success');
            }
        } catch (error) {
            console.error('Error loading images:', error);
            showStatus('Failed to load images. Please refresh the page.', 'error');
        }
    }

    async function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

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

        showStatus('Uploading image...', 'info');

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${apiBaseUrl}/upload`, {
                method: 'POST',
                body: formData,
                mode: 'cors'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${errorText}`);
            }

            const data = await response.json();
            if (data.url) {
                addImageToGallery(data.url);
                
                // Save to localStorage
                const savedImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');
                savedImages.push(data.url);
                localStorage.setItem('galleryImages', JSON.stringify(savedImages));

                showStatus('Image uploaded successfully!', 'success');
                imageInput.value = '';
            } else {
                throw new Error('No image URL in response');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            showStatus('Failed to upload image. Please try again.', 'error');
        }
    }

    function addImageToGallery(imageUrl) {
        const container = document.createElement('div');
        container.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Gallery Image';
        img.loading = 'lazy';
        
        // Add loading indicator
        img.style.opacity = '0';
        img.onload = () => {
            img.style.transition = 'opacity 0.3s ease-in';
            img.style.opacity = '1';
        };
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = function() {
            if (confirm('Delete this image?')) {
                container.remove();
                // Remove from localStorage
                const savedImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');
                const updatedImages = savedImages.filter(url => url !== imageUrl);
                localStorage.setItem('galleryImages', JSON.stringify(updatedImages));
            }
        };
        
        container.appendChild(img);
        container.appendChild(deleteBtn);
        galleryGrid.appendChild(container);
    }

    function showStatus(message, type) {
        uploadStatus.textContent = message;
        uploadStatus.className = `status ${type}`;
        uploadStatus.style.display = 'block';
        
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                uploadStatus.style.display = 'none';
            }, 3000);
        }
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
});
