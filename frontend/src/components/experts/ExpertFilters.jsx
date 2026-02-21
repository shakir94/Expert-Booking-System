import './ExpertFilters.css';

const CATEGORIES = ['All', 'Technology', 'Finance', 'Healthcare', 'Business', 'Legal', 'Marketing'];

export default function ExpertFilters({ search, setSearch, category, setCategory }) {
  return (
    <div className="filters-wrap">
      <div className="filters-inner">
        <div className="filters-search-wrap">
          <span className="filters-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search experts by name or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="filters-search-input"
          />
        </div>
        <div className="filters-categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`filters-cat-btn${category === cat ? ' active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
