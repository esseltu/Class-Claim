import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc,
  serverTimestamp,
  getDocs
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
    try {
      // Double check for conflicts before adding (optional but recommended)
      const q = query(
        collection(db, "bookings"),
        where("date", "==", bookingDetails.date),
        where("room", "==", bookingDetails.room),
        where("slot", "==", bookingDetails.slot)
      );
      
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        throw new Error("This slot has just been booked by someone else!");
      }

      await addDoc(collection(db, "bookings"), {
        ...bookingDetails,
        createdAt: serverTimestamp()
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
