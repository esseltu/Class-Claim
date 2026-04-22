import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoTimeOutline } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import { getRoomDisplayName } from '../data/mockData';

const BookingModal = ({ isOpen, onClose, onConfirm, slot, room, date }) => {
  const { user } = useAuth();
  const [courseCode, setCourseCode] = useState('');
  const [bookedBy, setBookedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      setBookedBy(user.displayName || '');
      // Initialize custom times from slot if available
      if (slot) {
        const [start, end] = slot.split(' - ');
        setStartTime(start || '');
        setEndTime(end || '');
      }
      setIsCustomTime(false);
    }
  }, [isOpen, user, slot]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isCustomTime) {
      if (!startTime || !endTime) {
        alert("Please select both start and end times.");
        return;
      }
      if (startTime >= endTime) {
        alert("End time must be after start time.");
        return;
      }
    }

    const finalSlot = isCustomTime ? `${startTime} - ${endTime}` : slot;
    onConfirm({ 
      courseCode, 
      bookedBy, 
      notes,
      slot: finalSlot, // Pass the potentially custom slot
      isCustom: isCustomTime
    });
    setCourseCode('');
    setBookedBy('');
    setNotes('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
        <Motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-white/20 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Book Room</h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400">
              <IoClose size={20} />
            </button>
          </div>
          
          <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="mb-6 text-sm text-gray-600 dark:text-gray-300 grid grid-cols-2 gap-2">
              <div><strong>Room:</strong> {getRoomDisplayName(room)}</div>
              <div><strong>Date:</strong> {date}</div>
              <div className="col-span-2">
                <strong>Default Slot:</strong> {slot}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Custom Time Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <IoTimeOutline className="text-red-500" />
                  Custom Time Slot
                </div>
                <button
                  type="button"
                  onClick={() => setIsCustomTime(!isCustomTime)}
                  className={`
                    w-10 h-5 rounded-full relative transition-colors duration-200
                    ${isCustomTime ? 'bg-red-600' : 'bg-gray-200'}
                  `}
                >
                  <div className={`
                    absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform duration-200
                    ${isCustomTime ? 'translate-x-5' : 'translate-x-0'}
                  `} />
                </button>
              </div>

              {isCustomTime && (
                <Motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid grid-cols-2 gap-4 pt-2"
                >
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Start Time</label>
                    <input
                      type="time"
                      required={isCustomTime}
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-red-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">End Time</label>
                    <input
                      type="time"
                      required={isCustomTime}
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-red-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <p className="col-span-2 text-[10px] text-gray-400 italic">
                    Note: Ensure your custom time doesn't overlap with existing bookings.
                  </p>
                </Motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Code</label>
                <input
                  type="text"
                  required
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g. COMM 101"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name / Initials</label>
                <input
                  type="text"
                  required
                  value={bookedBy}
                  onChange={(e) => setBookedBy(e.target.value)}
                  placeholder="e.g. JD - Course Rep"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional info..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none h-20"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-red-900/20 transition-all"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </Motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingModal;
