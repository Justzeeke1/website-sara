import { initializeApp } from "firebase/app";
import { getFirestore, query, getDocs, collection, where, addDoc, onSnapshot, doc, setDoc } from "firebase/firestore";

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

export const fetchIllustrations = async () => {
  try {
    const userCollectionRef = collection(dbFirestore, "illustrazioni");
    const querySnapshot = await getDocs(userCollectionRef);

    const illustrations = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .sort((a, b) => a.id.localeCompare(b.id)); // Ordinamento per id

    return illustrations;
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
      .sort((a, b) => a.id.localeCompare(b.id)); // Ordinamento per id

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
      .sort((a, b) => a.id.localeCompare(b.id)); // Ordinamento per id

    return services;
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

