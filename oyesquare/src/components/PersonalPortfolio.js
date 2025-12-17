import React, { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolioData';
import personalSelfie from '../assets/personalSelfie.jpeg';
import tripToChina from '../assets/trip to china.jpeg';
import tripToBankOfChina from '../assets/trip to bank of china.jpeg';
import backgroundImage from '../assets/background Image.jpeg';
import conferenceMoldova from '../assets/Conference at Moldova.jpeg';
import './Portfolio.css';

// Vertical Carousel Component
const VerticalImageCarousel = ({ images, onImageChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length, isAutoPlaying]);

  useEffect(() => {
    if (onImageChange && images[currentIndex]) {
      onImageChange(images[currentIndex]);
    }
  }, [currentIndex, images, onImageChange]);

  // Set initial background image on mount
  useEffect(() => {
    if (onImageChange && images && images.length > 0) {
      onImageChange(images[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="vertical-carousel-container">
      <button className="vertical-carousel-button up" onClick={goToPrevious} aria-label="Previous">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>
      
      <div className="vertical-carousel-slides">
        {images.map((image, index) => (
          <div
            key={index}
            className={`vertical-carousel-slide ${index === currentIndex ? 'active' : ''}`}
            style={{ transform: `translateY(${(index - currentIndex) * 100}%)` }}
            onClick={() => goToSlide(index)}
          >
            <img src={image.src} alt={image.alt} className="vertical-carousel-image" />
          </div>
        ))}
      </div>
      
      <button className="vertical-carousel-button down" onClick={goToNext} aria-label="Next">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      
      <div className="vertical-carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`vertical-carousel-indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const PersonalPortfolio = ({ onBack }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [backgroundImageSrc, setBackgroundImageSrc] = useState(backgroundImage);
  const [nextBackgroundImageSrc, setNextBackgroundImageSrc] = useState(null);

  const carouselImages = [
    { src: personalSelfie, alt: "Personal" },
    { src: tripToChina, alt: "Trip to China" },
    { src: tripToBankOfChina, alt: "Bank of China Visit" },
    { src: backgroundImage, alt: "Background" },
    { src: conferenceMoldova, alt: "Conference" }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 600);
    return () => clearTimeout(timer);
  }, [currentSection]);

  const data = portfolioData.personal;
  const sections = [
    {
      id: 'intro',
      title: 'Introduction',
      content: (
        <div className="section-content">
          <div className="intro-header">
            <h2 className="name-title">{data.name}</h2>
            <p className="name-subtitle">{data.title}</p>
          </div>
          <div className="bio-section">
            <p className="bio-text">{data.bio}</p>
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
      )
    },
    {
      id: 'contact',
      title: 'Contact Information',
      content: (
        <div className="section-content">
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
                <p>{data.contact.phone}</p>
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
      )
    },
    {
      id: 'community',
      title: 'Community Involvement',
      content: (
        <div className="section-content">
          <div className="timeline">
            {data.community.items.map((item, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="timeline-period">{item.period}</div>
                  <h3 className="timeline-role">{item.role}</h3>
                  <p className="timeline-org">{item.organization}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'experiences',
      title: 'Personal Experiences & Travel',
      content: (
        <div className="section-content">
          <div className="personal-gallery">
            <div className="gallery-item">
              <img src={personalSelfie} alt="Personal" className="gallery-image" />
              <div className="gallery-caption">Personal Photo</div>
            </div>
            <div className="gallery-item">
              <img src={tripToChina} alt="Trip to China" className="gallery-image" />
              <div className="gallery-caption">Trip to China</div>
            </div>
            <div className="gallery-item">
              <img src={tripToBankOfChina} alt="Trip to Bank of China" className="gallery-image" />
              <div className="gallery-caption">Bank of China Visit</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'languages',
      title: 'Languages',
      content: (
        <div className="section-content">
          <div className="languages-grid">
            {data.languages.map((lang, idx) => (
              <div key={idx} className="language-card">
                <span className="language-icon">🌐</span>
                <span className="language-text">{lang}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <div 
      className={`portfolio-container personal ${isVisible ? 'visible' : ''}`}
      style={{ 
        backgroundImage: `url(${backgroundImageSrc})`
      }}
    >
      <div className="portfolio-bg-overlay"></div>
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
        <div className="math-formula formula-4">∀x ∈ ℝ</div>
        <div className="math-symbol math-7">α</div>
        <div className="math-symbol math-8">β</div>
      </div>
      <VerticalImageCarousel 
        images={carouselImages} 
        onImageChange={(image) => {
          if (image && image.src && image.src !== backgroundImageSrc) {
            setNextBackgroundImageSrc(image.src);
            setTimeout(() => {
              setBackgroundImageSrc(image.src);
              setNextBackgroundImageSrc(null);
            }, 100);
          }
        }}
      />
      {nextBackgroundImageSrc && (
        <div 
          className="portfolio-bg-next"
          style={{ backgroundImage: `url(${nextBackgroundImageSrc})` }}
        ></div>
      )}
      <div className="portfolio-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Portfolio Selection
        </button>
        <h1 className="portfolio-title">Personal Portfolio</h1>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="portfolio-content">
        <div className="section-navigation">
          {sections.map((section, idx) => (
            <button
              key={section.id}
              className={`nav-dot ${idx === currentSection ? 'active' : ''} ${idx < currentSection ? 'completed' : ''}`}
              onClick={() => setCurrentSection(idx)}
              title={section.title}
            >
              <span className="dot-inner"></span>
            </button>
          ))}
        </div>

        <div className="section-display">
          <div className="section-header">
            <h2>{sections[currentSection].title}</h2>
            <div className="section-counter">
              {currentSection + 1} / {sections.length}
            </div>
          </div>
          <div className={`section-body ${isTransitioning ? 'transitioning' : ''}`}>
            {sections[currentSection].content}
          </div>
        </div>

        <div className="section-controls">
          <button 
            className="nav-button prev" 
            onClick={prevSection}
            disabled={currentSection === 0}
          >
            ← Previous
          </button>
          {currentSection < sections.length - 1 ? (
            <button className="nav-button next" onClick={nextSection}>
              Next →
            </button>
          ) : (
            <button className="nav-button finish" onClick={onBack}>
              Complete Journey ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalPortfolio;
