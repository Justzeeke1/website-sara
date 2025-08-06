import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express, { Request, Response } from "express";
import cors from "cors";

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// GET /items
app.get("/items", async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("items").get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Errore durante la lettura" });
  }
});

// POST /items
app.post("/items", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const ref = await db.collection("items").add(data);
    res.status(201).json({ id: ref.id });
  } catch (error) {
    res.status(500).json({ error: "Errore durante l'aggiunta" });
  }
});

// Esporta funzione cloud
export const api = functions.https.onRequest(app);
