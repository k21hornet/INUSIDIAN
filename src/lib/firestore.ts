import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, Timestamp, updateDoc, where } from "firebase/firestore"
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
        successCount: 0,
        nextDate: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })
}

export const getCards = async (uid: string, did: string) => {
    const cardsRef = collection(db, "users", uid, "decks", did, "cards")
    const q = query(cardsRef, orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
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

/** Due */
export const getDueCards = async (uid: string, did: string) => {
    // 今日の日付を0:00から23:59までの範囲で取得
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

    const startTimestamp = Timestamp.fromDate(startOfDay)
    const endTimestamp = Timestamp.fromDate(endOfDay)

    const cardsRef = collection(db, "users", uid, "decks", did, "cards")
    const q = query(cardsRef,
        where("nextDate", ">=", startTimestamp),
        where("nextDate", "<=", endTimestamp)
    )

    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Card[]
}

export const updateDueCard = async (uid: string, did: string, cid: string, count: number, date: Date) => {
    const cardRef = doc(db, "users", uid, "decks", did, "cards", cid)
    await updateDoc(cardRef, {
        successCount: count,
        nextDate: Timestamp.fromDate(date)
    })
}
