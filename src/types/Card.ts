import type { Timestamp } from "firebase/firestore"

export type Card = {
    id: string
    sentence: string
    word: string
    pronounce: string
    meaning: string
    translate: string
    successCount: number
    nextDate: Timestamp
    createdAt: string
    updatedAt: string
}
