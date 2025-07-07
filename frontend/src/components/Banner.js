import React, { useState, useEffect, useCallback } from 'react';
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
      description: 'Hỗ trợ xin visa với tỷ lệ thành công cao'
    },
    {
      src: "/images/banner/sl4.jpg",
      description: 'Kết nối với cựu du học sinh thành công'
    }
  ];

  const images = [...realImages, realImages[0]]; // Clone ảnh đầu

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const goToNext = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
  }, []);

  const goToPrev = useCallback(() => {
    setIsTransitioning(true);
    if (currentIndex === 0) {
      setCurrentIndex(realImages.length - 1);
    } else {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex, realImages.length]);

  useEffect(() => {
    const interval = setInterval(goToNext, 4000);
    return () => clearInterval(interval);
  }, [goToNext]);

  useEffect(() => {
    if (currentIndex === images.length - 1) {
      // Nếu tới ảnh clone → reset về ảnh 0 không transition
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 800); // Khớp với thời gian transition
    } else {
      setIsTransitioning(true);
    }
  }, [currentIndex, images.length]);

  return (
    <div className="position-relative" style={{
      height: '400px',
      overflow: 'hidden',
      width: '100%'
    }}>
      {/* Slides container */}
      <div
        className="d-flex h-100"
        style={{
          width: `${images.length * 100}%`,
          transform: `translateX(-${currentIndex * (100 / images.length)}%)`,
          transition: isTransitioning ? 'transform 0.8s ease-in-out' : 'none'
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="h-100 d-flex align-items-center"
            style={{
              width: `${100 / images.length}%`,
              backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${image.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              flexShrink: 0
            }}
          >
            <div className="container text-white px-5">
              {image.title && (
                <h1 className="display-4 fw-bold mb-3">{image.title}</h1>
              )}
              <p className="lead mb-4">{image.description}</p>
              <button className="btn btn-primary btn-lg">Đăng ký ngay</button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        className="position-absolute top-50 start-0 translate-middle-y btn btn-dark rounded-circle p-3 ms-3"
        onClick={goToPrev}
        style={{
          zIndex: 1,
          opacity: 0.7,
          transition: 'opacity 0.3s',
          border: 'none'
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = 1}
        onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
      >
        <FaChevronLeft size={20} />
      </button>

      <button
        className="position-absolute top-50 end-0 translate-middle-y btn btn-dark rounded-circle p-3 me-3"
        onClick={goToNext}
        style={{
          zIndex: 1,
          opacity: 0.7,
          transition: 'opacity 0.3s',
          border: 'none'
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = 1}
        onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
      >
        <FaChevronRight size={20} />
      </button>

      {/* Slide indicators */}
      <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex">
        {realImages.map((_, index) => (
          <button
            key={index}
            className={`btn btn-sm mx-1 rounded-circle ${currentIndex === index || (currentIndex === images.length - 1 && index === 0) ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setIsTransitioning(true);
              setCurrentIndex(index);
            }}
            style={{
              width: '10px',
              height: '10px',
              padding: 0,
              transition: 'background-color 0.3s'
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SuperBanner;
