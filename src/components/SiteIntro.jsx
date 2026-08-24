import { useEffect, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { portfolioItems } from '../data/portfolioData'

const introSlides = portfolioItems.slice(0, 5)

export default function SiteIntro() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState(null)

  useEffect(() => {
    if (isPaused) return undefined

    const timer = window.setInterval(() => {
      setActiveSlide((slide) => (slide + 1) % introSlides.length)
    }, 2000)

    return () => window.clearInterval(timer)
  }, [isPaused])

  function showSlide(index) {
    setActiveSlide((index + introSlides.length) % introSlides.length)
  }

  function handleTouchStart(event) {
    setTouchStart(event.touches[0].clientX)
  }

  function handleTouchEnd(event) {
    if (touchStart === null) return
    const distance = event.changedTouches[0].clientX - touchStart
    if (Math.abs(distance) > 45) showSlide(activeSlide + (distance < 0 ? 1 : -1))
    setTouchStart(null)
  }

  return (
    <section className="intro" id="top" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="intro-slides" aria-label="Featured photography">
        {introSlides.map((slide, index) => <img className={index === activeSlide ? 'intro-image is-active' : 'intro-image'} key={slide.title} src={slide.image} alt={`${slide.title} featured photograph`} />)}
      </div>
      <div className="intro-shade" aria-hidden="true" />
      <div className="intro-topline"><span>Vijay Sharma / Visual storyteller</span><span>India + worldwide</span></div>
      <div className="intro-content">
        <p className="intro-kicker">Wedding / Portrait / Travel</p>
        <h1>For the<br /><em>in-between.</em></h1>
        <p className="intro-summary">Photographs that hold onto the noise, the tenderness, and everything that happens between the big moments.</p>
        <a className="intro-cta" href="#work"><span>Enter the archive</span><span>↓</span></a>
      </div>
      <div className="intro-footer"><span>{String(activeSlide + 1).padStart(2, '0')}</span><span>Swipe to explore</span><span className="intro-line" /><div className="intro-controls"><button type="button" aria-label="Previous featured photograph" onClick={() => showSlide(activeSlide - 1)}><FiChevronLeft /></button><button type="button" aria-label="Next featured photograph" onClick={() => showSlide(activeSlide + 1)}><FiChevronRight /></button></div></div>
    </section>
  )
}
