import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc, 
  doc,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { format } from 'date-fns';

export const useBookings = (date, room) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    // Create query for bookings on specific date and room
    const q = query(
      collection(db, "bookings"),
      where("date", "==", date),
      where("room", "==", room)
    );

    // Listen for real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const bookingsData = [];
      querySnapshot.forEach((doc) => {
        bookingsData.push({ id: doc.id, ...doc.data() });
      });
      setBookings(bookingsData);
      setLoading(false);
    }, (err) => {
      // Ignore offline errors or permission errors during initial load
      if (err.code === 'failed-precondition' || err.code === 'unavailable') {
        console.log("Firestore offline/unavailable:", err.message);
      } else {
        console.error("Error fetching bookings:", err);
        setError(err);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [date, room]);

  const addBooking = async (bookingDetails) => {
    // Create a deterministic ID to prevent duplicates
    // Format: YYYY-MM-DD_Room_Slot (sanitize slot string)
    const sanitizedSlot = bookingDetails.slot.replace(/[\/\s:]/g, '_');
    const bookingId = `${bookingDetails.date}_${bookingDetails.room}_${sanitizedSlot}`;
    const bookingRef = doc(db, "bookings", bookingId);

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(bookingRef);
        if (sfDoc.exists()) {
          throw new Error("This slot has just been booked by someone else!");
        }

        transaction.set(bookingRef, {
          ...bookingDetails,
          createdAt: serverTimestamp()
        });
      });
      return true;
    } catch (err) {
      console.error("Error adding booking:", err);
      throw err;
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
      return true;
    } catch (err) {
      console.error("Error cancelling booking:", err);
      throw err;
    }
  };

  return { bookings, loading, error, addBooking, cancelBooking };
};
