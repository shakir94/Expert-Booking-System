import { useState, useEffect, useCallback } from 'react';
import ExpertCard from '../components/experts/ExpertCard';
import ExpertFilters from '../components/experts/ExpertFilters';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { getExperts } from '../services/api';
import './ExpertListPage.css';

export default function ExpertListPage() {
  const [experts, setExperts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => { setPage(1); }, [debouncedSearch, category]);

  const fetchExperts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getExperts({ page, limit: 6, search: debouncedSearch, category });
      setExperts(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category]);

  useEffect(() => { fetchExperts(); }, [fetchExperts]);

  return (
    <div className="list-page">
      <div className="list-hero">
        <h1 className="list-hero-title">Find Your Expert</h1>
        <p className="list-hero-sub">
          Book 1-on-1 sessions with top industry experts. Real-time availability guaranteed.
        </p>
      </div>

      <ExpertFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      {loading ? (
        <Loader text="Fetching experts..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchExperts} />
      ) : experts.length === 0 ? (
        <div className="list-empty">
          <div className="list-empty-icon">🔍</div>
          <h3 className="list-empty-title">No experts found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <p className="list-count">
            {pagination && `Showing ${experts.length} of ${pagination.totalExperts} experts`}
          </p>

          <div className="list-grid">
            {experts.map((expert) => (
              <ExpertCard key={expert._id} expert={expert} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={!pagination.hasPrev}
                className="page-btn"
              >
                ← Prev
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`page-num-btn${p === page ? ' active' : ''}`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNext}
                className="page-btn"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
