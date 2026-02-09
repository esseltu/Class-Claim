import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';

const BookingModal = ({ isOpen, onClose, onConfirm, slot, room, date }) => {
  const { user } = useAuth();
  const [courseCode, setCourseCode] = useState('');
  const [bookedBy, setBookedBy] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      setBookedBy(user.displayName || '');
    }
  }, [isOpen, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ courseCode, bookedBy, notes });
    setCourseCode('');
    setBookedBy('');
    setNotes('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-white/20 dark:border-gray-700"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Book Room</h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400">
              <IoClose size={20} />
            </button>
          </div>
          
          <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="mb-6 text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Room:</strong> {room}</p>
              <p><strong>Date:</strong> {date}</p>
              <p><strong>Time:</strong> {slot}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none h-24"
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingModal;
