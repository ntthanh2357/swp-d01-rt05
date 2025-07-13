import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const SuperBanner = () => {
  const realImages = [
    {
      src: "/images/banner/sl1.jpg",
      title: 'Du học Mỹ 2025',
      description: 'Tư vấn, điều kiện, visa, chi phí, học bổng mới nhất'
    },
    {
      src: "/images/banner/sl2.jpg",
      title: 'Học bổng toàn phần',
      description: 'Cơ hội nhận học bổng 100% từ các trường top'
    },
    {
      src: "/images/banner/sl3.jpg",
      title: 'Visa thành công',
      description: 'Hỗ trợ xin visa với tỷ lệ thành công cao'
    },
    {
      src: "/images/banner/sl4.jpg",
      title: 'Cộng đồng du học sinh',
      description: 'Kết nối với cựu du học sinh thành công'
    }
  ];

  const images = [realImages[realImages.length - 1], ...realImages, realImages[0]];
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const transitionTime = 800; // ms
  const intervalRef = useRef();
  const containerRef = useRef();
  const isJumpingRef = useRef(false);

  // Auto slide
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      goToNext();
    }, 4000);
    return () => clearInterval(intervalRef.current);
  });

  // Xử lý chuyển động vô hạn với force reflow
  useEffect(() => {
    if (currentIndex === images.length - 1) {
      setTimeout(() => {
        setIsTransitioning(false);
        isJumpingRef.current = true;
        setCurrentIndex(1);
      }, transitionTime);
    } else if (currentIndex === 0) {
      setTimeout(() => {
        setIsTransitioning(false);
        isJumpingRef.current = true;
        setCurrentIndex(images.length - 2);
      }, transitionTime);
    } else {
      setIsTransitioning(true);
    }
  }, [currentIndex, images.length]);

  useEffect(() => {
    if (!isTransitioning && isJumpingRef.current) {
      if (containerRef.current) {
        void containerRef.current.offsetHeight;
      }
      setIsTransitioning(true);
      isJumpingRef.current = false;
    }
  }, [isTransitioning]);

  const goToNext = () => {
    if (isTransitioning) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (isTransitioning) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const goToIndex = (idx) => {
    setCurrentIndex(idx + 1);
    setIsTransitioning(true);
  };

  const bannerHeight = 'min(60vw, 400px)';

  return (
    <div className="position-relative" style={{
      height: bannerHeight,
      overflow: 'hidden',
      width: '100%'
    }}>
      {/* Slides container */}
      <div
        ref={containerRef}
        className="d-flex h-100"
        style={{
          width: `${images.length * 100}%`,
          transform: `translateX(-${currentIndex * (100 / images.length)}%)`,
          transition: isTransitioning ? `transform ${transitionTime}ms cubic-bezier(0.77,0,0.18,1)` : 'none',
        }}
      >
        {images.map((image, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={index}
              className="h-100 d-flex align-items-end justify-content-start banner-slide"
              style={{
                width: `${100 / images.length}%`,
                backgroundImage: `url(${image.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                flexShrink: 0,
                transition: 'transform 0.8s, opacity 0.8s',
                transform: isActive ? 'scale(1.03)' : 'scale(0.97)',
                opacity: isActive ? 1 : 0.7,
                filter: isActive ? 'brightness(1)' : 'brightness(0.7)'
              }}
            >
              {/* Overlay chỉ phía sau chữ */}
              {isActive && (
                <div className="banner-content-box p-3 p-md-4 mb-4 ms-3 ms-md-5" style={{
                  background: 'rgba(0,0,0,0.55)',
                  borderRadius: '1.2rem',
                  maxWidth: 400,
                  minWidth: 220,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                  color: '#fff',
                  zIndex: 2
                }}>
                  <h1 className="fw-bold mb-2 banner-title" style={{
                    fontSize: 'clamp(1.3rem, 3vw, 2.1rem)',
                    letterSpacing: '1px',
                    textShadow: '0 2px 12px rgba(0,0,0,0.35)',
                    color: '#fff',
                  }}>{image.title}</h1>
                  <p className="mb-3 banner-desc" style={{
                    fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
                    color: '#f3f3f3',
                    textShadow: '0 1px 4px rgba(0,0,0,0.18)'
                  }}>{image.description}</p>
                  <button className="btn btn-lg banner-btn shadow" style={{
                    background: 'linear-gradient(90deg, #0d6efd 60%, #3ec6e0 100%)',
                    border: 'none',
                    borderRadius: '2rem',
                    fontWeight: 600,
                    fontSize: '1.05rem',
                    padding: '0.6rem 1.6rem',
                    color: '#fff',
                    boxShadow: '0 2px 12px #0d6efd33',
                    transition: 'background 0.3s, transform 0.2s',
                  }}>Đăng ký ngay</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <button
        className="position-absolute top-50 start-0 translate-middle-y btn btn-light rounded-circle p-3 ms-2 shadow banner-nav-btn"
        onClick={goToPrev}
        style={{
          zIndex: 2,
          opacity: 0.92,
          border: 'none',
          boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
          background: 'rgba(255,255,255,0.92)',
          transition: 'background 0.3s, opacity 0.3s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,1)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.92)'}
        aria-label="Previous slide"
      >
        <FaChevronLeft size={24} color="#0d6efd" />
      </button>

      <button
        className="position-absolute top-50 end-0 translate-middle-y btn btn-light rounded-circle p-3 me-2 shadow banner-nav-btn"
        onClick={goToNext}
        style={{
          zIndex: 2,
          opacity: 0.92,
          border: 'none',
          boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
          background: 'rgba(255,255,255,0.92)',
          transition: 'background 0.3s, opacity 0.3s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,1)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.92)'}
        aria-label="Next slide"
      >
        <FaChevronRight size={24} color="#0d6efd" />
      </button>

      {/* Slide indicators */}
      <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex align-items-center">
        {realImages.map((_, idx) => {
          const isActive = currentIndex === idx + 1 || (currentIndex === 0 && idx === realImages.length - 1) || (currentIndex === images.length - 1 && idx === 0);
          return (
            <button
              key={idx}
              className={`mx-1 rounded-circle banner-indicator ${isActive ? 'bg-primary' : 'bg-secondary'}`}
              onClick={() => goToIndex(idx)}
              style={{
                width: isActive ? '18px' : '12px',
                height: isActive ? '18px' : '12px',
                border: isActive ? '3px solid #fff' : '2px solid #fff',
                outline: isActive ? '2px solid #0d6efd' : 'none',
                boxShadow: isActive ? '0 0 12px #0d6efd55' : 'none',
                opacity: isActive ? 1 : 0.6,
                transition: 'all 0.3s',
                cursor: 'pointer',
                padding: 0,
                background: isActive ? 'linear-gradient(90deg, #0d6efd 60%, #3ec6e0 100%)' : '#adb5bd',
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          );
        })}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .banner-slide .banner-content-box { padding: 1rem !important; min-width: 160px !important; max-width: 90vw !important; }
          .banner-title { font-size: 1.1rem !important; }
          .banner-btn { font-size: 0.95rem !important; padding: 0.5rem 1.1rem !important; }
        }
        .banner-nav-btn:active { transform: scale(0.95); }
        .banner-indicator:active { transform: scale(0.85); }
        .banner-btn:hover {
          background: linear-gradient(90deg, #3ec6e0 60%, #0d6efd 100%) !important;
          color: #fff !important;
          transform: translateY(-2px) scale(1.04);
        }
        .banner-title {
          font-family: 'Montserrat', 'Arial', sans-serif;
          letter-spacing: 1.5px;
        }
        .banner-desc {
          font-family: 'Roboto', 'Arial', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default SuperBanner;
