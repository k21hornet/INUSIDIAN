import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BaseTemplate from '../components/templates/BaseTemplate'
import type { Deck } from '../types/Deck'
import type { Card } from '../types/Card'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useUser } from '../contexts/UserContext'

const DeckPage = () => {
  const [deck, setDeck] = useState<Deck>()
  const [cards, setCards] = useState<Card[]>([])
  const [deckName, setDeckName] = useState<string>("")
  const [deckDescription, setDeckDescription] = useState<string>("")

  const [showModal, setShowModal] = useState<boolean>(false)
  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)
  const [showModal2, setShowModal2] = useState<boolean>(false)
  const openModal2 = () => setShowModal2(true)
  const closeModal2 = () => setShowModal2(false)

  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useUser()

  // デッキを取得
  const fetchDeck = async () => {
    if(id) {
      try {
        const docRef = doc(db, "users", user.id, "decks", id)
        const docSnap = await getDoc(docRef)
  
        if (docSnap.exists()) {
          const data = {
            id: docSnap.id,
            ...docSnap.data()
          } as Deck
          setDeck(data)
          setDeckName(data.deckName)
          setDeckDescription(data.deckDescription)
          fetchCards(docSnap.id)
        } 
      } catch (e) {
        console.log(e)
      }
    }
  }

  // カード一覧を取得
  const fetchCards = async (docSnapId: string) => {
    try {
      const cardsRef = collection(db, "users", user.id, "decks", docSnapId, "cards")
      const snapshot = await getDocs(cardsRef)
      const c = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Card[]

      setCards(c)
    } catch (e) {
      console.log(e)
    }

  }

  // デッキ情報編集
  const editDeck = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const deck = {
      deckName,
      deckDescription
    }

    try {
      if(id) {
        const deckRef = doc(db, "users", user.id, "decks", id)
        await updateDoc(deckRef, deck)
        setDeckName("")
        setDeckDescription("")
        closeModal2()
        fetchDeck()
      } else {
        console.log("sss")
      }
    } catch (err) {
      console.log(err)
    }
  }

  const deleteDeck = async() => {
    const check = window.confirm("Are you sure?")
    if (!check) return

    if(id) {
      try {
        const cardRef = doc(db, "users", user.id, "decks", id)
        await deleteDoc(cardRef)
        navigate("/")
      } catch (e) {
        console.log(e)
      }
    }
  }

  // 新規カード作成
  const [sentence, setSentence] = useState<string>("")
  const [word, setWord] = useState<string>("")
  const [pronounce, setPronounce] = useState<string>("")
  const [meaning, setMeaning] = useState<string>("")
  const [translate, setTranslate] = useState<string>("")

  const createCard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      if(id) {
        const cardRef = collection(db, "users", user.id, "decks", id, "cards")
        await addDoc(cardRef, {
          sentence,
          word,
          pronounce,
          meaning,
          translate,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
  
        setSentence("")
        setWord("")
        setPronounce("")
        setMeaning("")
        setTranslate("")
        closeModal()
        fetchCards(id)
      }

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchDeck()
  },[])

  return (
    <BaseTemplate>

      <div className="flex flex-col items-center w-full max-w-5xl">
        <h1 className='text-3xl my-10'>{deck?.deckName}</h1>

        <ul 
          className="w-full divide-y divide-gray-100 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 300px)' }}
        >
          <li className="flex font-bold justify-between py-2 bg-white sticky top-0 z-10">
            <div className='w-2/12'>Word</div>
            <div className='w-8/12'>Sentence</div>
            <div className='w-2/12'>Created At</div>
          </li>

          {cards.map((card) => (
            <li className="flex justify-between py-2" onClick={() => navigate(`/deck/${deck?.id}/card/${card.id}`)} key={card.id}>
              <div className='w-2/12 line-clamp-1'>{card?.word}</div>
              <div className='w-8/12 line-clamp-1'>{card?.sentence}</div>
              <div className='w-2/12'></div>
            </li>
          ))}
        </ul>

        <div className='w-64 flex mt-5'>
          <button 
            onClick={openModal2} 
            className="m-1 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Edit Deck</button>
          <button 
            onClick={openModal} 
            className="m-1 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Create Card</button>
        </div>

      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className='text-xl font-semibold text-center mb-4'>Create new card</h3>

            <form onSubmit={createCard} className='space-y-6'>
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Sentence</label>
                <input
                  type="text"
                  name="sentence"
                  value={sentence}
                  onChange={(e) => setSentence(e.target.value)}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>

              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Word</label>
                <input
                  type="text"
                  name="word"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>

              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Pronounce</label>
                <input
                  type="text"
                  name="pronounce"
                  value={pronounce}
                  onChange={(e) => setPronounce(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>

              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Meaning</label>
                <input
                  type="text"
                  name="meaning"
                  value={meaning}
                  onChange={(e) => setMeaning(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>

              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Translate</label>
                <input
                  type="text"
                  name="translate"
                  value={translate}
                  onChange={(e) => setTranslate(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>

              <button 
                type="submit" 
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >Save</button>

            </form>

            <div className='text-end'>
              <span onClick={closeModal} style={{color: '#615fff'}}>Close</span>
            </div>

          </div>
        </div>
      )}

      {showModal2 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal2}
        >
          <div 
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className='text-xl font-semibold text-center mb-4'>Edit Deck</h3>

            <form onSubmit={editDeck} className='space-y-6'>
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Deck Name</label>
                <input
                  type="text"
                  name="deckName"
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>

              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Description</label>
                <textarea
                  name="deckDescription"
                  value={deckDescription}
                  onChange={(e) => setDeckDescription(e.target.value)}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>

              <button 
                type="submit" 
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >Save</button>

              <button 
                onClick={deleteDeck} 
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >Delete this deck</button>

            </form>

            <div className='text-end'>
              <span onClick={closeModal2} style={{color: '#615fff'}}>Close</span>
            </div>

          </div>
        </div>
      )}

    </BaseTemplate>
  )
}

export default DeckPage
