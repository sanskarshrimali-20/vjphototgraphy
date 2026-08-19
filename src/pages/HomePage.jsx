import { useEffect, useState } from 'react'
import { FiArrowUpRight, FiInstagram, FiMail } from 'react-icons/fi'
import { categories, portfolioItems, specialties } from '../data/portfolioData'
import PortfolioCard from '../components/PortfolioCard'
import SiteIntro from '../components/SiteIntro'

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
    setSent(true)
  }

  return (
    <main>
      <SiteIntro />
      <div className="visual-notes" aria-hidden="true"><div className="notes-track"><span>LOVE</span><i>✳</i><span>LAUGHTER</span><i>✳</i><span>LIGHT</span><i>✳</i><span>LOUD FAMILIES</span><i>✳</i><span>LOVE</span><i>✳</i><span>LAUGHTER</span><i>✳</i><span>LIGHT</span><i>✳</i></div></div>
      <section className="work-section reveal" id="work">
        <div className="section-heading"><span className="section-number">01 / 03</span><h2>Selected work</h2><p>Colourful celebrations, quiet glances, and journeys worth remembering.</p></div>
        <div className="filter-row" aria-label="Filter portfolio">
          {categories.map((category) => <button className={activeCategory === category ? 'filter active' : 'filter'} type="button" key={category} onClick={() => setActiveCategory(category)}>{category}</button>)}
        </div>
        <div className="portfolio-grid">{visibleItems.map((item) => <PortfolioCard item={item} key={item.title} />)}</div>
      </section>
      <section className="specialties-section reveal" aria-label="Photography specialties">
        <div className="specialties-intro"><span className="section-number">The good stuff</span><h2>Made for<br /><em>the moments.</em></h2></div>
        <div className="specialty-list">{specialties.map((specialty) => <div className="specialty-item" key={specialty.number}><span>{specialty.number}</span><div><h3>{specialty.title}</h3><p>{specialty.detail}</p></div><FiArrowUpRight /></div>)}</div>
      </section>
      <section className="about-section reveal" id="about">
        <span className="section-number">02 / 03</span>
        <div className="about-copy"><p className="large-copy">The best photographs feel like a memory you have not lived yet.</p><p>From a haldi ceremony in Jaipur to a pre-wedding afternoon in the hills, I look for the small shifts: a hand mid-gesture, a room held in golden hour, the quiet before someone becomes themselves.</p><a className="text-link" href="#contact">More about Vijay <FiArrowUpRight /></a></div>
        <div className="about-stat"><strong>12</strong><span>years making<br />pictures</span></div>
      </section>
      <section className="contact-section reveal" id="contact">
        <div className="contact-title"><span className="section-number">03 / 03</span><h2>Have a story<br /><em>in mind?</em></h2></div>
        <div className="contact-form-wrap"><p>Tell me a little about what you are making. I would love to hear it.</p>{sent ? <div className="success-message">Thank you. Your note is on its way.</div> : <form onSubmit={handleSubmit}><label>Your email<input required type="email" placeholder="you@example.com" /></label><label>Project details<textarea required rows="3" placeholder="A few words about the idea, date, and place..." /></label><button className="submit-button" type="submit">Send enquiry <FiArrowUpRight /></button></form>}</div>
      </section>
      <footer className="site-footer"><span>© 2025 Vijay Sharma Photography</span><span>Available worldwide</span><div><a href="#contact"><FiMail /> Email</a><a href="#top"><FiInstagram /> Instagram</a></div></footer>
    </main>
  )
}
