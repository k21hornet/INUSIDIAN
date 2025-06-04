import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore"
import { db } from "../firebase"
import type { Deck } from "../types/Deck"
import type { Card } from "../types/Card"

/** Deck */

export const createDeck = async (uid: string, deckInput: string[]) => {
    const decksRef = collection(db, "users", uid, "decks")
    await addDoc(decksRef, {
        deckName: deckInput[0],
        deckDescription: deckInput[1],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })
}

export const getDeck = async (uid: string, did: string) => {
    const deckRef = doc(db, "users", uid, "decks", did)
    const docSnap = await getDoc(deckRef)
      
    if (docSnap.exists()) {
        return {
        id: docSnap.id,
        ...docSnap.data()
        } as Deck
    } 
}

export const getDecks = async (uid: string) => {
    const decksRef = collection(db, "users", uid, "decks")
    const snapshot = await getDocs(decksRef)
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Deck[]
}

export const updateDeck = async (uid: string, did: string, deckInput: string[]) => {
    const deckRef = doc(db, "users", uid, "decks", did)
    await updateDoc(deckRef, {
        deckName: deckInput[0],
        deckDescription: deckInput[1],
        updatedAt: serverTimestamp(),
    })
}

export const deleteDeck = async (uid: string, did: string) => {
    const deckRef = doc(db, "users", uid, "decks", did)
    await deleteDoc(deckRef)
}

/** Card */

export const createCard = async (uid: string, did: string, cardInput: string[]) => {
    const cardRef = collection(db, "users", uid, "decks", did, "cards")
    await addDoc(cardRef, {
        sentence: cardInput[0],
        word: cardInput[1],
        pronounce: cardInput[2],
        meaning: cardInput[3],
        translate: cardInput[4],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })
}

export const getCards = async (uid: string, did: string) => {
    const cardsRef = collection(db, "users", uid, "decks", did, "cards")
    const snapshot = await getDocs(cardsRef)
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Card[]
}

export const getCard = async (uid: string, did: string, cid: string) => {
    const cardRef = doc(db, "users", uid, "decks", did, "cards", cid)
    const docSnap = await getDoc(cardRef)
      
    if (docSnap.exists()) {
        return {
        id: docSnap.id,
        ...docSnap.data()
        } as Card
    } 
}

export const updateCard = async (uid: string, did: string, cid: string, cardInput: string[]) => {
    const cardRef = doc(db, "users", uid, "decks", did, "cards", cid)
    await updateDoc(cardRef, {
        sentence: cardInput[0],
        word: cardInput[1],
        pronounce: cardInput[2],
        meaning: cardInput[3],
        translate: cardInput[4],
        updatedAt: serverTimestamp(),
    })
}

export const deleteCard = async (uid: string, did: string, cid: string) => {
    const cardRef = doc(db, "users", uid, "decks", did, "cards", cid)
    await deleteDoc(cardRef)
}
