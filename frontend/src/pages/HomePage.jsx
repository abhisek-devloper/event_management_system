import { useState, useEffect } from 'react';
import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/EventCard';
import { eventsAPI } from '../services/api';

export default function HomePage() {
  const { events, loading, error, pagination, fetchEvents } = useEvents();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const params = {};
    if (filterType) params.type = filterType;
    fetchEvents(currentPage, params);
  }, [filterType, currentPage, fetchEvents]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchEvents(1);
      return;
    }

    try {
      const response = await eventsAPI.searchEvents(searchQuery);
      // Manually set events from search response
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Discover <span className="text-blue-500 dark:text-blue-400">Exciting</span> Events
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Find and register for workshops, conferences, and meetups happening in your area or online.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search events by title, description, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <button type="submit" className="btn btn-primary px-8">Search</button>
        </form>

        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Filter by:</span>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              className="input py-1.5"
            >
              <option value="">All Event Types</option>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="webinar">Webinar</option>
              <option value="meetup">Meetup</option>
              <option value="seminar">Seminar</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="loading dark:text-gray-400">Loading events...</div>
      ) : error ? (
        <div className="error-text text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-xl font-medium">No events found matching your criteria.</p>
          <button 
            onClick={() => {setFilterType(''); setSearchQuery(''); fetchEvents(1);}}
            className="mt-4 text-blue-500 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-6 py-8 border-t dark:border-gray-800">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={!pagination.previous}
              className="btn btn-secondary dark:bg-gray-700 dark:text-gray-200 px-6 disabled:opacity-50"
            >
              ← Previous
            </button>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Page <span className="text-blue-500">{currentPage}</span>
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!pagination.next}
              className="btn btn-secondary dark:bg-gray-700 dark:text-gray-200 px-6 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
