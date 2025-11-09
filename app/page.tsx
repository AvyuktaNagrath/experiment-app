'use client'

import { useState, useRef, useEffect } from 'react'

type Stage = 'intro' | 'familiarization' | 'test' | 'debrief' | 'complete'

interface ParticipantData {
  name: string
  age: string
  gender: string
  group: 'A' | 'B' | ''
}

export default function Home() {
  const [stage, setStage] = useState<Stage>('intro')
  const [participant, setParticipant] = useState<ParticipantData>({
    name: '',
    age: '',
    gender: '',
    group: ''
  })
  const [listeningTime, setListeningTime] = useState(0)
  const [comments, setComments] = useState('')
  const [startTime, setStartTime] = useState<number>(0)
  
  const familiarizationAudioRef = useRef<HTMLAudioElement>(null)
  const testAudioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '9' && stage === 'familiarization') {
        setStage('test')
        if (familiarizationAudioRef.current) {
          familiarizationAudioRef.current.pause()
        }
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [stage])

  const handleFamiliarizationEnd = () => {
    setStage('test')
  }

  const handleStartTest = () => {
    setStartTime(Date.now())
    testAudioRef.current?.play()
  }

  const handleStopTest = () => {
    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000
    setListeningTime(duration)
    testAudioRef.current?.pause()
    setStage('debrief')
  }

  const handleSubmit = async () => {
    const data = {
      name: participant.name,
      age: participant.age,
      gender: participant.gender,
      group: participant.group,
      listeningTime: listeningTime,
      comments: comments,
      timestamp: new Date().toISOString()
    }
    
    console.log('=== EXPERIMENT DATA ===')
    console.log('Name:', data.name)
    console.log('Age:', data.age)
    console.log('Gender:', data.gender)
    console.log('Group:', data.group)
    console.log('Listening Time (seconds):', data.listeningTime)
    console.log('Comments:', data.comments)
    console.log('Timestamp:', data.timestamp)
    console.log('=====================')
    
    setStage('complete')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b-2 border-black py-4 px-8">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Statistical Learning Experiment</h1>
            <p className="text-sm text-gray-700">PSYC 2760 - Replication of Saffran et al. (1996)</p>
          </div>
          <a 
            href="https://www.linkedin.com/in/avyukta-nagrath" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Connect With Me On LinkedIn!
          </a>
        </div>
      </header>

      <div className="flex-grow py-12 px-4">
        <div className="max-w-2xl mx-auto border-2 border-black rounded-lg p-8">
          
          {stage === 'intro' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4 text-black">Participant Information</h2>
              </div>
              <form className="space-y-6">
                <div>
                  <label className="block text-base font-semibold mb-2 text-black">Name</label>
                  <input
                    type="text"
                    value={participant.name}
                    onChange={(e) => setParticipant({...participant, name: e.target.value})}
                    className="w-full border-2 border-gray-800 rounded px-4 py-3 text-black text-base"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold mb-2 text-black">Age</label>
                  <input
                    type="number"
                    value={participant.age}
                    onChange={(e) => setParticipant({...participant, age: e.target.value})}
                    className="w-full border-2 border-gray-800 rounded px-4 py-3 text-black text-base"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold mb-2 text-black">Gender</label>
                  <select
                    value={participant.gender}
                    onChange={(e) => setParticipant({...participant, gender: e.target.value})}
                    className="w-full border-2 border-gray-800 rounded px-4 py-3 text-black text-base"
                  >
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-base font-semibold mb-2 text-black">Group (A or B)</label>
                  <select
                    value={participant.group}
                    onChange={(e) => setParticipant({...participant, group: e.target.value as 'A' | 'B'})}
                    className="w-full border-2 border-gray-800 rounded px-4 py-3 text-black text-base"
                  >
                    <option value="">Select...</option>
                    <option value="A">Group A</option>
                    <option value="B">Group B</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setStage('familiarization')}
                  disabled={!participant.name || !participant.age || !participant.gender || !participant.group}
                  className="w-full bg-black text-white py-4 rounded text-lg font-semibold disabled:bg-gray-400 hover:bg-gray-800"
                >
                  Continue
                </button>
              </form>
            </div>
          )}

          {stage === 'familiarization' && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6 text-black">Familiarization Phase</h2>
              <p className="mb-8 text-lg text-gray-800">
                Please listen to the following audio carefully. The audio will play automatically and you must listen to the entire sequence.
              </p>
              <audio
                ref={familiarizationAudioRef}
                src="/audio/familiarization.mp3"
                autoPlay
                onEnded={handleFamiliarizationEnd}
                className="w-full mb-4"
              />
              <p className="text-base text-gray-600">Audio is playing... Please wait until it finishes.</p>
            </div>
          )}

          {stage === 'test' && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6 text-black">Test Phase</h2>
              <p className="mb-8 text-lg text-gray-800">
                Click Start to begin listening. Press Stop whenever you feel like it.
              </p>
              <audio
                ref={testAudioRef}
                src={participant.group === 'A' ? '/audio/test_old.mp3' : '/audio/test_new.mp3'}
                loop
                className="hidden"
              />
              {startTime === 0 ? (
                <button
                  onClick={handleStartTest}
                  className="bg-green-600 text-white px-12 py-6 rounded-lg text-2xl font-bold hover:bg-green-700"
                >
                  Start
                </button>
              ) : (
                <button
                  onClick={handleStopTest}
                  className="bg-red-600 text-white px-12 py-6 rounded-lg text-2xl font-bold hover:bg-red-700"
                >
                  Stop
                </button>
              )}
            </div>
          )}

          {stage === 'debrief' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-black">Debrief</h2>
              <p className="mb-6 text-lg text-gray-800">
                Please answer the following questions about your experience:
              </p>
              <div className="space-y-6">
                <div>
                  <label className="block text-base font-semibold mb-3 text-black">
                    What patterns did you notice in the familiarization audio? Did you notice any repeating "words"? What comments do you have about the study?
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full border-2 border-gray-800 rounded px-4 py-3 h-40 text-black text-base"
                    placeholder="Type your response here..."
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-black text-white py-4 rounded text-lg font-semibold hover:bg-gray-800"
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {stage === 'complete' && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 text-black">Thank You!</h2>
              <p className="text-lg text-gray-800">Your responses have been recorded.</p>
            </div>
          )}
        </div>
      </div>

      <footer className="border-t-2 border-black py-6 px-8 mt-auto">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg font-semibold text-black mb-1">
            Thank you for participating! I appreciate you.
          </p>
          <p className="text-sm text-gray-700">
            — Avyukta Nagrath, PSYC 2760
          </p>
        </div>
      </footer>
    </div>
  )
}