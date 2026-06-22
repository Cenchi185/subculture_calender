import { useEffect, useLayoutEffect, useState } from 'react'
import { eventTypes } from './data/eventTypes'

import EventCalendar from './components/EventCalendar'
import EventSearch from './components/EventSearch'
import GameDrawer from './components/GameDrawer'
import Legend from './components/Legend'
import ActiveGameLegend from './components/ActiveGameLegend'
import ThemeButton from './components/ThemeButton'
import { gameColors } from './data/gameColors'
import { events } from './data/events'
import './App.css'

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [focusedEvent, setFocusedEvent] = useState(null)
  const [isGameDrawerOpen, setIsGameDrawerOpen] = useState(false)

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])
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
    setGames((currentGames) =>
      currentGames.map((game) =>
        game.name === gameName
          ? { ...game, color }
          : game
      )
    )
  }

  const focusSearchedEvent = (event) => {
    setSelectedGames((currentGames) =>
      currentGames.includes(event.game)
        ? currentGames
        : [...currentGames, event.game]
    )
    setSelectedTypes((currentTypes) =>
      currentTypes.includes(event.type)
        ? currentTypes
        : [...currentTypes, event.type]
    )
    setFocusedEvent({
      id: event.id,
      start: event.start,
      requestId: Date.now(),
    })
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-content">
          <div className="app-header-leading">
            <button
              type="button"
              className="hamburger-button"
              aria-label="게임 목록 열기"
              aria-expanded={isGameDrawerOpen}
              onClick={() => setIsGameDrawerOpen(true)}
            >
              <span />
              <span />
              <span />
            </button>

            <div className="app-title">
              <h1>서브컬쳐 이벤트 캘린더</h1>
              <p>게임별 이벤트 일정을 한눈에 확인하세요.</p>
            </div>
          </div>

          <div className="app-header-actions">
            <EventSearch events={events} onSelect={focusSearchedEvent} />
            <ThemeButton
              theme={theme}
              onToggle={() => setTheme((current) =>
                current === 'dark' ? 'light' : 'dark'
              )}
            />
          </div>
        </div>
      </header>

      <GameDrawer
        isOpen={isGameDrawerOpen}
        games={games}
        selectedGames={selectedGames}
        onToggleGame={toggleGame}
        onChangeGameColor={changeGameColor}
        onClose={() => setIsGameDrawerOpen(false)}
      />

      <main className="app-main">
        <section className="calendar-section">
          <Legend
            selectedTypes={selectedTypes}
            onToggleType={toggleType}
          />
          <ActiveGameLegend games={games} selectedGames={selectedGames} />
          <EventCalendar
            selectedGames={selectedGames}
            selectedTypes={selectedTypes}
            games={games}
            focusedEvent={focusedEvent}
          />
        </section>
      </main>
    </div>
  )
}

export default App
