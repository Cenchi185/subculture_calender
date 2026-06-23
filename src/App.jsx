import { useLayoutEffect, useState } from 'react'
import { eventTypes } from './data/eventTypes'

import EventCalendar from './components/EventCalendar'
import EventSearch from './components/EventSearch'
import GameDrawer from './components/GameDrawer'
import Legend from './components/Legend'
import ActiveGameLegend from './components/ActiveGameLegend'
import ThemeButton from './components/ThemeButton'
import { STORAGE_KEYS } from './constants/storageKeys'
import { gameColors } from './data/gameColors'
import {
  STRING_STORAGE_OPTIONS,
  useLocalStorageState,
} from './hooks/useLocalStorageState'
import { getEvents } from './services/eventService'
import './App.css'

const events = getEvents()
const gameStorageOptions = {
  serialize: JSON.stringify,
  deserialize: (savedValue) => {
    const savedGames = JSON.parse(savedValue)
    if (!Array.isArray(savedGames)) throw new TypeError('Invalid game settings')

    const mergedGames = savedGames
      .filter((savedGame) => gameColors.some((game) => game.name === savedGame.name))
      .map((savedGame) => {
        const defaultGame = gameColors.find((game) => game.name === savedGame.name)
        return { ...defaultGame, ...savedGame, icon: savedGame.icon || defaultGame.icon }
      })
    const newGames = gameColors.filter(
      (game) => !savedGames.some((savedGame) => savedGame.name === game.name)
    )

    return [...mergedGames, ...newGames]
  },
}

function App() {
  const [theme, setTheme] = useLocalStorageState(
    STORAGE_KEYS.theme,
    'dark',
    STRING_STORAGE_OPTIONS
  )
  const [focusedEvent, setFocusedEvent] = useState(null)
  const [isGameDrawerOpen, setIsGameDrawerOpen] = useState(false)

  const [selectedGames, setSelectedGames] = useLocalStorageState(
    STORAGE_KEYS.selectedGames,
    () => gameColors.map((game) => game.name)
  )
  const [selectedTypes, setSelectedTypes] = useLocalStorageState(
    STORAGE_KEYS.selectedTypes,
    eventTypes
  )
  const [games, setGames] = useLocalStorageState(
    STORAGE_KEYS.games,
    gameColors,
    gameStorageOptions
  )

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggleGame = (gameName) => {
    setSelectedGames((currentGames) =>
      currentGames.includes(gameName)
        ? currentGames.filter((name) => name !== gameName)
        : [...currentGames, gameName]
    )
  }

  const toggleType = (type) => {
    setSelectedTypes((currentTypes) =>
      currentTypes.includes(type)
        ? currentTypes.filter((item) => item !== type)
        : [...currentTypes, type]
    )
  }

  const changeGameColor = (gameName, color) => {
    setGames((currentGames) =>
      currentGames.map((game) =>
        game.name === gameName
          ? { ...game, color }
          : game
      )
    )
  }

  const reorderGame = (sourceGameName, targetGameName) => {
    if (sourceGameName === targetGameName) return

    setGames((currentGames) => {
      const sourceIndex = currentGames.findIndex((game) => game.name === sourceGameName)
      const targetIndex = currentGames.findIndex((game) => game.name === targetGameName)
      if (sourceIndex < 0 || targetIndex < 0) return currentGames

      const reorderedGames = [...currentGames]
      const [movedGame] = reorderedGames.splice(sourceIndex, 1)
      reorderedGames.splice(targetIndex, 0, movedGame)
      return reorderedGames
    })
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
        onReorderGame={reorderGame}
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
