import { initializeApp } from "firebase/app";
import { getFirestore, query, getDocs, collection, where, addDoc, onSnapshot, doc, setDoc, orderBy, deleteDoc, updateDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoiTgh7L5CNvZHpb-l8YbFRevy7aSQoLs",
  authDomain: "website-sara-843af.firebaseapp.com",
  projectId: "website-sara-843af",
  storageBucket: "website-sara-843af.firebasestorage.app",
  messagingSenderId: "401159970725",
  appId: "1:401159970725:web:238b391a2f2c76e2c3124c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const dbFirestore = getFirestore(app);
const auth = getAuth(app);

export const fetchIllustrations = async () => {
  try {
    const q = query(
      collection(dbFirestore, "illustrazioni"),
      orderBy("order", "asc") // oppure "desc" se vuoi invertire
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Errore durante il recupero dei dati:", error);
    return [];
  }
};


export const fetchKeychains = async () => {
  try {
    const userCollectionRef = collection(dbFirestore, "portachiavi");
    const querySnapshot = await getDocs(userCollectionRef);

    const keychains = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .sort((a, b) => a.id - b.id);

    return keychains;
  } catch (error) {
    console.error("Errore durante il recupero dei dati:", error);
    return [];
  }
};

export const fetchServices = async () => {
  try {
    const userCollectionRef = collection(dbFirestore, "servizi");
    const querySnapshot = await getDocs(userCollectionRef);

    const services = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .sort((a, b) => a.id - b.id);

    return services;
  } catch (error) {
    console.error("Errore durante il recupero dei dati:", error);
    return [];
  }
};

export const fetchCharms = async () => {
  try {
    const userCollectionRef = collection(dbFirestore, "charm");
    const querySnapshot = await getDocs(userCollectionRef);

    const keychains = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .sort((a, b) => a.id - b.id);

    return keychains;
  } catch (error) {
    console.error("Errore durante il recupero dei dati:", error);
    return [];
  }
};

export const fetchPins = async () => {
  try {
    const userCollectionRef = collection(dbFirestore, "spille");
    const querySnapshot = await getDocs(userCollectionRef);

    const keychains = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .sort((a, b) => a.id - b.id);

    return keychains;
  } catch (error) {
    console.error("Errore durante il recupero dei dati:", error);
    return [];
  }
};

export const fetchStickers = async () => {
  try {
    const userCollectionRef = collection(dbFirestore, "stickers");
    const querySnapshot = await getDocs(userCollectionRef);

    const keychains = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .sort((a, b) => a.id - b.id);

    return keychains;
  } catch (error) {
    console.error("Errore durante il recupero dei dati:", error);
    return [];
  }
};

// export const migrateIllustrazioni = async () => {
//   try {
//     const colRef = collection(dbFirestore, "illustrazioni");
//     const querySnapshot = await getDocs(colRef);

//     for (const document of querySnapshot.docs) {
//       const data = document.data();
//       const nuovoDoc = {};

//       Object.keys(data).forEach(key => {
//         if (["title", "description", "category"].includes(key)) {
//           nuovoDoc[key] = {
//             it: data[key],
//             en: key === "title" ? data[key] : ""
//           };
//         } else {
//           nuovoDoc[key] = data[key]; // Campo lasciato invariato
//         }
//       });

//       const docRef = doc(dbFirestore, "illustrazioni", document.id);
//       await setDoc(docRef, nuovoDoc);

//       console.log(`Aggiornato doc ${document.id}`);
//     }
//   } catch (error) {
//     console.error("Errore durante la migrazione:", error);
//   }
// };

// export const migratePortachiavi = async () => {
//   try {
//     const colRef = collection(dbFirestore, "portachiavi");
//     const querySnapshot = await getDocs(colRef);

//     for (const document of querySnapshot.docs) {
//       const data = document.data();
//       const nuovoDoc = {};

//       Object.keys(data).forEach(key => {
//         if (["title", "description"].includes(key)) {
//           nuovoDoc[key] = {
//             it: data[key],
//             en: key === "title" ? data[key] : ""
//           };
//         } else {
//           nuovoDoc[key] = data[key];
//         }
//       });

//       const docRef = doc(dbFirestore, "portachiavi", document.id);
//       await setDoc(docRef, nuovoDoc);

//       console.log(`Aggiornato doc ${document.id}`);
//     }
//   } catch (error) {
//     console.error("Errore durante la migrazione della collezione 'portachiavi':`, error");
//   }
// };


// export const migrateServizi = async () => {
//   try {
//     const colRef = collection(dbFirestore, "servizi");
//     const querySnapshot = await getDocs(colRef);

//     for (const document of querySnapshot.docs) {
//       const data = document.data();
//       const nuovoDoc = {};

//       for (const key of Object.keys(data)) {
//         if (key === "id") {
//           nuovoDoc[key] = data[key]; // Lascia invariato
//         } else if (Array.isArray(data[key])) {
//           // Campo array (es. features)
//           nuovoDoc[key] = {
//             it: data[key],
//             en: [] // Vuoto per la traduzione
//           };
//         } else {
//           // Campo stringa
//           nuovoDoc[key] = {
//             it: data[key],
//             en: "" // Traduzione da aggiungere manualmente
//           };
//         }
//       }

//       const docRef = doc(dbFirestore, "servizi", document.id);
//       await setDoc(docRef, nuovoDoc);

//       console.log(`Aggiornato doc ${document.id}`);
//     }
//   } catch (error) {
//     console.error("Errore durante la migrazione della collezione 'servizi':", error);
//   }
// };

// Admin Authentication Functions
export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logoutAdmin = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// CRUD Functions for Admin
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(dbFirestore, collectionName), data);
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(dbFirestore, collectionName, docId);
    await updateDoc(docRef, data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(dbFirestore, collectionName, docId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export { auth, dbFirestore };

