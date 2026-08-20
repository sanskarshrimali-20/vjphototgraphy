export default function PortfolioCard({ item }) {
  return (
    <article className={`portfolio-card ${item.size}`}>
      <a href="#contact" aria-label={`Enquire about ${item.title}`}>
        <div className="image-wrap">
          <img src={item.image} alt={`${item.title} ${item.category} project`} loading="lazy" />
          <span className="card-arrow">View story ↗</span>
        </div>
        <div className="card-meta">
          <span className="card-index">{item.year}</span>
          <div><h3>{item.title}</h3><span>{item.category}</span></div>
          <span className="card-type">Case study</span>
        </div>
      </a>
    </article>
  )
}
