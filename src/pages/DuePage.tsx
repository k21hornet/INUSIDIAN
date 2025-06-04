import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BaseTemplate from '../components/templates/BaseTemplate'
import { useUser } from '../contexts/UserContext'
import { getDueCards, updateDueCard } from '../lib/firestore'
import type { Card } from '../types/Card'

const DuePage = () => {
  const [dueCard, setDueCard] = useState<Card | null>()
  const [cardCount, setCardCount] = useState<number>()

  const { user } = useUser()
  const { id } = useParams()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState<boolean>(true)
  const closeModal = () => setShowModal(false)

  // 正解表示を切り替え
  const [showAnswers, setShowAnswers] = useState(false)
  const toggleAnswers = () => setShowAnswers(prev => !prev)

  // 今日の単語リストを取得し、ランダムで一問出題する
  const fetchDue = async () => {
    if(user && id)
    try {
        const c = await getDueCards(user.id, id)
        const randomNum = Math.floor(Math.random() * c.length)
        setDueCard(c[randomNum])
        setCardCount(c.length)
    } catch (e) {
      console.log(e)
    }
  }

  // 問題正解時
  const success = async () => {
    if (!dueCard) return

    const now = new Date()
    const nextDate = new Date(now)
    nextDate.setDate(now.getDate() + dueCard.successCount*2 + 1) 
    const count = dueCard.successCount + 1

    if(user && id)
    try {
      await updateDueCard(user.id, id, dueCard.id, count, nextDate)
      await fetchDue()
      setShowAnswers(false)
    } catch (e) {
      console.log(e)      
    }
  }

  // 問題不正解時
  const failure = async () => {
    if (!dueCard) return
    
    const now = new Date()
    const count = 0

    if(user && id)
    try {
      await updateDueCard(user.id, id, dueCard.id, count, now)
      await fetchDue()
      setShowAnswers(false)
    } catch (e) {
      console.log(e)      
    }
  }

  useEffect(() => {
    fetchDue()
  },[])

  return (
    <BaseTemplate>

      <div className="flex flex-col items-center w-full max-w-200">
        <h1 className='text-3xl my-10'>Study Now</h1>

        <div className='w-full divide-y divide-gray-100 flex flex-col items-center'>
          {dueCard? (
            <>
              <p className="flex text-xl justify-between py-2 text-center">{dueCard?.sentence}</p>
              <p className="flex text-xl justify-between py-2 text-center">{dueCard?.word}</p>
              <p className="flex text-xl justify-between py-2 text-center mb-10">{dueCard?.pronounce}</p>

              <button
                onClick={toggleAnswers}
                className="flex items-center gap-2 text-indigo-600 font-semibold hover:underline"
              >
                Answer {showAnswers ? " - " : " + "}
              </button>

              {showAnswers && (
                <>
                  <p className="flex text-xl justify-between py-2 text-center">{dueCard?.meaning}</p>
                  <p className="flex text-xl justify-between py-2 text-center italic">{dueCard?.translate}</p>
                </>
              )}


              <div className='flex mt-8'>
                <div className='flex flex-col items-center m-1'>
                  <p className='text-gray-500'>0 day</p>
                  <button 
                    onClick={failure} 
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >Again</button>
                </div>
                
                <div className='flex flex-col items-center m-1'>
                  <p className='text-gray-500'>{dueCard?.successCount*2+1} day</p>
                  <button 
                    onClick={success} 
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >Easy</button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-4xl font-bold text-green-600">Congratulations!</h2>
              <p className="mt-2 text-xl text-gray-700">You have finished this deck for now.</p>
              <Link
                to={`/deck/${id}`}
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                Back to deck
              </Link>
            </div>
          )}
        </div>
      </div>

      {showModal && dueCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className='text-center text-2xl'>Are you ready? ({cardCount})</h3>
            <br />
            <div className='flex'>
              <button 
                onClick={() => navigate("/")} 
                type="submit" 
                className="m-1 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >Back</button>

              <button 
                onClick={closeModal} 
                type="submit" 
                className="m-1 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >Start</button>
            </div>
          </div>
        </div>

      )}

    </BaseTemplate>
  )
}

export default DuePage
