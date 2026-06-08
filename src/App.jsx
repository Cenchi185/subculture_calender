import { useEffect, useState } from 'react'
import { eventTypes } from './data/eventTypes'

import EventCalendar from './components/EventCalendar'
import Legend from './components/Legend'
import { gameColors } from './data/gameColors'
import './App.css'

function App() {
  const [selectedGames, setSelectedGames] = useState(() => {
    const saved = localStorage.getItem('selectedGames')

    if (saved) {
      return JSON.parse(saved)
    }

    return gameColors.map((game) => game.name)
  })

  const [selectedTypes, setSelectedTypes] = useState(() => {
    const saved = localStorage.getItem('selectedTypes')

    if (saved) {
      return JSON.parse(saved)
    }

    return eventTypes
  })

  useEffect(() => {
    localStorage.setItem('selectedGames', JSON.stringify(selectedGames))
  }, [selectedGames])

  useEffect(() => {
    localStorage.setItem('selectedTypes', JSON.stringify(selectedTypes))
  }, [selectedTypes])

  const toggleGame = (gameName) => {
    if (selectedGames.includes(gameName)) {
      setSelectedGames(selectedGames.filter((name) => name !== gameName))
    } else {
      setSelectedGames([...selectedGames, gameName])
    }
  }

  const toggleType = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((item) => item !== type))
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
  }

  const [games, setGames] = useState(() => {
  const saved = localStorage.getItem('games')

  if (saved) {
    return JSON.parse(saved)
  }

  return gameColors
  })

  useEffect(() => {
    localStorage.setItem('games', JSON.stringify(games))
  }, [games])

  const changeGameColor = (gameName, color) => {
    setGames(
      games.map((game) =>
        game.name === gameName
          ? { ...game, color }
          : game
      )
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>서브컬쳐 이벤트 캘린더</h1>
        <p>게임별 이벤트 일정을 한눈에 확인하세요.</p>
      </header>

      <main className="app-main">
        <section className="legend-section">
          <h2>이벤트 범례</h2>
          <Legend
            games={games}
            selectedGames={selectedGames}
            selectedTypes={selectedTypes}
            onToggleGame={toggleGame}
            onToggleType={toggleType}
            onChangeGameColor={changeGameColor}
          />
        </section>

        <section className="calendar-section">
          <h2>이벤트 캘린더</h2>
          <EventCalendar
            selectedGames={selectedGames}
            selectedTypes={selectedTypes}
            games={games}
          />
        </section>
      </main>
    </div>
  )
}

export default App