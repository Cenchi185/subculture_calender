import { useEffect, useRef, useState } from 'react'
import ToggleSwitch from './ToggleSwitch'

const RECOMMENDED_COLORS = [
  '#4da3ff', '#7c6cf2', '#a855f7', '#ec4899',
  '#ff5c8a', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#06b6d4', '#64748b', '#ef4444',
]

function GameDrawer({ isOpen, games, selectedGames, onToggleGame, onChangeGameColor, onClose }) {
  const [paletteGame, setPaletteGame] = useState(null)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    const closeWithEscape = (keyEvent) => {
      if (keyEvent.key === 'Escape') onClose()
    }

    document.body.classList.add('drawer-open')
    document.addEventListener('keydown', closeWithEscape)
    closeButtonRef.current?.focus()

    return () => {
      document.body.classList.remove('drawer-open')
      document.removeEventListener('keydown', closeWithEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const closeDrawer = () => {
    setPaletteGame(null)
    onClose()
  }

  const selectColor = (gameName, color) => {
    onChangeGameColor(gameName, color)
    setPaletteGame(null)
  }

  return (
    <div className="game-drawer-layer">
      <button
        type="button"
        className="game-drawer-backdrop"
        aria-label="게임 목록 닫기"
        onClick={closeDrawer}
      />

      <aside
        className="game-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-drawer-title"
      >
        <header className="game-drawer-header">
          <div>
            <span className="game-drawer-eyebrow">CALENDAR FILTER</span>
            <h2 id="game-drawer-title">게임 목록</h2>
          </div>
          <button
            type="button"
            ref={closeButtonRef}
            className="game-drawer-close"
            aria-label="게임 목록 닫기"
            onClick={closeDrawer}
          >
            ×
          </button>
        </header>

        <p className="game-drawer-description">
          캘린더에 표시할 게임과 범례 색상을 설정하세요.
        </p>

        <div className="game-drawer-list">
          {games.map((game) => {
            const isSelected = selectedGames.includes(game.name)
            const isPaletteOpen = paletteGame === game.name

            return (
              <article className="game-card" key={game.name}>
                <div className="game-card-main">
                  <div className="game-icon" style={{ '--game-color': game.color }}>
                    {game.icon ? (
                      <img src={game.icon} alt="" />
                    ) : (
                      <span>{game.name.slice(0, 1)}</span>
                    )}
                  </div>

                  <div className="game-card-details">
                    <strong>{game.name}</strong>
                    <button
                      type="button"
                      className="game-color-button"
                      aria-expanded={isPaletteOpen}
                      onClick={() => setPaletteGame(isPaletteOpen ? null : game.name)}
                    >
                      <span style={{ backgroundColor: game.color }} />
                      범례 색상
                    </button>
                  </div>

                  <ToggleSwitch
                    checked={isSelected}
                    onChange={() => onToggleGame(game.name)}
                    color={game.color}
                    label={`${game.name} 일정 ${isSelected ? '숨기기' : '표시하기'}`}
                  />
                </div>

                {isPaletteOpen && (
                  <div className="game-color-panel">
                    <span className="game-color-panel-title">추천 색상</span>
                    <div className="recommended-colors">
                      {RECOMMENDED_COLORS.map((color) => (
                        <button
                          type="button"
                          key={color}
                          className={color === game.color ? 'is-selected' : ''}
                          style={{ backgroundColor: color }}
                          aria-label={`범례 색상을 ${color}로 설정`}
                          onClick={() => selectColor(game.name, color)}
                        >
                          {color === game.color && <span aria-hidden="true">✓</span>}
                        </button>
                      ))}
                    </div>

                    <label className="custom-color-button">
                      직접 색상 선택
                      <input
                        type="color"
                        value={game.color}
                        onChange={(changeEvent) =>
                          selectColor(game.name, changeEvent.target.value)
                        }
                      />
                    </label>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </aside>
    </div>
  )
}

export default GameDrawer
