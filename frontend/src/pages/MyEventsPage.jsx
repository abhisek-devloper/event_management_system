import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import EventCard from '../components/EventCard';

export default function MyEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await eventsAPI.getMyEvents();
        setEvents(response.data);
      } catch (err) {
        setError('Failed to fetch your events');
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventsAPI.deleteEvent(id);
      setEvents(events.filter((event) => event.id !== id));
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  if (loading) {
    return <div className="loading container mx-auto py-8">Loading your events...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">My Events</h1>
        <Link to="/create-event" className="btn btn-primary">
          Create New Event
        </Link>
      </div>

      {error && <p className="error-text text-center mb-4">{error}</p>}

      {events.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg mb-4">You haven't created any events yet.</p>
          <Link to="/create-event" className="btn btn-primary inline-block">
            Create Your First Event
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="relative">
                <EventCard event={event} />
                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/events/${event.id}`}
                    className="btn btn-secondary flex-1 text-center text-sm"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="btn btn-danger px-4"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 card bg-blue-50 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Event Statistics</h3>
            <p className="text-blue-800">Total Events: <strong>{events.length}</strong></p>
            <p className="text-blue-800">Total Registrations: <strong>{events.reduce((acc, e) => acc + e.registration_count, 0)}</strong></p>
          </div>
        </>
      )}
    </div>
  );
}
