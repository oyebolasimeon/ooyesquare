import React, { useState, useEffect, useRef } from 'react';
import { portfolioData } from '../data/portfolioData';
import profileImage from '../assets/profileImage.jpeg';
import backgroundImage from '../assets/background Image.jpeg';
import personalSelfie from '../assets/personalSelfie.jpeg';
import tripToChina from '../assets/trip to china.jpeg';
import tripToBankOfChina from '../assets/trip to bank of china.jpeg';
import conferenceMoldova from '../assets/Conference at Moldova.jpeg';
import conferenceMoldovaRepublic from '../assets/Republic of Moldova Conference.jpeg';
import conference1 from '../assets/conference1.jpeg';
import miniCastle from '../assets/Mini Castle Mondova.jpeg';
import livePresentation from '../assets/live presentation shanghai.jpeg';
import './LandingPage.css';

// Carousel Component
const CarouselGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length, isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <button className="carousel-button prev" onClick={goToPrevious} aria-label="Previous">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        
        <div className="carousel-slides">
          {images.map((image, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentIndex ? 'active' : ''} ${
                index === currentIndex - 1 || (currentIndex === 0 && index === images.length - 1) ? 'prev' : ''
              } ${
                index === currentIndex + 1 || (currentIndex === images.length - 1 && index === 0) ? 'next' : ''
              }`}
              style={{ transform: `translateX(${(index - currentIndex) * 100}%)` }}
            >
              <div className="carousel-image-wrapper">
                <img src={image.src} alt={image.alt} className="carousel-image" />
                <div className="carousel-overlay">
                  <span className="carousel-label">{image.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="carousel-button next" onClick={goToNext} aria-label="Next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
      
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const LandingPage = ({ onSelectPortfolio, currentView = 'home', onNavigate }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [bgCarouselIndex, setBgCarouselIndex] = useState(0);
  const heroRef = useRef(null);

  // Background carousel images
  const bgCarouselImages = [
    backgroundImage,
    personalSelfie,
    conferenceMoldova,
    tripToChina,
    livePresentation,
    conferenceMoldovaRepublic
  ];

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Background carousel auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setBgCarouselIndex((prev) => (prev + 1) % bgCarouselImages.length);
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, [bgCarouselImages.length]);

  const portfolios = [
    {
      id: 'personal',
      title: 'Personal',
      subtitle: 'Portfolio',
      icon: 'personal',
      description: 'Discover my journey, background, and personal story',
      color: '#16a085',
      accent: '#f39c12'
    },
    {
      id: 'academic',
      title: 'Academic',
      subtitle: 'Portfolio',
      icon: 'academic',
      description: 'Explore my research, publications, and academic achievements',
      color: '#16a085',
      accent: '#f39c12'
    },
    {
      id: 'professional',
      title: 'Professional',
      subtitle: 'Portfolio',
      icon: 'professional',
      description: 'View my teaching experience, skills, and professional development',
      color: '#16a085',
      accent: '#f39c12'
    }
  ];

  const data = portfolioData.personal;
  const yearsExperience = 15;

  return (
    <div 
      className={`landing-page ${isLoaded ? 'loaded' : ''}`}
      ref={heroRef}
      style={{
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`
      }}
    >
      {/* Animated Background Elements */}
      <div className="animated-bg">
        <div 
          className="bg-image" 
          style={{ 
            backgroundImage: `url(${bgCarouselImages[bgCarouselIndex]})`,
            opacity: 0.12
          }}
        ></div>
        <div className="bg-gradient"></div>
        {/* Mathematical Elements Overlay */}
        <div className="mathematical-overlay">
          <div className="math-symbol math-1">∫</div>
          <div className="math-symbol math-2">∑</div>
          <div className="math-symbol math-3">∂</div>
          <div className="math-symbol math-4">∇</div>
          <div className="math-symbol math-5">π</div>
          <div className="math-symbol math-6">∞</div>
          <div className="math-formula formula-1">f(x) = ax² + bx + c</div>
          <div className="math-formula formula-2">e^(iπ) + 1 = 0</div>
          <div className="math-formula formula-3">∇·F = 0</div>
        </div>
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{ '--delay': `${i * 0.1}s` }}></div>
          ))}
        </div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="grid-pattern"></div>
        
        {/* Animated Lines */}
        <div className="animated-lines">
          <div className="line line-1"></div>
          <div className="line line-2"></div>
          <div className="line line-3"></div>
        </div>
      </div>

      {/* Header Navigation */}
      <header className="landing-nav">
        <div className="nav-logo" onClick={() => onNavigate && onNavigate('home')}>
          <span className="logo-text">OOYeyemi</span>
        </div>
        <nav className="nav-links">
          <span 
            className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate && onNavigate('home')}
          >
            ( Home )
          </span>
          <span 
            className={`nav-link ${currentView === 'portfolios' ? 'active' : ''}`}
            onClick={() => onNavigate && onNavigate('portfolios')}
          >
            Portfolios
          </span>
          <span 
            className={`nav-link ${currentView === 'about' ? 'active' : ''}`}
            onClick={() => onNavigate && onNavigate('about')}
          >
            About
          </span>
          <span 
            className={`nav-link ${currentView === 'contact' ? 'active' : ''}`}
            onClick={() => onNavigate && onNavigate('contact')}
          >
            Contact
          </span>
        </nav>
        <button className="nav-button">Download CV</button>
      </header>

      {/* Main Content - Show only on home or portfolios view */}
      {(currentView === 'home' || currentView === 'portfolios') && (
      <div className="landing-hero">
        {/* Left Side */}
        <div className="hero-left">
          <div className="experience-badge">
            <div className="experience-number" data-count={yearsExperience}>
              <span className="counter">{yearsExperience}</span>
            </div>
            <div className="experience-label">
              <span>YEARS</span>
              <span>EXPERIENCE</span>
            </div>
            <div className="experience-sparkle">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          </div>

          <div className="social-links">
            <a href={`https://${data.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="social-icon linkedin">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href={data.contact.orcid} target="_blank" rel="noopener noreferrer" className="social-icon orcid">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 2.4c5.302 0 9.6 4.298 9.6 9.6S17.302 21.6 12 21.6 2.4 17.302 2.4 12 6.698 2.4 12 2.4zm-1.2 4.8v9.6h1.2V7.2h-1.2zm3.6 0v9.6h1.2V7.2h-1.2z"/>
              </svg>
            </a>
            <a href={`mailto:${data.contact.email}`} className="social-icon email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </a>
            <a href={`tel:${data.contact.phone}`} className="social-icon phone">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Center - Profile Image, Journey Line & Portfolio Cards */}
        <div className="hero-center">
          <svg className="journey-line" viewBox="0 0 800 700" preserveAspectRatio="none">
            <path
              d="M 50 80 Q 150 180 300 280 Q 400 350 500 280 Q 600 200 750 100"
              fill="none"
              stroke="#004d9c"
              strokeWidth="3"
              strokeDasharray="10, 5"
              className="journey-path"
            />
            <circle cx="750" cy="100" r="8" fill="#004d9c" className="journey-arrow">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 750 100; 360 750 100"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>

          {/* Profile Image Section */}
          <div className="profile-image-container">
            <div className="profile-image-wrapper">
              <div className="profile-image">
                <img 
                  src={profileImage} 
                  alt="Dr. Oyeyemi Oluwaseyi Oyebola" 
                  className="profile-photo"
                />
              </div>
              <div className="profile-ring"></div>
              <div className="profile-glow"></div>
            </div>
            
            {/* Name Under Profile Image */}
            <div className="profile-name-section">
              <div className="greeting-text">
                <span className="greeting">Hy! I Am</span>
                <h1 className="hero-name">
                  <span className="name-first">Dr. Oyeyemi</span>
                  <span className="name-middle">Oluwaseyi</span>
                  <span className="name-last">Oyebola.</span>
                </h1>
              </div>
            </div>
          </div>

          <div className="portfolio-cards-container">
            {portfolios.map((portfolio, index) => (
              <div
                key={portfolio.id}
                className={`portfolio-card-modern ${hoveredCard === portfolio.id ? 'hovered' : ''}`}
                style={{
                  '--delay': `${index * 0.2}s`,
                  '--card-color': portfolio.color,
                  '--accent-color': portfolio.accent
                }}
                onMouseEnter={() => setHoveredCard(portfolio.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => onSelectPortfolio(portfolio.id)}
              >
              <div className="card-background-gradient"></div>
              <div className="card-icon-modern">
                {portfolio.icon === 'personal' && (
                  <svg className="portfolio-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                )}
                {portfolio.icon === 'academic' && (
                  <svg className="portfolio-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 0 1 .665 6.479A11.952 11.952 0 0 0 12 20.055a11.952 11.952 0 0 0-6.824-2.998 12.078 12.078 0 0 1 .665-6.479L12 14z"/>
                    <path d="M12 14v9.055M12 14L5.824 10.578M12 14l6.176-3.422M12 14v-9.055"/>
                  </svg>
                )}
                {portfolio.icon === 'professional' && (
                  <svg className="portfolio-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                )}
              </div>
              <div className="card-title-modern">
                <span className="card-title-main">{portfolio.title}</span>
                <span className="card-title-sub">{portfolio.subtitle}</span>
              </div>
              <p className="card-desc-modern">{portfolio.description}</p>
              <div className="card-hover-effect"></div>
              <div className="card-sparkles">
                <span className="sparkle"></span>
                <span className="sparkle"></span>
                <span className="sparkle"></span>
              </div>
              <div className="card-arrow-modern">→</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="hero-right">
          <p className="hero-tagline">
            I teach beautifully complex mathematics, and I love what I do.
          </p>

          <div className="reviews-widget">
            <div className="reviews-header">15+ Years Experience</div>
            <div className="reviews-stars">
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
            </div>
            <div className="reviews-rating">4.9</div>
            <div className="reviews-text">Excellence in Teaching</div>
            <div className="reviews-pulse"></div>
          </div>

          <div className="professional-title">
            <span className="title-creative">Mathematician</span>
            <span className="title-role">Educator & Researcher.</span>
          </div>
        </div>
      </div>
      )}

      {/* About Section */}
      {currentView === 'about' && (
        <div className="landing-section">
          <div className="section-content-wrapper">
            <h2 className="section-title">About Me</h2>
            <div className="about-content">
              <p className="about-text">{data.bio}</p>
              <div className="highlights-grid">
                {data.highlights.map((highlight, idx) => (
                  <div key={idx} className="highlight-card">
                    <span className="highlight-icon">✨</span>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      {currentView === 'contact' && (
        <div className="landing-section">
          <div className="section-content-wrapper">
            <h2 className="section-title">Get In Touch</h2>
            <div className="contact-grid">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <strong>Location</strong>
                  <p>{data.contact.location}</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <strong>Phone</strong>
                  <p><a href={`tel:${data.contact.phone}`}>{data.contact.phone}</a></p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div>
                  <strong>Email</strong>
                  <p><a href={`mailto:${data.contact.email}`}>{data.contact.email}</a></p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">💼</span>
                <div>
                  <strong>LinkedIn</strong>
                  <p><a href={`https://${data.contact.linkedin}`} target="_blank" rel="noopener noreferrer">{data.contact.linkedin}</a></p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🔬</span>
                <div>
                  <strong>ORCID</strong>
                  <p><a href={data.contact.orcid} target="_blank" rel="noopener noreferrer">View Profile</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery Carousel Section */}
      {currentView === 'home' && (
        <div className="landing-gallery-section">
          <h2 className="gallery-section-title">More Achievements</h2>
          <CarouselGallery 
            images={[
            { src: personalSelfie, alt: "Personal Photo", label: "Personal" },
            { src: conferenceMoldova, alt: "Conference at Moldova", label: "Academic" },
            { src: tripToChina, alt: "Trip to China", label: "Travel" },
            { src: livePresentation, alt: "Live Presentation at Shanghai Jiao Tong University", label: "Shanghai Presentation" },
            { src: conferenceMoldovaRepublic, alt: "Moldova Conference", label: "Conference" },
            { src: miniCastle, alt: "Mini Castle Moldova", label: "Moldova" }
          ]}
        />
        </div>
      )}
    </div>
  );
};

export default LandingPage;
