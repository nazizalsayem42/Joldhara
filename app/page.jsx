'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import siteData from '../data/siteData.json';

// Custom Intersection Observer Hook for scroll reveal animations
function useIntersectionObserver(threshold = 0.1) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold]);

  return { ref, isVisible };
}

// Custom Scroll Position & Window Height Hook for parallax effects
function useScrollParallax() {
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(800);
  const animationFrameRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        animationFrameRef.current = null;
      });
    }
  }, []);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    setScrollY(window.scrollY);

    const handleResize = () => setWindowHeight(window.innerHeight);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleScroll]);

  return { scrollY, windowHeight };
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const { scrollY, windowHeight } = useScrollParallax();

  const heroRef = useRef(null);
  const statsObserver = useIntersectionObserver(0.2);
  const projectsObserver = useIntersectionObserver(0.1);
  const contactObserver = useIntersectionObserver(0.2);

  const slidesTimerRef = useRef(null);
  const heroSlides = siteData.hero.slides;

  // Auto-advance hero slides every 5 seconds
  useEffect(() => {
    slidesTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => {
      if (slidesTimerRef.current) clearInterval(slidesTimerRef.current);
    };
  }, [heroSlides.length]);

  const selectSlide = (index) => {
    setCurrentSlide(index);
    if (slidesTimerRef.current) clearInterval(slidesTimerRef.current);
    slidesTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
  };

  // Smooth easing scroll handler
  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    const targetPosition =
      targetElement.getBoundingClientRect().top + window.pageYOffset - 64;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / 1000, 1);
      const easeProgress = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * easeProgress);

      if (timeElapsed < 1000) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  const heroFadeOpacity = Math.max(0, 1 - scrollY / (0.7 * windowHeight));

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <div className="font-lato antialiased bg-white text-gray-800 overflow-x-hidden selection:bg-[#9acd32] selection:text-black">
      {/* Decorative ambient glowing gradient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          style={{
            top: '10%',
            left: '-10%',
            transform: `translateY(${0.15 * scrollY}px)`,
          }}
          className="absolute w-96 h-96 rounded-full bg-[#9acd32]/10 blur-3xl transition-transform duration-100"
        />
        <div
          style={{
            top: '60%',
            right: '-5%',
            transform: `translateY(${-0.1 * scrollY}px)`,
          }}
          className="absolute w-80 h-80 rounded-full bg-[#9acd32]/10 blur-3xl transition-transform duration-100"
        />
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        aria-hidden={!mobileMenuOpen}
        className={`fixed inset-0 z-[60] transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />
        <aside className="absolute right-0 top-0 w-3/4 max-w-xs h-full bg-[#1a1a1a] p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-800">
              <span className="text-white font-bold tracking-wider text-sm uppercase">
                Menu
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-2 rounded-md hover:bg-white/10 text-[#9acd32] transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>

            <nav className="mt-8 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-gray-200 font-semibold p-3 rounded-md hover:bg-[#9acd32]/20 hover:text-[#9acd32] transition border-l-2 border-transparent hover:border-[#9acd32]"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          <div className="text-xs text-gray-500 pt-6 border-t border-gray-800">
            <p className="text-gray-300 font-semibold mb-1">
              {siteData.company.name}
            </p>
            <p>{siteData.company.phone}</p>
          </div>
        </aside>
      </div>

      <main id="home">
        {/* HERO SECTION */}
        <section
          ref={heroRef}
          className="relative h-screen w-full overflow-hidden bg-black"
        >
          {/* Background slides carousel with parallax */}
          <div
            style={{
              transform: `translateY(${0.4 * scrollY}px) scale(${
                1 + 0.0001 * scrollY
              })`,
            }}
            className="absolute inset-0 z-0 will-change-transform transition-transform duration-75"
          >
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.src}
                aria-hidden={idx !== currentSlide}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={idx === 0}
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/85" />
              </div>
            ))}
          </div>

          {/* Sticky Header Nav */}
          <nav className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/70 to-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
              <a
                href="#home"
                onClick={(e) => scrollToSection(e, '#home')}
                className="flex items-center"
              >
                <Image
                  src="/logo5.png"
                  alt="Joldhara Properties Logo"
                  width={941}
                  height={387}
                  priority
                  className="h-[60px] md:h-[70px] w-auto object-contain drop-shadow"
                />
              </a>

              {/* Desktop Nav Items */}
              <div className="hidden md:flex items-center space-x-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-gray-200 hover:text-[#9acd32] text-sm uppercase tracking-wider font-semibold transition"
                  >
                    {link.name}
                  </a>
                ))}
                <a
                  href={`tel:${siteData.company.phone}`}
                  className="px-4 py-2 rounded-full border border-[#9acd32] text-[#9acd32] hover:bg-[#9acd32] hover:text-[#1a1a1a] text-sm font-semibold transition"
                >
                  Call Now
                </a>
              </div>

              {/* Hamburger Button for Mobile */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
                className="md:hidden p-2 rounded-md text-[#9acd32] hover:bg-white/10 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" x2="20" y1="6" y2="6"></line>
                  <line x1="4" x2="20" y1="12" y2="12"></line>
                  <line x1="4" x2="20" y1="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </nav>

          {/* Hero Content */}
          <div
            style={{
              transform: `translateY(${0.25 * scrollY}px)`,
              opacity: heroFadeOpacity,
            }}
            className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center will-change-transform transition-all duration-75"
          >
            <div className="max-w-4xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white drop-shadow-2xl animate-fade-in-up">
                {siteData.hero.headline}
              </h1>

              <div className="flex justify-center mt-6 animate-fade-in-up">
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#9acd32] to-transparent" />
              </div>

              <p className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light drop-shadow-lg animate-fade-in-up">
                {siteData.hero.subheadline}
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
                <a
                  href="#projects"
                  onClick={(e) => scrollToSection(e, '#projects')}
                  className="px-8 py-4 rounded-full bg-[#9acd32] text-[#1a1a1a] font-bold shadow-2xl hover:bg-[#b8e04a] transform hover:scale-105 transition-all duration-300"
                >
                  {siteData.hero.primaryCta.text}
                </a>
                <a
                  href="#contact"
                  onClick={(e) => scrollToSection(e, '#contact')}
                  className="px-8 py-4 rounded-full border-2 border-[#9acd32] text-[#9acd32] font-semibold hover:bg-[#9acd32] hover:text-[#1a1a1a] transition-all duration-300"
                >
                  {siteData.hero.secondaryCta.text}
                </a>
              </div>
            </div>
          </div>

          {/* Carousel Slide Indicators */}
          <div className="absolute bottom-20 left-0 right-0 z-10 flex justify-center gap-3">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => selectSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-3 rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? 'scale-125 bg-[#9acd32] w-8'
                    : 'bg-white/50 hover:bg-[#9acd32]/70 w-3'
                }`}
              />
            ))}
          </div>

          {/* Bouncing Scroll Down Arrow */}
          <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center">
            <a
              href="#projects"
              onClick={(e) => scrollToSection(e, '#projects')}
              aria-label="Scroll down"
              className="flex flex-col items-center animate-bounce text-[#9acd32]"
            >
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </a>
          </div>
        </section>

        {/* STATS SECTION */}
        {siteData.stats && siteData.stats.length > 0 && (
          <section
            id="stats"
            ref={statsObserver.ref}
            className="py-16 bg-gradient-to-r from-gray-50 to-gray-100 relative overflow-hidden"
          >
            <div
              style={{
                transform: `translateY(${
                  0.1 * Math.max(0, scrollY - 0.5 * windowHeight)
                }px)`,
              }}
              className="absolute -top-20 -left-20 w-40 h-40 bg-[#9acd32]/10 rounded-full blur-2xl transition-transform duration-100"
            />
            <div
              style={{
                transform: `translateY(${
                  -0.08 * Math.max(0, scrollY - 0.5 * windowHeight)
                }px)`,
              }}
              className="absolute -bottom-20 -right-20 w-60 h-60 bg-[#9acd32]/10 rounded-full blur-3xl transition-transform duration-100"
            />

            <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
              {siteData.stats.map((stat, idx) => (
                <div
                  key={stat.label}
                  style={{ transitionDelay: `${150 * idx}ms` }}
                  className={`text-center transition-all duration-700 ${
                    statsObserver.isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-12'
                  }`}
                >
                  <div className="text-4xl sm:text-5xl font-bold text-[#1a1a1a]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 mt-2 uppercase tracking-wider font-medium">
                    {stat.label}
                  </div>
                  <div className="w-12 h-1 bg-[#9acd32] mx-auto mt-3" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS SECTION */}
        {siteData.projects.length > 0 && (
          <section
            id="projects"
            ref={projectsObserver.ref}
            className="py-20 bg-white scroll-mt-16 relative overflow-hidden"
          >
            {/* SVG Background Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239acd32' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  transform: `translateY(${
                    0.03 * Math.max(0, scrollY - windowHeight)
                  }px)`,
                }}
                className="absolute inset-0 transition-transform duration-100"
              />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div
                className={`transition-all duration-1000 ${
                  projectsObserver.isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <h2 className="text-4xl font-bold text-[#1a1a1a] text-center mb-4">
                  The Art of the Address
                </h2>
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-1 bg-[#9acd32]" />
                </div>
                <div className="text-center text-gray-600 mb-12 max-w-3xl mx-auto space-y-4 text-base sm:text-lg leading-relaxed font-light">
                  <p>
                    True luxury is never loud. It is not declared through excess, but felt through intention—the grace of an unbroken sightline, the weight of hand-selected stone, the intuitive way morning light enters a private gallery.
                  </p>
                  <p>
                    At our core, we believe that an extraordinary residence is neither a commodity nor an exercise in scale. It is a singular work of art commissioned for a lifetime.
                  </p>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {siteData.projects.map((proj, idx) => (
                  <article
                    key={proj.title}
                    style={{
                      transitionDelay: `${200 + 100 * idx}ms`,
                      transitionDuration: '700ms',
                    }}
                    onClick={() => setSelectedProject(proj)}
                    className={`relative rounded-xl overflow-hidden shadow-xl group cursor-pointer transform hover:scale-[1.02] transition-all duration-500 border-2 border-transparent hover:border-[#9acd32] bg-gray-900 ${
                      projectsObserver.isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-16'
                    }`}
                  >
                    <div className="relative h-80 w-full overflow-hidden">
                      <Image
                        src={proj.src}
                        alt={proj.title}
                        fill
                        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/95 via-[#1a1a1a]/70 to-[#1a1a1a]/40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Card Hover Details */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500">
                      <h3 className="text-2xl font-bold text-white text-center mb-3">
                        {proj.title}
                      </h3>
                      <p className="text-sm text-gray-300 text-center leading-relaxed line-clamp-4">
                        {proj.description}
                      </p>
                      <button
                        type="button"
                        className="mt-6 px-6 py-2 bg-[#9acd32] text-[#1a1a1a] rounded-full font-bold hover:bg-[#b8e04a] transition-colors duration-300 shadow-lg"
                      >
                        View Details
                      </button>
                    </div>

                    {/* Card Bottom Banner (Visible on Desktop until hovered) */}
                    <div className="hidden md:block absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#1a1a1a]/90 to-transparent group-hover:opacity-0 transition-opacity duration-500">
                      <h4 className="text-xl font-bold text-white">
                        {proj.title}
                      </h4>
                      <div className="w-12 h-0.5 bg-[#9acd32] mt-2" />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* PROJECT DETAILS MODAL */}
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-scale"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative border-2 border-[#9acd32]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-72 w-full">
                <Image
                  src={selectedProject.src}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white p-2 rounded-full transition"
                  aria-label="Close modal"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-3xl font-bold text-gray-900">
                    {selectedProject.title}
                  </h3>
                  {selectedProject.status && (
                    <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-[#9acd32]/20 text-[#608020]">
                      {selectedProject.status}
                    </span>
                  )}
                </div>

                <div className="w-16 h-1 bg-[#9acd32] mb-4" />

                <p className="text-gray-700 leading-relaxed mb-6">
                  {selectedProject.description}
                </p>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
                  <div>
                    <span className="text-gray-500 font-semibold block">
                      Location:
                    </span>
                    <span className="text-gray-800 font-medium">
                      {selectedProject.location || 'Dhaka, Bangladesh'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-semibold block">
                      Size:
                    </span>
                    <span className="text-gray-800 font-medium">
                      {selectedProject.size || 'Custom Units'}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <a
                    href={`https://wa.me/${siteData.company.whatsapp.replace(
                      /[^0-9]/g,
                      ''
                    )}?text=Hello,%20I%20am%20interested%20in%20${encodeURIComponent(
                      selectedProject.title
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-[#9acd32] hover:bg-[#8bb82d] text-black font-bold rounded-lg transition"
                  >
                    Inquire on WhatsApp
                  </a>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OFFICE & CONTACT SECTION */}
        <section
          id="contact"
          ref={contactObserver.ref}
          className="py-20 bg-gray-50 scroll-mt-16 relative overflow-hidden"
        >
          <div
            style={{
              transform: `translateY(${
                0.08 * Math.max(0, scrollY - 1.8 * windowHeight)
              }px)`,
            }}
            className="absolute top-0 left-1/4 w-64 h-64 bg-[#9acd32]/10 rounded-full blur-3xl transition-transform duration-100"
          />
          <div
            style={{
              transform: `translateY(${
                -0.06 * Math.max(0, scrollY - 1.8 * windowHeight)
              }px)`,
            }}
            className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#9acd32]/10 rounded-full blur-2xl transition-transform duration-100"
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div
              className={`transition-all duration-1000 ${
                contactObserver.isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <h2 className="text-4xl font-bold text-center text-[#1a1a1a] mb-4">
                Visit Our Office
              </h2>
              <div className="flex justify-center mb-6">
                <div className="w-24 h-1 bg-[#9acd32]" />
              </div>
              <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                We&#39;re here to help you find your next investment or home
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Office Details Card */}
              <div
                style={{ transitionDelay: '200ms' }}
                className={`relative rounded-2xl shadow-xl overflow-hidden bg-white border-2 border-[#9acd32] p-8 flex flex-col justify-between transition-all duration-1000 ${
                  contactObserver.isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-12'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#9acd32]/20 flex items-center justify-center text-[#9acd32]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-bounce"
                      >
                        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#1a1a1a]">
                        {siteData.company.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Corporate Headquarters & Regional Branches
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 text-gray-700">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="font-bold text-gray-900 block mb-1">
                        📍 Dhaka Office:
                      </span>
                      <p className="text-gray-600">{siteData.company.dhakaOffice}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="font-bold text-gray-900 block mb-1">
                        📍 Chittagong Office:
                      </span>
                      <p className="text-gray-600">
                        {siteData.company.chittagongOffice}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="font-semibold block text-xs text-gray-500 uppercase">
                          Phone
                        </span>
                        <a
                          href={`tel:${siteData.company.phone}`}
                          className="text-[#1a1a1a] hover:text-[#9acd32] font-semibold"
                        >
                          {siteData.company.phone}
                        </a>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="font-semibold block text-xs text-gray-500 uppercase">
                          Email
                        </span>
                        <a
                          href={`mailto:${siteData.company.email}`}
                          className="text-[#1a1a1a] hover:text-[#9acd32] font-semibold text-xs truncate block"
                        >
                          {siteData.company.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100 flex gap-4">
                  <a
                    href={siteData.company.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-3 bg-[#9acd32] text-[#1a1a1a] rounded-xl font-bold hover:bg-[#b8e04a] transition-all shadow"
                  >
                    Get Directions
                  </a>
                  <a
                    href={`https://wa.me/${siteData.company.whatsapp.replace(
                      /[^0-9]/g,
                      ''
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-3 bg-[#1a1a1a] text-white rounded-xl font-bold hover:bg-black transition-all"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>

              {/* Inquiries & Feedback Contact Form */}
              <div
                style={{ transitionDelay: '350ms' }}
                className={`bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transition-all duration-1000 ${
                  contactObserver.isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-12'
                }`}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Send an Inquiry
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>

                {contactSubmitted ? (
                  <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      ✓
                    </div>
                    <h4 className="text-lg font-bold text-green-900">
                      Message Sent Successfully!
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                      Thank you for contacting Joldhara Properties Ltd.
                    </p>
                    <button
                      onClick={() => setContactSubmitted(false)}
                      className="mt-4 text-xs font-semibold text-green-800 underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setContactSubmitted(true);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mohammad Rahim"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#9acd32] focus:ring-2 focus:ring-[#9acd32]/30 transition"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+8801..."
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#9acd32] focus:ring-2 focus:ring-[#9acd32]/30 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="name@example.com"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#9acd32] focus:ring-2 focus:ring-[#9acd32]/30 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                        Message / Project of Interest
                      </label>
                      <textarea
                        rows="4"
                        required
                        placeholder="I would like more information about ALHAMDULILLAH project..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#9acd32] focus:ring-2 focus:ring-[#9acd32]/30 transition"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#9acd32] hover:bg-[#b8e04a] text-[#1a1a1a] font-bold rounded-lg transition-all duration-300 shadow-md"
                    >
                      Submit Inquiry
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#1a1a1a] text-white border-t-2 border-[#9acd32] relative overflow-hidden">
        <div
          style={{
            transform: `translateX(-50%) translateY(${
              0.03 * Math.max(0, scrollY - 2.5 * windowHeight)
            }px)`,
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#9acd32]/10 blur-3xl rounded-full transition-transform duration-100"
        />

        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#9acd32]">
                {siteData.company.name}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {siteData.company.aboutShort}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase text-[#9acd32] tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#home"
                    onClick={(e) => scrollToSection(e, '#home')}
                    className="text-sm text-gray-400 hover:text-[#9acd32] transition"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#projects"
                    onClick={(e) => scrollToSection(e, '#projects')}
                    className="text-sm text-gray-400 hover:text-[#9acd32] transition"
                  >
                    Properties
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    onClick={(e) => scrollToSection(e, '#contact')}
                    className="text-sm text-gray-400 hover:text-[#9acd32] transition"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase text-[#9acd32] tracking-wider mb-4">
                Contact
              </h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <span className="font-medium text-white">Dhaka Office:</span>{' '}
                  {siteData.company.dhakaOffice}
                </li>
                <li>
                  <span className="font-medium text-white">
                    Chittagong Office:
                  </span>{' '}
                  {siteData.company.chittagongOffice}
                </li>
                <li>
                  <span className="font-medium text-white">Phone:</span>{' '}
                  {siteData.company.phone}
                </li>
                <li>
                  <span className="font-medium text-white">Email:</span>{' '}
                  {siteData.company.email}
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase text-[#9acd32] tracking-wider mb-4">
                Follow Us
              </h4>
              <p className="text-sm text-gray-400 mb-4">
                Stay updated with our latest properties
              </p>
              <div className="flex space-x-4">
                <a
                  href={siteData.socialLinks.facebook}
                  aria-label="Facebook"
                  className="text-gray-400 hover:text-[#9acd32] transition transform hover:scale-110"
                >
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a
                  href={siteData.socialLinks.twitter}
                  aria-label="Twitter"
                  className="text-gray-400 hover:text-[#9acd32] transition transform hover:scale-110"
                >
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href={siteData.socialLinks.linkedin}
                  aria-label="LinkedIn"
                  className="text-gray-400 hover:text-[#9acd32] transition transform hover:scale-110"
                >
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <p className="text-center text-sm text-gray-400">
              © {new Date().getFullYear()} {siteData.company.name} All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href={siteData.socialLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20b858] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform transform hover:scale-110 group"
      >
        <span className="sr-only">Chat on WhatsApp</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.084.548 4.027 1.5 5.707L0 24l6.427-1.437A11.937 11.937 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.515 17.764c-.243.684-1.4 1.278-1.927 1.36-.513.08-1.14.115-4.061-1.224-3.44-1.608-5.664-5.555-5.825-5.84-.16-.284-1.333-1.72-1.333-3.285 0-1.566.836-2.337 1.13-2.658.293-.32.64-.404.85-.404.21 0 .425 0 .61.01.198.01.465-.075.71.56.243.635.828 2.198.9 2.36.074.16.12.36.024.574-.097.213-.14.345-.28.53-.14.184-.295.41-.423.55-.14.15-.285.32-.125.625.16.304.71 1.198.765 1.285.054.09.93 1.502 2.26 2.43 1.33.928 2.406 1.19 2.767 1.33.36.14.57.116.78-.07.21-.186.905-.983 1.145-1.333.24-.35.48-.29.81-.175.33.116 2.085.984 2.448 1.163.36.18.6.27.684.42.082.15.082.86-.16 1.544z" />
        </svg>
      </a>
    </div>
  );
}
