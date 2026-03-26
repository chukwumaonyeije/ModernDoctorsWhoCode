import { useState } from 'react';

interface Slide {
  src: string;
  alt: string;
  caption: string;
}

interface Props {
  slides: Slide[];
}

export default function ScreenshotCarousel({ slides }: Props) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setCurrent((i) => (i + 1) % slides.length);

  return (
    <div style={{
      backgroundColor: '#111827',
      border: '1px solid #1e293b',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      margin: '2rem 0',
    }}>
      {/* Image */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', backgroundColor: '#0d1b2a' }}>
        {slides.map((slide, i) => (
          <img
            key={i}
            src={slide.src}
            alt={slide.alt}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              opacity: i === current ? 1 : 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: i === current ? 'auto' : 'none',
            }}
          />
        ))}

        {/* Prev / Next */}
        <button
          onClick={prev}
          aria-label="Previous screenshot"
          style={{
            position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
            backgroundColor: 'rgba(13,27,42,0.8)', border: '1px solid #1e293b',
            borderRadius: '50%', width: '2.25rem', height: '2.25rem',
            color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', lineHeight: 1,
          }}
        >‹</button>
        <button
          onClick={next}
          aria-label="Next screenshot"
          style={{
            position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
            backgroundColor: 'rgba(13,27,42,0.8)', border: '1px solid #1e293b',
            borderRadius: '50%', width: '2.25rem', height: '2.25rem',
            color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', lineHeight: 1,
          }}
        >›</button>
      </div>

      {/* Caption + dots */}
      <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid #1e293b' }}>
        <p style={{
          margin: 0, color: '#94a3b8', fontSize: '0.8125rem',
          fontFamily: "'JetBrains Mono', monospace", textAlign: 'center',
        }}>
          {slides[current].caption}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '0.625rem' }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to screenshot ${i + 1}`}
              style={{
                width: i === current ? '1.25rem' : '0.5rem',
                height: '0.5rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: i === current ? '#38bdf8' : '#1e293b',
                cursor: 'pointer',
                transition: 'width 0.2s ease, background-color 0.2s ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
