import React, { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolioData';
import backgroundImage from '../assets/background Image.jpeg';
import conferenceMoldova from '../assets/Conference at Moldova.jpeg';
import livePresentation from '../assets/live presentation shanghai.jpeg';
import conferenceMoldovaRepublic from '../assets/Republic of Moldova Conference.jpeg';
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

const ProfessionalPortfolio = ({ onBack }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedExperience, setExpandedExperience] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [backgroundImageSrc, setBackgroundImageSrc] = useState(backgroundImage);
  const [nextBackgroundImageSrc, setNextBackgroundImageSrc] = useState(null);

  const carouselImages = [
    { src: backgroundImage, alt: "Background" },
    { src: conferenceMoldova, alt: "Conference at Moldova" },
    { src: livePresentation, alt: "Live Presentation Shanghai" },
    { src: conferenceMoldovaRepublic, alt: "Moldova Conference" }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Set initial background image on mount
  useEffect(() => {
    if (carouselImages && carouselImages.length > 0) {
      setBackgroundImageSrc(carouselImages[0].src);
    }
  }, []);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 600);
    return () => clearTimeout(timer);
  }, [currentSection]);

  const data = portfolioData.professional;
  const sections = [
    {
      id: 'teaching',
      title: 'Teaching Experience',
      content: (
        <div className="section-content">
          <div className="experience-list">
            {data.teachingExperience.map((exp, idx) => (
              <div key={idx} className="experience-card">
                <div className="experience-header">
                  <div className="experience-period">{exp.period}</div>
                  <button
                    className="expand-button"
                    onClick={() => setExpandedExperience(expandedExperience === idx ? null : idx)}
                  >
                    {expandedExperience === idx ? '−' : '+'}
                  </button>
                </div>
                <h3 className="experience-role">{exp.role}</h3>
                <p className="experience-institution">{exp.institution}</p>
                {exp.location && <p className="experience-location">📍 {exp.location}</p>}
                {expandedExperience === idx && (
                  <div className="experience-details">
                    {exp.courses && (
                      <div className="courses-section">
                        <h4>Courses Taught:</h4>
                        <ul className="courses-list">
                          {exp.courses.map((course, cIdx) => (
                            <li key={cIdx}>{course}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exp.subjects && (
                      <div className="subjects-section">
                        <h4>Subjects:</h4>
                        <div className="subjects-grid">
                          {exp.subjects.map((subject, sIdx) => (
                            <span key={sIdx} className="subject-tag">{subject}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {exp.institutions && (
                      <div className="institutions-section">
                        <h4>Institutions:</h4>
                        <ul className="institutions-list">
                          {exp.institutions.map((inst, iIdx) => (
                            <li key={iIdx}>{inst}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exp.assignments && (
                      <div className="assignments-section">
                        <h4>Assignments:</h4>
                        <ul className="assignments-list">
                          {exp.assignments.map((assignment, aIdx) => (
                            <li key={aIdx}>{assignment}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exp.achievements && (
                      <div className="achievements-section">
                        <h4>Key Achievements:</h4>
                        <ul className="achievements-list">
                          {exp.achievements.map((achievement, aIdx) => (
                            <li key={aIdx}>✓ {achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'administration',
      title: 'Administrative Experience',
      content: (
        <div className="section-content">
          <div className="administration-list">
            {data.administration.map((admin, idx) => (
              <div key={idx} className="admin-card">
                <div className="admin-period">{admin.period}</div>
                <h3 className="admin-role">{admin.role}</h3>
                <p className="admin-institution">{admin.institution}</p>
                {admin.responsibilities && (
                  <div className="admin-responsibilities">
                    <h4>Key Responsibilities:</h4>
                    <ul className="responsibilities-list">
                      {admin.responsibilities.map((resp, rIdx) => (
                        <li key={rIdx}>• {resp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'skills',
      title: 'Skills & Expertise',
      content: (
        <div className="section-content">
          <div className="skills-container">
            <div className="skills-category">
              <h3>Technical Skills</h3>
              <div className="skills-grid">
                {data.skills.technical.map((skill, idx) => (
                  <div key={idx} className="skill-badge technical">{skill}</div>
                ))}
              </div>
            </div>
            <div className="skills-category">
              <h3>Teaching Expertise</h3>
              <div className="skills-grid">
                {data.skills.teaching.map((skill, idx) => (
                  <div key={idx} className="skill-badge teaching">{skill}</div>
                ))}
              </div>
            </div>
            <div className="skills-category">
              <h3>Teaching Tools</h3>
              <div className="skills-grid">
                {data.skills.tools.map((tool, idx) => (
                  <div key={idx} className="skill-badge tool">{tool}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'certifications',
      title: 'Certifications',
      content: (
        <div className="section-content">
          <div className="certifications-list">
            {data.certifications.map((cert, idx) => (
              <div key={idx} className="certification-card">
                <div className="cert-period">{cert.period}</div>
                <h3 className="cert-title">{cert.title}</h3>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'philosophy',
      title: 'Teaching Philosophy',
      content: (
        <div className="section-content">
          <div className="philosophy-content">
            <p className="philosophy-text">{data.teachingPhilosophy}</p>
          </div>
        </div>
      )
    },
    {
      id: 'evaluations',
      title: 'Student Evaluations',
      content: (
        <div className="section-content">
          <div className="evaluations-list">
            {data.studentEvaluations.map((evaluation, idx) => (
              <div key={idx} className="evaluation-card">
                <div className="evaluation-quote">"{evaluation.quote}"</div>
                {evaluation.date && <div className="evaluation-date">— {evaluation.date}</div>}
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
      className={`portfolio-container professional ${isVisible ? 'visible' : ''}`}
    >
      <div 
        key={backgroundImageSrc}
        className="portfolio-bg-image"
        style={{ 
          backgroundImage: `url(${backgroundImageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          opacity: nextBackgroundImageSrc ? 0 : 1,
          transition: 'opacity 2s ease-in-out'
        }}
      ></div>
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
          style={{ 
            backgroundImage: `url(${nextBackgroundImageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        ></div>
      )}
      <div className="portfolio-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Portfolio Selection
        </button>
        <h1 className="portfolio-title">Professional Portfolio</h1>
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

export default ProfessionalPortfolio;
