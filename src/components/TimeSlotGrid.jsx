import React from 'react';
import { motion as Motion } from 'framer-motion';
import { format, isBefore, parse } from 'date-fns';
import { TIME_SLOTS } from '../data/mockData';
import { IoTimeOutline, IoPersonOutline, IoBookOutline } from 'react-icons/io5';

const TimeSlotGrid = ({ room: _room, date, bookings, onBook, onCancel, currentUser }) => {
  const getBookingForSlot = (slot) => {
    // Check for exact matches first
    const exactMatch = bookings.find(b => b.slot === slot);
    if (exactMatch) return exactMatch;

    // Use a fixed date for all time comparisons to avoid timezone/DST issues
    const refDate = new Date(2000, 0, 1);

    // Check for overlaps with custom bookings
    const [slotStart, slotEnd] = slot.split(' - ');
    const sStart = parse(slotStart, 'HH:mm', refDate);
    const sEnd = parse(slotEnd, 'HH:mm', refDate);

    return bookings.find(b => {
      try {
        const [bStartStr, bEndStr] = b.slot.split(' - ');
        const bStart = parse(bStartStr.trim(), 'HH:mm', refDate);
        const bEnd = parse(bEndStr.trim(), 'HH:mm', refDate);

        // Overlap logic: (StartA < EndB) and (EndA > StartB)
        return (sStart < bEnd) && (sEnd > bStart);
      } catch {
        return false;
      }
    });
  };

  const isSlotExpired = (slot) => {
    try {
      if (date !== format(new Date(), 'yyyy-MM-dd')) return false;

      const endTimeStr = slot.split(' - ')[1].trim();
      // Use parse with a clean date string
      const slotEndTime = parse(`${date} ${endTimeStr}`, 'yyyy-MM-dd HH:mm', new Date());
      return isBefore(slotEndTime, new Date());
    } catch {
      return false;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {TIME_SLOTS.map((slot, index) => {
        const booking = getBookingForSlot(slot);
        const isBooked = !!booking;
        const expired = isSlotExpired(slot);
        const canCancel = isBooked && currentUser && booking.userId === currentUser.uid;

        // Don't show the slot if it's expired
        if (expired) return null;

        return (
          <Motion.div
            key={slot}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              relative p-4 rounded-2xl border transition-all duration-200
              ${isBooked 
                ? 'bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30' 
                : 'bg-white border-gray-100 hover:shadow-md hover:border-red-200 cursor-pointer group dark:bg-gray-800 dark:border-gray-700 dark:hover:border-red-500/30'
              }
            `}
            onClick={() => !isBooked && onBook(slot)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col">
                <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                  <IoTimeOutline className="mr-1" />
                  {slot}
                </div>
                {isBooked && booking.slot !== slot && (
                  <span className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                    <span className="h-1 w-1 rounded-full bg-red-500" />
                    Custom: {booking.slot}
                  </span>
                )}
              </div>
              {!isBooked && (
                <div className="h-2 w-2 rounded-full bg-gray-200 dark:bg-gray-600" />
              )}
            </div>

            {isBooked ? (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <IoBookOutline className="text-red-400" />
                  {booking.courseCode}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <IoPersonOutline />
                  <span>{booking.bookedBy}</span>
                </div>
                {booking.notes && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 italic mt-2 pl-2 border-l-2 border-red-100 dark:border-red-900/30">
                    "{booking.notes}"
                  </p>
                )}
                
                {canCancel && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancel(booking.id);
                    }}
                    className="mt-3 w-full py-1.5 px-3 bg-white border border-red-100 text-red-500 text-xs font-medium rounded-lg hover:bg-red-50 transition-colors dark:bg-gray-700 dark:border-red-900/30 dark:hover:bg-red-900/20"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ) : (
              <div className="py-4 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-gray-50 text-xs font-medium text-gray-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors dark:bg-gray-700 dark:text-gray-500 dark:group-hover:bg-red-900/20 dark:group-hover:text-red-400">
                  {currentUser ? 'Available' : 'Sign in to book'}
                </span>
              </div>
            )}
          </Motion.div>
        );
      })}
    </div>
  );
};

export default TimeSlotGrid;
