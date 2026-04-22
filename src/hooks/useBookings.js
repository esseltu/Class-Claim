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
  runTransaction,
  getDocs
} from 'firebase/firestore';
import { parse } from 'date-fns';

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
    try {
      // 1. Parse the new booking times using a fixed reference date for reliability
      const refDate = new Date(2000, 0, 1);
      const [newStartStr, newEndStr] = bookingDetails.slot.split(' - ');
      const newStart = parse(newStartStr.trim(), 'HH:mm', refDate);
      const newEnd = parse(newEndStr.trim(), 'HH:mm', refDate);

      // 2. Check for overlaps against CURRENT data from Firestore
      const q = query(
        collection(db, "bookings"),
        where("date", "==", bookingDetails.date),
        where("room", "==", bookingDetails.room)
      );
      
      const snapshot = await getDocs(q);
      const existingBookings = snapshot.docs.map(doc => doc.data());

      const overlap = existingBookings.find(b => {
        try {
          const [bStartStr, bEndStr] = b.slot.split(' - ');
          const bStart = parse(bStartStr.trim(), 'HH:mm', refDate);
          const bEnd = parse(bEndStr.trim(), 'HH:mm', refDate);

          // Overlap logic: (StartA < EndB) and (EndA > StartB)
          return (newStart < bEnd) && (newEnd > bStart);
        } catch {
          return false;
        }
      });

      if (overlap) {
        throw new Error(`This time overlaps with an existing booking: ${overlap.slot} (${overlap.courseCode})`);
      }

      // 3. If no overlap, proceed with deterministic ID booking
      const sanitizedSlot = bookingDetails.slot.replace(/[/\s:]/g, '_');
      const bookingId = `${bookingDetails.date}_${bookingDetails.room}_${sanitizedSlot}`;
      const bookingRef = doc(db, "bookings", bookingId);

      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(bookingRef);
        if (sfDoc.exists()) {
          throw new Error("This specific slot has already been booked!");
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
