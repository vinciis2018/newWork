import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SimpleLayout } from '../../layouts/AppLayout';
import { useTheme } from '../../hooks/useTheme';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export function LandingPage() {
  const { toggleTheme } = useTheme();
  const featureRefs = useRef<Array<HTMLDivElement | null>>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

  // GSAP Animations
  useEffect(() => {
    // Typing animation for hero text
    const heroText = 'Welcome to Our Platform';
    const heroElement = document.querySelector('.hero-text');
    
    if (!heroElement) return;
    
    heroElement.textContent = ''; // Clear the text initially
    
    // Create cursor element
    const cursor = document.createElement('span');
    cursor.className = 'inline-block w-1 h-12 bg-[var(--primary)] ml-1 align-middle animate-blink';
    
    // Create a container for the text to avoid cursor jumping
    const textContainer = document.createElement('span');
    heroElement.appendChild(textContainer);
    heroElement.appendChild(cursor);
    
    let timeoutId: NodeJS.Timeout;
    const animationFrame = requestAnimationFrame(() => {
      timeoutId = setTimeout(typeWriter, 500);
    });
    let i = 0;
    
    const typeWriter = () => {
      if (i < heroText.length) {
        const char = document.createTextNode(heroText[i]);
        textContainer.appendChild(char);
        i++;
        timeoutId = setTimeout(typeWriter, 50); // Typing speed (ms)
      } else {
        // Remove cursor when done
        cursor.remove();
        // Animate other elements after typing is done
        gsap.fromTo(
          '.hero-subtitle, .hero-buttons',
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
          }
        );
      }
    };
    
    // Animation starts automatically due to requestAnimationFrame

    // Features animation
    featureRefs.current.forEach((feature, i) => {
      if (!feature) return;
      
      gsap.fromTo(
        feature,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: feature,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          delay: i * 0.2
        }
      );
    });

    // CTA animation
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { scale: 0.95, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(timeoutId);
      // Remove cursor if it exists
      if (cursor.parentNode === heroElement) {
        heroElement.removeChild(cursor);
      }

      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const features = [
    {
      icon: '🚀',
      title: 'Lightning Fast',
      description: 'Built with the latest technologies for optimal performance.'
    },
    {
      icon: '🎨',
      title: 'Beautiful UI',
      description: 'Modern design that looks great on any device.'
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security to keep your data safe.'
    }
  ];

  return (
    <SimpleLayout>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center text-center px-4 py-20">
        <div className="max-w-4xl mx-auto hero-content">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[var(--text)] min-h-[84px] md:min-h-[112px] flex items-center justify-center">
            <span className="hero-text"></span>
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl text-[var(--text-muted)] mb-10 max-w-3xl mx-auto opacity-0">
            Build amazing experiences with our powerful tools and components.
          </p>
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center opacity-0">
            <button
              type="button"
              onClick={toggleTheme}
              className="px-8 py-3 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Get Started
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-8 py-3 border-2 border-[var(--primary)] text-[var(--primary)] rounded-lg hover:bg-[var(--primary)] hover:text-white transition-colors font-medium"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-[var(--background-alt)]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-[var(--text)]">
            Amazing Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) featureRefs.current[index] = el;
                  return undefined;
                }}
                className="bg-[var(--background)] p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-[var(--text)]">
                  {feature.title}
                </h3>
                <p className="text-[var(--text-muted)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div 
          ref={ctaRef}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] p-12 rounded-2xl text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied users today.
          </p>
          <button
            type="button"
            onClick={toggleTheme}
            className="px-8 py-3 bg-white text-[var(--primary)] rounded-lg hover:bg-opacity-90 transition-opacity font-medium"
          >
            Sign Up Now
          </button>
        </div>
      </section>
    </SimpleLayout>
  );
}
