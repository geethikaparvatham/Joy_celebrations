import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCXThlFXTKpDToWTxztzNV5Lc9zHaN0QVQ",
  authDomain: "joy-celebrations.firebaseapp.com",
  projectId: "joy-celebrations",
  storageBucket: "joy-celebrations.firebasestorage.app",
  messagingSenderId: "348331842498",
  appId: "1:348331842498:web:4f2e6ed175f3f1fcbfd45b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearAllBookings() {
  console.log("Connecting to Firestore...");
  
  try {
    const snapshot = await getDocs(collection(db, "bookings"));
    
    if (snapshot.empty) {
      console.log("✅ No bookings found in Firestore — already empty!");
      process.exit(0);
    }
    
    console.log(`Found ${snapshot.size} booking(s). Deleting all...`);
    
    const deletePromises = snapshot.docs.map(d => {
      console.log(`  Deleting: ${d.id} (${d.data().customerName || 'Unknown'})`);
      return deleteDoc(doc(db, "bookings", d.id));
    });
    
    await Promise.all(deletePromises);
    
    console.log(`\n✅ Successfully deleted ${snapshot.size} booking(s) from Firestore!`);
    console.log("   The admin dashboard will now show all zeros.");
  } catch (error) {
    console.error("❌ Error deleting bookings:", error);
  }
  
  process.exit(0);
}

clearAllBookings();
