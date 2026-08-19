export default function PortfolioCard({ item }) {
  return (
    <article className={`portfolio-card ${item.size}`}>
      <a href="#contact" aria-label={`Enquire about ${item.title}`}>
        <div className="image-wrap">
          <img src={item.image} alt={`${item.title} ${item.category} project`} loading="lazy" />
          <div className="card-overlay"><span>View story</span><strong>{item.category}</strong></div>
          <span className="card-arrow">↗</span>
        </div>
        <div className="card-meta">
          <div><h3>{item.title}</h3><span>{item.category}</span></div>
          <span>{item.year}</span>
        </div>
      </a>
    </article>
  )
}
