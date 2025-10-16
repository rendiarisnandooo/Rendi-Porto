// Main TypeScript file for Rendi Arisnando Portfolio
import { gsap } from 'gsap';

// Register GSAP plugins (ScrollTrigger will be loaded dynamically if needed)
// gsap.registerPlugin(ScrollTrigger);

// Types
interface SkillData {
    level: number;
    element: HTMLElement;
}

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

class PortfolioApp {
    private skills: SkillData[] = [];
    private isMenuOpen: boolean = false;

    constructor() {
        this.init();
    }

    private init(): void {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupScrollAnimations();
        this.setupSkillBars();
    }

    private setupEventListeners(): void {
        // Navigation
        const hamburger = document.querySelector('.hamburger') as HTMLElement;
        const navLinks = document.querySelectorAll('.nav-link');

        hamburger?.addEventListener('click', () => this.toggleMobileMenu());

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = (e.target as HTMLElement).getAttribute('href');
                if (target) {
                    this.scrollToSection(target.substring(1));
                    this.closeMobileMenu();
                }
            });
        });

        // Contact form
        const contactForm = document.getElementById('contactForm') as HTMLFormElement;
        contactForm?.addEventListener('submit', (e) => this.handleContactForm(e));

        // Smooth scrolling for buttons
        document.querySelectorAll('button[onclick*="scrollToSection"]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const onclick = button.getAttribute('onclick');
                if (onclick) {
                    const match = onclick.match(/scrollToSection\('(.+)'\)/);
                    if (match) {
                        this.scrollToSection(match[1]);
                    }
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => this.handleNavbarScroll());
    }

    private toggleMobileMenu(): void {
        const navMenu = document.querySelector('.nav-menu') as HTMLElement;
        const hamburger = document.querySelector('.hamburger') as HTMLElement;

        this.isMenuOpen = !this.isMenuOpen;
        navMenu.classList.toggle('active', this.isMenuOpen);
        hamburger.classList.toggle('active', this.isMenuOpen);
    }

    private closeMobileMenu(): void {
        const navMenu = document.querySelector('.nav-menu') as HTMLElement;
        const hamburger = document.querySelector('.hamburger') as HTMLElement;

        this.isMenuOpen = false;
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }

    private scrollToSection(sectionId: string): void {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    private handleNavbarScroll(): void {
        const navbar = document.querySelector('.navbar') as HTMLElement;
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(26, 26, 46, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(26, 26, 46, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }

    private initializeAnimations(): void {
        // Hero section animations
        gsap.from('.hero-title', {
            duration: 1.5,
            y: 100,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.5
        });

        gsap.from('.hero-subtitle', {
            duration: 1.2,
            y: 50,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.8
        });

        gsap.from('.hero-description', {
            duration: 1,
            y: 30,
            opacity: 0,
            ease: 'power3.out',
            delay: 1.1
        });

        gsap.from('.hero-buttons', {
            duration: 1,
            y: 30,
            opacity: 0,
            ease: 'power3.out',
            delay: 1.4
        });

        gsap.from('.mcgg-avatar', {
            duration: 2,
            scale: 0,
            rotation: 360,
            ease: 'back.out(1.7)',
            delay: 0.8
        });

        // Floating pieces animation
        gsap.to('.piece', {
            duration: 3,
            y: -20,
            rotation: 5,
            ease: 'power2.inOut',
            yoyo: true,
            repeat: -1,
            stagger: 0.5
        });
    }

    private setupScrollAnimations(): void {
        // Simple scroll animations without ScrollTrigger for now
        // About section animations
        gsap.from('.about-card', {
            duration: 1,
            y: 50,
            opacity: 0,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about',
                start: 'top 80%'
            }
        });

        gsap.from('.stat-item', {
            duration: 1,
            scale: 0,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '.about-stats',
                start: 'top 80%'
            }
        });

        // Skills section animations
        gsap.from('.skill-card', {
            duration: 1,
            y: 50,
            opacity: 0,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.skills',
                start: 'top 80%'
            }
        });

        // Achievements timeline animations
        gsap.from('.timeline-item', {
            duration: 1,
            x: -100,
            opacity: 0,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.achievements',
                start: 'top 80%'
            }
        });

        // Contact section animations
        gsap.from('.contact-info', {
            duration: 1,
            x: -50,
            opacity: 0,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact',
                start: 'top 80%'
            }
        });

        gsap.from('.contact-form', {
            duration: 1,
            x: 50,
            opacity: 0,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact',
                start: 'top 80%'
            }
        });
    }

    private setupSkillBars(): void {
        const skillBars = document.querySelectorAll('.skill-bar');
        
        skillBars.forEach(bar => {
            const level = parseInt((bar as HTMLElement).dataset.level || '0');
            this.skills.push({
                level,
                element: bar as HTMLElement
            });
        });

        // Animate skill bars when they come into view
        // Using simple intersection observer for now
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkillBars();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        const skillsSection = document.querySelector('.skills');
        if (skillsSection) {
            observer.observe(skillsSection);
        }
    }

    private animateSkillBars(): void {
        this.skills.forEach(skill => {
            gsap.to(skill.element, {
                duration: 2,
                width: `${skill.level}%`,
                ease: 'power2.out',
                delay: Math.random() * 0.5
            });
        });
    }

    private handleContactForm(e: Event): void {
        e.preventDefault();
        
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const contactData: ContactFormData = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            message: formData.get('message') as string
        };

        // Simulate form submission
        console.log('Form data:', contactData); // Log the form data for debugging
        this.showNotification('Pesan berhasil dikirim! Terima kasih atas pesan Anda.', 'success');
        form.reset();
    }

    private showNotification(message: string, type: 'success' | 'error'): void {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 25px',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease',
            background: type === 'success' ? '#4CAF50' : '#f44336'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

}

// Global functions for HTML onclick handlers
(window as any).scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to skill cards
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                duration: 0.3,
                scale: 1.05,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.3,
                scale: 1,
                ease: 'power2.out'
            });
        });
    });

    // Add click effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const mouseEvent = e as MouseEvent;
            const x = mouseEvent.clientX - rect.left - size / 2;
            const y = mouseEvent.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

            (e.target as HTMLElement).style.position = 'relative';
            (e.target as HTMLElement).style.overflow = 'hidden';
            (e.target as HTMLElement).appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
