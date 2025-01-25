// Store uploaded images in localStorage
let uploadedImages = JSON.parse(localStorage.getItem('daredevilGallery')) || [];
let galleryImages = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    const imageInput = document.getElementById('imageInput');
    const galleryGrid = document.getElementById('galleryGrid');
    const IMGUR_CLIENT_ID = '0e1df61d873e129';  // Public client ID for Imgur API

    // Load existing images from localStorage
    const savedImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    savedImages.forEach(imageUrl => addImageToGallery(imageUrl));

    imageInput.addEventListener('change', async function(event) {
        const file = event.target.files[0];
        if (file) {
            try {
                const base64Image = await toBase64(file);
                const base64Data = base64Image.split(',')[1];

                const response = await fetch('https://api.imgur.com/3/image', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        image: base64Data,
                        type: 'base64'
                    })
                });

                if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
                }

                const data = await response.json();
                if (data.success && data.data.link) {
                    const imageUrl = data.data.link;
                    addImageToGallery(imageUrl);
                    
                    // Save to localStorage
                    const savedImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');
                    savedImages.push(imageUrl);
                    localStorage.setItem('galleryImages', JSON.stringify(savedImages));

                    // Clear the input
                    imageInput.value = '';
                } else {
                    throw new Error('Failed to get image URL from response');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Failed to upload image. Please try again.');
            }
        }
    });

    // Helper function to convert File to base64
    function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    function addImageToGallery(imageUrl) {
        const container = document.createElement('div');
        container.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Gallery Image';
        img.loading = 'lazy';
        
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

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
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
