import React, { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolioData';
import conferenceMoldova from '../assets/Conference at Moldova.jpeg';
import conferenceMoldovaRepublic from '../assets/Republic of Moldova Conference.jpeg';
import conference1 from '../assets/conference1.jpeg';
import conference3 from '../assets/conference3.jpeg';
import conference from '../assets/conference.jpeg';
import miniCastle from '../assets/Mini Castle Mondova.jpeg';
import livePresentation from '../assets/live presentation shanghai.jpeg';
import backgroundImage from '../assets/background Image.jpeg';
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

const AcademicPortfolio = ({ onBack }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedYear, setExpandedYear] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [backgroundImageSrc, setBackgroundImageSrc] = useState(backgroundImage);
  const [nextBackgroundImageSrc, setNextBackgroundImageSrc] = useState(null);

  const carouselImages = [
    { src: conferenceMoldova, alt: "Conference at Moldova" },
    { src: conferenceMoldovaRepublic, alt: "Republic of Moldova Conference" },
    { src: livePresentation, alt: "Live Presentation Shanghai" },
    { src: conference1, alt: "Conference" },
    { src: conference3, alt: "Conference" },
    { src: miniCastle, alt: "Mini Castle Moldova" },
    { src: backgroundImage, alt: "Background" }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 600);
    return () => clearTimeout(timer);
  }, [currentSection]);

  const data = portfolioData.academic;
  const sections = [
    {
      id: 'education',
      title: 'Education',
      content: (
        <div className="section-content">
          <div className="education-timeline">
            {data.education.map((edu, idx) => (
              <div key={idx} className="education-item">
                <div className="education-period">{edu.period}</div>
                <div className="education-details">
                  <h3 className="education-degree">{edu.degree}</h3>
                  {edu.specialization && (
                    <p className="education-specialization">{edu.specialization}</p>
                  )}
                  <p className="education-institution">{edu.institution}</p>
                  <p className="education-location">{edu.location}</p>
                  {edu.dissertation && (
                    <div className="education-thesis">
                      <strong>Dissertation:</strong> {edu.dissertation}
                    </div>
                  )}
                  {edu.thesis && (
                    <div className="education-thesis">
                      <strong>Thesis:</strong> {edu.thesis}
                    </div>
                  )}
                  {edu.title && (
                    <div className="education-thesis">
                      <strong>Title:</strong> {edu.title}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'research',
      title: 'Research Experience',
      content: (
        <div className="section-content">
          <div className="research-overview">
            <p className="research-intro">{data.research.overview}</p>
          </div>
          <div className="research-themes">
            <h3>Core Research Themes</h3>
            {data.research.themes.map((theme, idx) => (
              <div key={idx} className="theme-card">
                <h4>{theme.title}</h4>
                <p>{theme.description}</p>
              </div>
            ))}
          </div>
          <div className="research-applications">
            <h3>Interdisciplinary Applications</h3>
            <ul className="applications-list">
              {data.research.applications.map((app, idx) => (
                <li key={idx}>{app}</li>
              ))}
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'conferences',
      title: 'Conference Photos',
      content: (
        <div className="section-content">
          <div className="conference-gallery">
            <div className="gallery-item">
              <img src={conferenceMoldova} alt="Conference at Moldova" className="gallery-image" />
              <div className="gallery-caption">Conference at Moldova</div>
            </div>
            <div className="gallery-item">
              <img src={conferenceMoldovaRepublic} alt="Republic of Moldova Conference" className="gallery-image" />
              <div className="gallery-caption">Republic of Moldova Conference</div>
            </div>
            <div className="gallery-item">
              <img src={conference1} alt="Conference" className="gallery-image" />
              <div className="gallery-caption">Academic Conference</div>
            </div>
            <div className="gallery-item">
              <img src={conference3} alt="Conference" className="gallery-image" />
              <div className="gallery-caption">Research Conference</div>
            </div>
            <div className="gallery-item">
              <img src={conference} alt="Conference" className="gallery-image" />
              <div className="gallery-caption">International Conference</div>
            </div>
            <div className="gallery-item">
              <img src={miniCastle} alt="Mini Castle Moldova" className="gallery-image" />
              <div className="gallery-caption">Moldova - Mini Castle</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'publications',
      title: 'Publications & Presentations',
      content: (
        <div className="section-content">
          <div className="publications-container">
            {data.publications.map((yearGroup, idx) => (
              <div key={idx} className="publication-year-group">
                <button
                  className="year-header"
                  onClick={() => setExpandedYear(expandedYear === yearGroup.year ? null : yearGroup.year)}
                >
                  <span className="year">{yearGroup.year}</span>
                  <span className="year-count">{yearGroup.items.length} {yearGroup.items.length === 1 ? 'publication' : 'publications'}</span>
                  <span className="year-toggle">{expandedYear === yearGroup.year ? '−' : '+'}</span>
                </button>
                {expandedYear === yearGroup.year && (
                  <div className="publications-list">
                    {yearGroup.items.map((pub, pubIdx) => (
                      <div key={pubIdx} className="publication-item">
                        <div className="publication-authors">{pub.authors}</div>
                        <div className="publication-title">{pub.title}</div>
                        {pub.journal && (
                          <div className="publication-journal">
                            <em>{pub.journal}</em>
                            {pub.volume && <span> {pub.volume}</span>}
                            {pub.pages && <span>, {pub.pages}</span>}
                          </div>
                        )}
                        {pub.conference && (
                          <div className="publication-conference">
                            <strong>Conference:</strong> {pub.conference}
                          </div>
                        )}
                        {pub.location && (
                          <div className="publication-location">
                            <strong>Location:</strong> {pub.location}
                          </div>
                        )}
                        {pub.date && (
                          <div className="publication-date">
                            <strong>Date:</strong> {pub.date}
                          </div>
                        )}
                        {pub.doi && (
                          <div className="publication-doi">
                            <strong>DOI:</strong> <a href={pub.doi} target="_blank" rel="noopener noreferrer">{pub.doi}</a>
                          </div>
                        )}
                        {pub.link && (
                          <div className="publication-link">
                            <a href={pub.link} target="_blank" rel="noopener noreferrer">View Publication →</a>
                          </div>
                        )}
                        {pub.status && (
                          <div className="publication-status">
                            <span className="status-badge">{pub.status}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'grants',
      title: 'Grants & Awards',
      content: (
        <div className="section-content">
          <div className="grants-list">
            {data.grants.map((grant, idx) => (
              <div key={idx} className="grant-card">
                <div className="grant-header">
                  <div className="grant-period">{grant.period}</div>
                  <div className="grant-amount">{grant.amount}</div>
                </div>
                <h3 className="grant-description">{grant.description}</h3>
                <p className="grant-sponsor"><strong>Sponsor:</strong> {grant.sponsor}</p>
                <p className="grant-location"><strong>Location:</strong> {grant.location}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'development',
      title: 'Professional Development',
      content: (
        <div className="section-content">
          <div className="development-timeline">
            {data.professionalDevelopment.map((dev, idx) => (
              <div key={idx} className="development-item">
                <div className="dev-year">{dev.year}</div>
                <div className="dev-content">
                  <h3 className="dev-title">{dev.title}</h3>
                  {dev.location && <p className="dev-location">📍 {dev.location}</p>}
                  {dev.organization && <p className="dev-org">🏢 {dev.organization}</p>}
                  {dev.program && <p className="dev-program">📚 {dev.program}</p>}
                  {dev.date && <p className="dev-date">📅 {dev.date}</p>}
                </div>
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
      className={`portfolio-container academic ${isVisible ? 'visible' : ''}`}
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
        <h1 className="portfolio-title">Academic Portfolio</h1>
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

export default AcademicPortfolio;
