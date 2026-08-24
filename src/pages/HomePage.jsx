import { useEffect, useState } from 'react'
import { FiArrowUpRight, FiMail } from 'react-icons/fi'
import { FaFacebookF, FaInstagram } from 'react-icons/fa6'
import { categories, portfolioItems, specialties } from '../data/portfolioData'
import PortfolioCard from '../components/PortfolioCard'
import SiteIntro from '../components/SiteIntro'

const instagramUrl = 'https://www.instagram.com/vijaysharmaphotography_?igsi=ZG92ZHF2cXR2NTE='
const facebookUrl = 'https://www.facebook.com/vijaysharmaphotography_/'
const enquiryEmail = 'vijaysharmaphotography@gmail.com'

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('All work')
  const [sent, setSent] = useState(false)
  const visibleItems = activeCategory === 'All work'
    ? portfolioItems
    : portfolioItems.filter((item) => item.category === activeCategory)

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

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const details = formData.get('details')
    const subject = encodeURIComponent('New photography enquiry')
    const body = encodeURIComponent(`Email: ${email}\n\nProject details:\n${details}`)
    window.location.href = `mailto:${enquiryEmail}?subject=${subject}&body=${body}`
    setSent(true)
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
        <div className="contact-form-wrap"><p>Tell me a little about what you are making. I would love to hear it.</p>{sent ? <div className="success-message">Your email draft is ready. Thank you.</div> : <form onSubmit={handleSubmit}><label>Your email<input name="email" required type="email" placeholder="you@example.com" /></label><label>Project details<textarea name="details" required rows="3" placeholder="A few words about the idea, date, and place..." /></label><button className="submit-button" type="submit">Send enquiry <FiArrowUpRight /></button></form>}</div>
      </section>
      <footer className="site-footer"><span>© 2025 Vijay Sharma Photography</span><span>Available worldwide</span><div className="social-links"><a href="#contact" aria-label="Email Vijay Sharma"><FiMail /> Email</a><a href={instagramUrl} aria-label="Open Vijay Sharma Photography on Instagram" target="_blank" rel="noreferrer"><FaInstagram /> Instagram</a><a href={facebookUrl} aria-label="Open Vijay Sharma Photography on Facebook" target="_blank" rel="noreferrer"><FaFacebookF /> Facebook</a></div></footer>
    </main>
  )
}
