// Store uploaded images in localStorage
let uploadedImages = JSON.parse(localStorage.getItem('daredevilGallery')) || [];
let galleryImages = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    const imageInput = document.getElementById('imageInput');
    const galleryGrid = document.getElementById('galleryGrid');
    const IMGBB_API_KEY = 'c64c5b70d73c91ef2049252f2d3c9c86'; // New ImgBB API key

    // Load existing images from localStorage
    const savedImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    savedImages.forEach(imageUrl => addImageToGallery(imageUrl));

    // Cloudinary Upload Widget configuration
    const myWidget = cloudinary.createUploadWidget(
        {
            cloudName: 'dqd5x0s7v',
            uploadPreset: 'daredevil_gallery',
            sources: ['local', 'url', 'camera'],
            multiple: false,
            maxFiles: 1,
            styles: {
                palette: {
                    window: "#000000",
                    sourceBg: "#000000",
                    windowBorder: "#8E8E8E",
                    tabIcon: "#FFFFFF",
                    inactiveTabIcon: "#8E8E8E",
                    menuIcons: "#2AD9FF",
                    link: "#08C0FF",
                    action: "#336BFF",
                    inProgress: "#00BFFF",
                    complete: "#33ff00",
                    error: "#EA2727",
                    textDark: "#000000",
                    textLight: "#FFFFFF"
                }
            }
        },
        (error, result) => {
            if (!error && result && result.event === "success") {
                const imageUrl = result.info.secure_url;
                addImageToGallery(imageUrl);
                
                // Save to localStorage
                const savedImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');
                savedImages.push(imageUrl);
                localStorage.setItem('galleryImages', JSON.stringify(savedImages));
            }
        }
    );

    document.getElementById("upload_widget").addEventListener(
        "click",
        function () {
            myWidget.open();
        },
        false
    );

    imageInput.addEventListener('change', async function(event) {
        const file = event.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('image', file);
                formData.append('key', IMGBB_API_KEY);

                const response = await fetch('https://api.imgbb.com/1/upload', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                if (data.data && data.data.url) {
                    const imageUrl = data.data.url;
                    addImageToGallery(imageUrl);
                    
                    // Save to localStorage
                    const savedImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');
                    savedImages.push(imageUrl);
                    localStorage.setItem('galleryImages', JSON.stringify(savedImages));
                } else {
                    throw new Error('Failed to upload image');
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
