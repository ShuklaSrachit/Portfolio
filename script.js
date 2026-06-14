document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // HEADER SCROLL EFFECT
  // ==========================================
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==========================================
  // MOBILE MENU TOGGLE
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && navMenu.classList.contains('active')) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });

  // ==========================================
  // PREMIUM RESUME DIALOG MODAL
  // ==========================================
  const resumeDialog = document.getElementById('resume-dialog');
  const navResumeBtn = document.getElementById('nav-resume-btn');
  const heroResumeBtn = document.getElementById('hero-resume-btn');
  const closeResumeBtn = document.getElementById('close-resume-btn');
  const printResumeBtn = document.getElementById('print-resume-btn');

  const openResumeModal = () => {
    resumeDialog.showModal();
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeResumeModal = () => {
    resumeDialog.close();
    document.body.style.overflow = '';
  };

  if (navResumeBtn) navResumeBtn.addEventListener('click', openResumeModal);
  if (heroResumeBtn) heroResumeBtn.addEventListener('click', openResumeModal);
  if (closeResumeBtn) closeResumeBtn.addEventListener('click', closeResumeModal);

  // Close modal when clicking on the backdrop
  resumeDialog.addEventListener('click', (e) => {
    const rect = resumeDialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      closeResumeModal();
    }
  });

  // Close modal with Escape key
  resumeDialog.addEventListener('cancel', () => {
    document.body.style.overflow = '';
  });

  // Print function inside modal
  printResumeBtn.addEventListener('click', () => {
    window.print();
  });

  // ==========================================
  // CARD MOUSE LIGHTING EFFECT (LINEAR/STRIPE)
  // ==========================================
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;
      
      card.style.setProperty('--mouse-x', `${percentX}%`);
      card.style.setProperty('--mouse-y', `${percentY}%`);
    });
  });

  // ==========================================
  // PROJECT FILTERING
  // ==========================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from other buttons
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ==========================================
  // METRICS COUNTING ANIMATION
  // ==========================================
  const metricsSection = document.querySelector('.metrics-section');
  const metricNumbers = document.querySelectorAll('.metric-number');
  let hasCounted = false;

  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      
      const currentValue = Math.floor(easeProgress * target);
      
      // Add '+' suffix if it's high impact number
      if (target >= 100) {
        element.textContent = `${currentValue}+`;
      } else if (target === 4) {
        element.textContent = `${currentValue}+`;
      } else if (target === 3) {
        element.textContent = `${currentValue}+`;
      } else {
        element.textContent = currentValue;
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        // Ensure exact target is set at completion
        element.textContent = target >= 100 || target === 4 || target === 3 ? `${target}+` : target;
      }
    };

    requestAnimationFrame(updateCount);
  };

  const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasCounted) {
        metricNumbers.forEach(num => countUp(num));
        hasCounted = true;
      }
    });
  }, { threshold: 0.3 });

  if (metricsSection) {
    metricsObserver.observe(metricsSection);
  }

  // ==========================================
  // INTERSECTION OBSERVER ANIMATION FALLBACK
  // ==========================================
  // If the browser does not support native CSS Scroll-Driven Animations
  if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    
    // Set initial state for fallback manually via JS
    scrollRevealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          // Unobserve once animated
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    });

    scrollRevealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }

  // ==========================================
  // CONTACT FORM VALIDATION & SUBMISSION
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const statusMsg = document.getElementById('form-status-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Reset statuses
      statusMsg.className = 'form-status';
      statusMsg.textContent = '';
      
      // Check validation
      let isValid = true;
      const inputs = contactForm.querySelectorAll('.form-input');
      
      inputs.forEach(input => {
        // Trigger :user-invalid state validation manually on submit
        if (!input.checkValidity()) {
          isValid = false;
        }
      });

      if (!isValid) {
        statusMsg.classList.add('error');
        statusMsg.textContent = 'Please fill out all required fields correctly.';
        return;
      }

      // If valid, simulate submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const submitBtnText = submitBtn.querySelector('span');
      const originalText = submitBtnText.textContent;
      
      submitBtn.disabled = true;
      submitBtnText.textContent = 'Sending...';

      // Simulating a network request delay
      setTimeout(() => {
        // Show success state
        statusMsg.classList.add('success');
        statusMsg.textContent = 'Thank you! Your message has been sent successfully. Srachit will get back to you shortly.';
        
        // Reset form inputs
        contactForm.reset();
        
        // Restore button
        submitBtn.disabled = false;
        submitBtnText.textContent = originalText;
      }, 1500);
    });
  }



  // ==========================================
  // PARTICLES BACKGROUND CANVAS
  // ==========================================
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 70;
    
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 1.5 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 90, 95, 0.45)';
        ctx.fill();
      }
    }
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Mouse interaction
    let mouse = { x: null, y: null, radius: 120 };
    const heroSection = document.getElementById('hero');
    
    if (heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      
      heroSection.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update & Draw particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 90, 95, ${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
        
        // Connect particles to mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255, 90, 95, ${0.25 * (1 - dist / mouse.radius)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    };
    animate();
  }
});
