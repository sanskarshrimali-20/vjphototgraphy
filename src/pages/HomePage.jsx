import { useEffect, useState } from 'react'
import { FiArrowUpRight, FiMail } from 'react-icons/fi'
import { FaFacebookF, FaInstagram } from 'react-icons/fa6'
import { categories, portfolioItems, specialties } from '../data/portfolioData'
import PortfolioCard from '../components/PortfolioCard'
import SiteIntro from '../components/SiteIntro'
import { supabase } from '../lib/supabase'

const instagramUrl = 'https://www.instagram.com/vijaysharmaphotography_?igsi=ZG92ZHF2cXR2NTE='
const facebookUrl = 'https://www.facebook.com/vijaysharmaphotography_/'
const enquiryEmail = 'sanskarsharma2012@gmail.com'

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('All work')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [detailLength, setDetailLength] = useState(0)
  const [galleryItems, setGalleryItems] = useState(() => (supabase ? [] : portfolioItems))
  const visibleItems = activeCategory === 'All work'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory)

  useEffect(() => {
    const revealItems = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })

    revealItems.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!supabase) return

    function loadGallery() {
      return supabase.from('gallery_items').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
      if (!error) setGalleryItems((data || []).map((item) => ({ ...item, image: item.image_url })))
      })
    }

    loadGallery()
    window.addEventListener('focus', loadGallery)
    return () => window.removeEventListener('focus', loadGallery)
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const details = formData.get('details')
    setSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${enquiryEmail}`, {
        body: JSON.stringify({ _subject: 'New photography enquiry', email, details }),
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        method: 'POST',
      })
      if (!response.ok) throw new Error('Unable to send enquiry')
      setSent(true)
    } catch {
      setSubmitError('Something went wrong. Please try again or email directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main>
      <SiteIntro />
      <section className="work-section reveal" id="work">
        <div className="work-heading"><div><span className="section-number">Selected archive / 2022—24</span><h2>Recent<br /><em>stories.</em></h2></div><p>Real people, honest colour, and the kind of frames that get better with time.</p></div>
        <div className="filter-row" aria-label="Filter portfolio"><span className="filter-label">Browse by</span>{categories.map((category) => <button className={activeCategory === category ? 'filter active' : 'filter'} type="button" key={category} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>
        <div className="portfolio-grid">{visibleItems.map((item) => <PortfolioCard item={item} key={item.title} />)}</div>
      </section>
      <section className="specialties-section reveal" aria-label="Photography specialties">
        <div className="specialties-intro"><span className="section-number">What I photograph</span><h2>Nothing<br /><em>staged.</em></h2><p>Every celebration has its own rhythm. My job is to notice it.</p></div>
        <div className="specialty-list">{specialties.map((specialty) => <div className="specialty-item" key={specialty.number}><span>{specialty.number}</span><div><h3>{specialty.title}</h3><p>{specialty.detail}</p></div><FiArrowUpRight /></div>)}</div>
      </section>
      <section className="about-section reveal" id="about">
        <div className="about-mark"><span>VS</span><small>About the studio</small></div>
        <div className="about-copy"><span className="section-number">A note from Vijay</span><p className="large-copy">The frame is only half the story. The rest is how it felt to be there.</p><p>From a haldi ceremony in Jaipur to a pre-wedding afternoon in the hills, I look for the small shifts: a hand mid-gesture, a room held in golden hour, the quiet before someone becomes themselves.</p><a className="text-link" href="#contact">More about Vijay <FiArrowUpRight /></a></div>
        <div className="about-stat"><strong>12</strong><span>years<br />behind the camera</span></div>
      </section>
      <section className="contact-section reveal" id="contact">
        <div className="contact-title"><span className="section-number">Start a conversation</span><h2>Bring the<br /><em>good stuff.</em></h2><p>Dates, places, wild ideas. Send them all.</p></div>
        <div className="contact-form-wrap"><p>Tell me a little about what you are making. I would love to hear it.</p>{sent ? <div className="success-message" role="status">Thank you. Your enquiry has been sent.</div> : <form onSubmit={handleSubmit}><label>Your email<input name="email" required type="email" placeholder="you@example.com" /></label><label>Project details<textarea name="details" required rows="3" maxLength="600" onInput={(event) => setDetailLength(event.currentTarget.value.length)} placeholder="A few words about the idea, date, and place..." /><span className="character-count" aria-live="polite">{detailLength} / 600</span></label>{submitError && <p className="submit-error" role="alert">{submitError}</p>}<button className="submit-button" disabled={submitting} type="submit">{submitting ? 'Sending...' : 'Send enquiry'} <FiArrowUpRight /></button></form>}</div>
      </section>
      <footer className="site-footer"><span>© 2025 Vijay Sharma Photography</span><span>Available worldwide</span><div className="social-links"><a href="#contact" aria-label="Email Vijay Sharma"><FiMail /> Email</a><a href={instagramUrl} aria-label="Open Vijay Sharma Photography on Instagram" target="_blank" rel="noreferrer"><FaInstagram /> Instagram</a><a href={facebookUrl} aria-label="Open Vijay Sharma Photography on Facebook" target="_blank" rel="noreferrer"><FaFacebookF /> Facebook</a></div></footer>
    </main>
  )
}
