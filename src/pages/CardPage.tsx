import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BaseTemplate from '../components/templates/BaseTemplate'
import type { Card } from '../types/Card'
import { useUser } from '../contexts/UserContext'
import { deleteCard, getCard, updateCard } from '../lib/firestore'

const CardPage = () => {
  const [card, setCard] = useState<Card>()

  const [sentence, setSentence] = useState<string>("")
  const [word, setWord] = useState<string>("")
  const [pronounce, setPronounce] = useState<string>("")
  const [meaning, setMeaning] = useState<string>("")
  const [translate, setTranslate] = useState<string>("")

  const { deckId, cardId } = useParams()
  const navigate = useNavigate()
  const { user } = useUser()

  const [showModal, setShowModal] = useState<boolean>(false)
  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)

  useEffect(() => {
    fetchCard()
  }, [])

  // カードを取得
  const fetchCard = async () => {
    if(user && deckId && cardId) {
      try {
        const c = await getCard(user?.id, deckId, cardId)
  
        if (c) {
          setCard(c)
          setSentence(c.sentence)
          setWord(c.word)
          setPronounce(c.pronounce)
          setMeaning(c.meaning)
          setTranslate(c.translate)
        } 
      } catch (e) {
        console.log(e)
      }
    }
  }

  // カード情報編集
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const cardInput = [
      sentence,
      word,
      pronounce,
      meaning,
      translate
    ]

    try {
      if(user && deckId && cardId) {
        await updateCard(user.id, deckId, cardId, cardInput)
        setSentence("")
        setWord("")
        setPronounce("")
        setMeaning("")
        setTranslate("")
        closeModal()
        fetchCard()
      } else {
        console.log("sss")
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete = async() => {
    const check = window.confirm("Are you sure?")
    if (!check) return

    if(user && deckId && cardId) {
      try {
        await deleteCard(user.id, deckId, cardId)
        navigate(`/deck/${deckId}`)
      } catch (e) {
        console.log(e)
      }
    }
  }

  return (
    <BaseTemplate>

      <div className="flex flex-col items-center w-full max-w-200">
        <h1 className='text-3xl my-10'>Card Details</h1>

        <ul className="w-full divide-y divide-gray-100 flex flex-col items-center">
          <li className="flex text-xl justify-between py-2 text-center">
            <div>{card?.sentence}</div>
          </li>
          <li className="flex text-xl justify-between py-2 text-center">
            <div>{card?.word}</div>
          </li>
          <li className="flex text-xl justify-between py-2 text-center mb-30">
            <div>{card?.pronounce}</div>
          </li>
          <li className="flex text-xl justify-between py-2 text-center">
            <div>{card?.meaning}</div>
          </li>
          <li className="flex text-xl italic justify-between py-2 text-center">
            <div>{card?.translate}</div>
          </li>
        </ul>

        <div className='w-64 flex mt-5'>
          <button 
            onClick={() => navigate(`/deck/${deckId}`)}
            className="m-1 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Back</button>
          <button 
            onClick={openModal} 
            className="m-1 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Edit</button>
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
            <h3 className='text-xl font-semibold text-center mb-4'>Edit card</h3>

            <form onSubmit={handleUpdate} className='space-y-6'>
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
                className="m-1 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >Save</button>

              <button 
                onClick={handleDelete} 
                className="m-1 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >Delete this card</button>

            </form>

            <div className='text-end'>
              <span onClick={closeModal} style={{color: '#615fff'}}>Close</span>
            </div>

          </div>
        </div>
      )}

    </BaseTemplate>
  )
}

export default CardPage
