import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI, registrationsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventsAPI.getEventDetail(id);
        setEvent(response.data);
      } catch (err) {
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    const fetchParticipants = async () => {
      const isCreator = user && user.email === event?.created_by_email;
      if (isCreator) {
        setLoadingParticipants(true);
        try {
          const response = await eventsAPI.getEventRegistrations(id);
          setParticipants(response.data.registrations);
        } catch (err) {
          console.error('Failed to load participants', err);
        } finally {
          setLoadingParticipants(false);
        }
      }
    };

    if (event) {
      fetchParticipants();
    }
  }, [id, event, user]);

  // Check if user is already registered
  useEffect(() => {
    const checkUserRegistration = async () => {
      if (user && event) {
        try {
          const response = await registrationsAPI.checkRegistration(id, user.email);
          setIsRegistered(response.data.is_registered);
        } catch (err) {
          console.error('Failed to check registration status', err);
        }
      }
    };

    checkUserRegistration();
  }, [id, user, event]);

  // Set default email if user is logged in
  useEffect(() => {
    if (user && !formData.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
        name: user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.username
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegistering(true);
    setError(null);
    setSuccess(null);

    // Check if user is the creator
    if (event.created_by_email === formData.email) {
      setError('Creators cannot register for their own events');
      setRegistering(false);
      return;
    }

    try {
      // Check if already registered
      const checkResponse = await registrationsAPI.checkRegistration(id, formData.email);
      if (checkResponse.data.is_registered) {
        setError('This email is already registered for this event');
        setRegistering(false);
        return;
      }

      // Register for event
      await registrationsAPI.registerForEvent({
        event: id,
        ...formData,
      });

      setSuccess('Successfully registered for the event!');
      setFormData({ name: '', email: '', phone: '' });
      setShowRegistrationForm(false);

      // Refresh event data
      const updatedEvent = await eventsAPI.getEventDetail(id);
      setEvent(updatedEvent.data);

      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      const message = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Registration failed';
      setError(message);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return <div className="loading container mx-auto py-8 dark:text-gray-400">Loading event...</div>;
  }

  if (!event) {
    return (
      <div className="container mx-auto py-8">
        <p className="error-text text-center">{error || 'Event not found'}</p>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isCreator = user && user.email === event.created_by_email;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 mb-6 flex items-center gap-2"
      >
        <span>←</span> Back to Events
      </button>

      <div className="card max-w-4xl mx-auto overflow-hidden">
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
        )}

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-3">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </span>
              <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">📅 {formattedDate}</span>
              <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">📍 {event.location || 'Location TBA'}</span>
              <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">👤 By {event.created_by_username}</span>
            </div>
          </div>

          <div className="border-t dark:border-gray-700 pt-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">About This Event</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{event.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider font-semibold">Total Capacity</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{event.capacity} seats</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider font-semibold">Available Seats</p>
              <p className={`text-2xl font-bold ${event.available_seats > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {event.available_seats} seats
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider font-semibold">Registrations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{event.registration_count}</p>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 text-red-700 dark:text-red-300">{error}</div>}
          {success && <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 text-green-700 dark:text-green-300">{success}</div>}

          {/* Registration Section */}
          {isCreator ? (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                <p className="text-blue-800 dark:text-blue-300 font-semibold">You are the host of this event</p>
                <p className="text-blue-600 dark:text-blue-400 text-sm">Hosts cannot register for their own events.</p>
              </div>

              <div className="border-t dark:border-gray-700 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Registered Participants</h2>
                  <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium border dark:border-gray-700">
                    {participants.length} total
                  </span>
                </div>

                {loadingParticipants ? (
                  <div className="text-center py-8 text-gray-500">Loading participants...</div>
                ) : participants.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                          <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                          <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                          <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Phone</th>
                          <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Date Registered</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-700">
                        {participants.map((participant) => (
                          <tr key={participant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">{participant.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{participant.email}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{participant.phone || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-500">
                              {new Date(participant.registered_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">No participants have registered for this event yet.</p>
                  </div>
                )}
              </div>
            </div>
          ) : isRegistered ? (
            <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl border border-green-100 dark:border-green-800">
              <p className="text-green-800 dark:text-green-300 font-bold text-lg">You are registered! ✅</p>
              <p className="text-green-700 dark:text-green-400">You have successfully registered for this event. We look forward to seeing you there!</p>
            </div>
          ) : event.available_seats > 0 ? (
            <div className="space-y-4">
              <button
                onClick={() => setShowRegistrationForm(!showRegistrationForm)}
                className={`btn w-full py-3 text-lg ${showRegistrationForm ? 'btn-secondary' : 'btn-primary'}`}
              >
                {showRegistrationForm ? 'Cancel' : 'Register for this Event'}
              </button>

              {showRegistrationForm && (
                <form onSubmit={handleRegister} className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 rounded-xl shadow-sm space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Registration Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="input"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="input"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Your phone number"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={registering}
                    className="btn btn-primary w-full py-3 disabled:opacity-50 mt-2"
                  >
                    {registering ? 'Processing...' : 'Confirm Registration'}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-xl border border-red-100 dark:border-red-800">
              <p className="text-red-800 dark:text-red-300 font-bold text-lg">Event Fully Booked</p>
              <p className="text-red-700 dark:text-red-400">This event has reached its capacity. Please check back later if seats become available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
