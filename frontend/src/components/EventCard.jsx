import { Link } from 'react-router-dom';

export default function EventCard({ event }) {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const eventTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="card group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full border dark:border-gray-700">
      {event.image ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 right-3">
             <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase">
               {event.type}
             </span>
          </div>
        </div>
      ) : (
        <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-4xl">📅</span>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-500 transition-colors">
          {event.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
          {event.description}
        </p>

        <div className="space-y-3 text-sm border-t dark:border-gray-700 pt-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <span>📅</span>
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <span>📍</span>
            <span className="truncate">{event.location || 'Location TBA'}</span>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <span className={`font-bold ${event.available_seats > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {event.available_seats > 0
                ? `${event.available_seats} seats left`
                : 'Sold Out'}
            </span>
          </div>
        </div>

        <Link
          to={`/events/${event.id}`}
          className="btn btn-primary w-full text-center mt-5 py-2.5 font-bold shadow-lg shadow-blue-500/20"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
