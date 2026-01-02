// DOM Elements
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-links');
const sections = document.querySelectorAll('section');
const currentYear = document.getElementById('current-year');
const resumeBtn = document.getElementById('resume-btn');
const projectsCount = document.getElementById('projects-count');
const techCount = document.getElementById('tech-count');

// Modal Elements
const modalOverlay = document.getElementById('modal-overlay');
const projectModal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

// JSON Data URL
const DATA_URL = 'data.json';

// Store portfolio data globally
let portfolioData = null;

// Initialize Portfolio
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    currentYear.textContent = new Date().getFullYear();
    
    // Load data from JSON
    loadPortfolioData();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup modal event listeners
    setupModalListeners();
});

// Load portfolio data from JSON
async function loadPortfolioData() {
    try {
        const response = await fetch(DATA_URL);
        portfolioData = await response.json();
        
        // Populate personal information
        document.getElementById('hero-name').textContent = portfolioData.personal.name;
        document.getElementById('hero-role').textContent = portfolioData.personal.role;
        document.getElementById('hero-tagline').textContent = portfolioData.personal.tagline;
        document.getElementById('contact-name').textContent = portfolioData.personal.name;
        document.getElementById('contact-location').textContent = portfolioData.personal.location;
        document.getElementById('contact-email').textContent = portfolioData.personal.email;
        
        // Update resume button
        if (portfolioData.socials.resume) {
            resumeBtn.href = portfolioData.socials.resume;
            resumeBtn.target = '_blank';
        }
        
        // Update stats
        projectsCount.textContent = portfolioData.projects.length;
        const totalSkills = Object.values(portfolioData.skills).reduce((acc, skills) => acc + skills.length, 0);
        techCount.textContent = totalSkills;
        
        // Populate about section
        document.getElementById('about-content').innerHTML = `
            <p>${portfolioData.about.description}</p>
        `;
        
        // Populate skills section
        populateSkills();
        
        // Populate projects section
        populateProjects();
        
        // Populate experience & education section
        populateExperience();
        
        // Populate social links
        populateSocialLinks();
        
        // Trigger animations after content is loaded
        setTimeout(() => {
            const fadeElements = document.querySelectorAll('.fade-in');
            fadeElements.forEach(el => {
                el.classList.add('visible');
            });
        }, 100);
        
    } catch (error) {
        console.error('Error loading portfolio data:', error);
        document.getElementById('about-content').innerHTML = 
            '<p style="color: #ff6b6b;">Error loading data. Please check your connection and try again.</p>';
    }
}

// Populate skills section
function populateSkills() {
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = '';
    
    const categoryIcons = {
        'Programming Languages': 'fas fa-code',
        'Frontend': 'fas fa-palette',
        'Backend': 'fas fa-server',
        'Mobile': 'fas fa-mobile-alt',
        'Databases': 'fas fa-database',
        'Concepts': 'fas fa-brain',
        'Tools': 'fas fa-tools'
    };
    
    Object.entries(portfolioData.skills).forEach(([category, skills], index) => {
        const skillCategory = document.createElement('div');
        skillCategory.className = 'skill-category fade-in';
        skillCategory.style.animationDelay = `${index * 0.1}s`;
        
        skillCategory.innerHTML = `
            <h3 class="skill-category-title">
                <i class="${categoryIcons[category] || 'fas fa-star'}"></i>
                ${category}
            </h3>
            <div class="skill-chips">
                ${skills.map(skill => `<span class="skill-chip">${skill}</span>`).join('')}
            </div>
        `;
        
        skillsContainer.appendChild(skillCategory);
    });
}

// Populate projects section
function populateProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '';
    
    portfolioData.projects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card fade-in';
        projectCard.style.animationDelay = `${index * 0.15}s`;
        projectCard.dataset.projectIndex = index;
        
        // Count modules or features
        const moduleCount = project.modules ? Object.keys(project.modules).length : 0;
        const featureCount = project.features ? project.features.length : 0;
        
        projectCard.innerHTML = `
            <div class="project-header">
                <h3 class="project-title">${project.title}</h3>
                <span class="project-type">${project.type}</span>
            </div>
            <div class="project-content">
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.tech.slice(0, 4).map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                    ${project.tech.length > 4 ? `<span class="tech-badge">+${project.tech.length - 4}</span>` : ''}
                </div>
            </div>
            <div class="project-footer">
                <div class="project-stats">
                    ${moduleCount > 0 ? `
                    <div class="stat">
                        <i class="fas fa-layer-group"></i>
                        <span>${moduleCount} Modules</span>
                    </div>
                    ` : ''}
                    ${featureCount > 0 ? `
                    <div class="stat">
                        <i class="fas fa-star"></i>
                        <span>${featureCount} Features</span>
                    </div>
                    ` : ''}
                    <div class="stat">
                        <i class="fas fa-code"></i>
                        <span>${project.tech.length} Tech</span>
                    </div>
                </div>
                <div class="view-project">
                    View Details <i class="fas fa-arrow-right"></i>
                </div>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
    
    // Add click event listeners to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function() {
            const projectIndex = parseInt(this.dataset.projectIndex);
            openProjectModal(projectIndex);
        });
    });
}

// Open project modal
function openProjectModal(projectIndex) {
    if (!portfolioData || !portfolioData.projects[projectIndex]) return;
    
    const project = portfolioData.projects[projectIndex];
    
    // Set modal title
    modalTitle.textContent = project.title;
    
    // Build modal content
    let modalContent = '';
    
    if (project.modules) {
        // Campus Timetable Management System
        modalContent = `
            <div class="modal-project-type">${project.type}</div>
            <p class="modal-description">${project.description}</p>
            
            <div class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-code"></i>
                    Technology Stack
                </h3>
                <div class="modal-tech-stack">
                    ${project.tech.map(tech => `<span class="modal-tech-badge">${tech}</span>`).join('')}
                </div>
            </div>
            
            <div class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-cubes"></i>
                    System Architecture
                </h3>
                <div class="modules-grid">
                    ${Object.values(project.modules).map(module => `
                        <div class="module-card">
                            <h4 class="module-title">
                                <i class="fas fa-layer-group"></i>
                                ${module.name}
                            </h4>
                            <ul class="module-points">
                                ${module.points.map(point => `
                                    <li class="module-point">
                                        <i class="fas fa-check"></i>
                                        <span>${point}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-chart-line"></i>
                    Impact & Statistics
                </h3>
                <div class="impact-stats">
                    <div class="impact-stat">
                        <i class="fas fa-users"></i>
                        <h4>User Base</h4>
                        <p>50+ Active Students</p>
                    </div>
                    <div class="impact-stat">
                        <i class="fas fa-chart-line"></i>
                        <h4>Efficiency Gain</h4>
                        <p>70% Time Saved</p>
                    </div>
                    <div class="impact-stat">
                        <i class="fas fa-check-circle"></i>
                        <h4>Accuracy</h4>
                        <p>99% Conflict-Free</p>
                    </div>
                    <div class="impact-stat">
                        <i class="fas fa-sync-alt"></i>
                        <h4>Real-time</h4>
                        <p>Instant Updates</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        // Regular projects
        modalContent = `
            <div class="modal-project-type">${project.type}</div>
            <p class="modal-description">${project.description}</p>
            
            <div class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-code"></i>
                    Technology Stack
                </h3>
                <div class="modal-tech-stack">
                    ${project.tech.map(tech => `<span class="modal-tech-badge">${tech}</span>`).join('')}
                </div>
            </div>
            
            ${project.features ? `
            <div class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-star"></i>
                    Key Features
                </h3>
                <div class="features-grid">
                    ${project.features.map(feature => `
                        <div class="feature-card">
                            <i class="fas fa-check"></i> ${feature}
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
        `;
    }
    
    // Set modal body content
    modalBody.innerHTML = modalContent;
    
    // Show modal
    modalOverlay.classList.add('active');
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close project modal
function closeProjectModal() {
    modalOverlay.classList.remove('active');
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Setup modal event listeners
function setupModalListeners() {
    // Close modal when clicking overlay
    modalOverlay.addEventListener('click', closeProjectModal);
    
    // Close modal when clicking close button
    modalClose.addEventListener('click', closeProjectModal);
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) {
            closeProjectModal();
        }
    });
}

// Populate experience & education section
function populateExperience() {
    const timelineContainer = document.getElementById('timeline');
    timelineContainer.innerHTML = '';
    
    // Add experience items
    portfolioData.experience.forEach((exp, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item fade-in';
        timelineItem.style.animationDelay = `${index * 0.1}s`;
        
        timelineItem.innerHTML = `
            <div class="timeline-icon">
                <i class="fas fa-briefcase"></i>
            </div>
            <div class="timeline-content">
                <h3 class="timeline-title">${exp.title}</h3>
                <p class="timeline-subtitle">${exp.organization} ${exp.location ? `· ${exp.location}` : ''}</p>
                <p class="timeline-duration">
                    <i class="far fa-calendar"></i> ${exp.duration}
                </p>
                <ul class="timeline-points">
                    ${exp.points.map(point => `
                        <li class="timeline-point">
                            <i class="fas fa-caret-right"></i>
                            <span>${point}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        
        timelineContainer.appendChild(timelineItem);
    });
    
    // Add education items
    portfolioData.education.forEach((edu, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item fade-in';
        timelineItem.style.animationDelay = `${(portfolioData.experience.length + index) * 0.1}s`;
        
        timelineItem.innerHTML = `
            <div class="timeline-icon">
                <i class="fas fa-graduation-cap"></i>
            </div>
            <div class="timeline-content">
                <h3 class="timeline-title">${edu.degree} in ${edu.field}</h3>
                <p class="timeline-subtitle">${edu.institution}</p>
                <p class="timeline-duration">
                    <i class="far fa-calendar"></i> ${edu.duration}
                </p>
            </div>
        `;
        
        timelineContainer.appendChild(timelineItem);
    });
}

// Populate social links
function populateSocialLinks() {
    const socialLinks = document.getElementById('social-links');
    socialLinks.innerHTML = '';
    
    const socialIcons = {
        github: 'fab fa-github',
        linkedin: 'fab fa-linkedin-in',
        email: 'fas fa-envelope'
    };
    
    Object.entries(portfolioData.socials).forEach(([platform, url]) => {
        if (url && platform !== 'resume') {
            const socialLink = document.createElement('a');
            socialLink.href = url;
            socialLink.className = 'social-link';
            socialLink.target = '_blank';
            socialLink.rel = 'noopener noreferrer';
            socialLink.ariaLabel = `${platform} Profile`;
            socialLink.innerHTML = `<i class="${socialIcons[platform] || 'fas fa-external-link-alt'}"></i>`;
            socialLinks.appendChild(socialLink);
        }
    });
}

// Initialize scroll animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        updateActiveNavLink();
    });
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            document.body.style.overflow = 'hidden';
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-container') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = '';
        }
    });
    
    // Smooth scroll for anchor links
// Smooth scroll ONLY for internal section links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    // Ignore empty or invalid hashes
    if (!href || href === '#') return;

    const targetElement = document.querySelector(href);
    if (!targetElement) return;

    e.preventDefault();

    window.scrollTo({
      top: targetElement.offsetTop - 80,
      behavior: 'smooth'
    });
  });
});

    
    // Contact form submission
// Contact form submission (EmailJS)
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    emailjs.sendForm(
      'service_wk0u7gi',
      'template_k7a9esv',
      this
    )
    .then(() => {
      alert('Message sent successfully!');
      this.reset();
    })
    .catch((error) => {
      console.error('EmailJS error:', error);
      alert('Failed to send message. Try again later.');
    });
  });
}

}

// Update active nav link based on scroll position
function updateActiveNavLink() {
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });

}
