import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { IoMenu, IoCalendarOutline } from 'react-icons/io5';
import Sidebar from './components/Sidebar';
import TimeSlotGrid from './components/TimeSlotGrid';
import BookingModal from './components/BookingModal';
import { ROOMS } from './data/mockData';
import { useBookings } from './hooks/useBookings';
import { useAuth } from './context/AuthContext';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(ROOMS['Block E'][0]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const { user, login } = useAuth();

  // Use custom hook for data
  const { bookings, loading, addBooking, cancelBooking } = useBookings(selectedDate, selectedRoom);

  const availableSlotsCount = 6 - bookings.length;

  // Handlers
  const handleBookSlot = async (slot) => {
    if (!user) {
      try {
        await login();
      } catch (error) {
        console.error("Login failed:", error);
      }
      return;
    }
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async (details) => {
    try {
      await addBooking({
        room: selectedRoom,
        date: selectedDate,
        slot: selectedSlot,
        userId: user.uid,
        ...details
      });
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!user) {
      alert("Please sign in to cancel a booking.");
      return;
    }
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId);
      } catch (err) {
        alert('Failed to cancel booking');
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-72 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          selectedRoom={selectedRoom} 
          onSelectRoom={(room) => {
            setSelectedRoom(room);
            setIsSidebarOpen(false);
          }} 
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 p-4 flex items-center justify-between z-10 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <IoMenu size={24} />
            </button>
            
            <div className="flex flex-col">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="hidden sm:inline text-gray-400 dark:text-gray-500 font-normal">Room</span>
                {selectedRoom}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${availableSlotsCount > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {loading ? 'Loading...' : `${availableSlotsCount} slots available`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-1.5 rounded-xl border border-gray-100 dark:border-gray-600 transition-colors duration-200">
            <div className="relative">
              <IoCalendarOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-transparent text-sm font-medium outline-none text-gray-700 dark:text-gray-200"
              />
            </div>
            <button 
              onClick={() => setSelectedDate(format(new Date(), 'yyyy-MM-dd'))}
              className="px-3 py-1.5 bg-white dark:bg-gray-600 shadow-sm rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-500 transition-all"
            >
              Today
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <TimeSlotGrid 
              room={selectedRoom}
              bookings={bookings}
              onBook={handleBookSlot}
              onCancel={handleCancelBooking}
              currentUser={user}
            />
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        room={selectedRoom}
        date={selectedDate}
        slot={selectedSlot}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
}

export default App;
