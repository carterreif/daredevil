// Store uploaded images in localStorage
let uploadedImages = JSON.parse(localStorage.getItem('daredevilGallery')) || [];
let galleryImages = [];

// Get API base URL based on environment
const apiBaseUrl = window.location.hostname.includes('github.io') 
    ? 'https://daredevil-9ea7q0hhg-ajr1073s-projects.vercel.app'
    : '';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    const imageInput = document.getElementById('imageInput');
    const galleryGrid = document.getElementById('galleryGrid');

    // Load existing images from localStorage
    const savedImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    savedImages.forEach(imageUrl => addImageToGallery(imageUrl));

    // Load existing images
    fetch(`${apiBaseUrl}/images`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(images => {
            images.forEach(image => addImageToGallery(image.url));
        })
        .catch(error => console.error('Error loading images:', error));

    imageInput.addEventListener('change', async function(event) {
        const file = event.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('image', file);

                const response = await fetch(`${apiBaseUrl}/upload`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`Upload failed: ${await response.text()}`);
                }

                const data = await response.json();
                if (data.url) {
                    const imageUrl = data.url;
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
