import { useEffect, useRef, useState } from 'react'
import { RECOMMENDED_GAME_COLORS } from '../constants/recommendedColors'
import ToggleSwitch from './ToggleSwitch'

function GameDrawer({
  isOpen,
  games,
  selectedGames,
  onToggleGame,
  onChangeGameColor,
  onReorderGame,
  onClose,
}) {
  const [paletteGame, setPaletteGame] = useState(null)
  const [draggingGame, setDraggingGame] = useState(null)
  const [dragOverGame, setDragOverGame] = useState(null)
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

  const finishReorder = () => {
    setDraggingGame(null)
    setDragOverGame(null)
  }

  const dropGame = (targetGameName) => {
    if (draggingGame) onReorderGame(draggingGame, targetGameName)
    finishReorder()
  }

  const moveGameWithKeyboard = (gameName, direction) => {
    const currentIndex = games.findIndex((game) => game.name === gameName)
    const targetIndex = currentIndex + direction
    if (targetIndex < 0 || targetIndex >= games.length) return
    onReorderGame(gameName, games[targetIndex].name)
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
          캘린더에 표시할 게임과 범례 색상을 설정하세요. 손잡이를 드래그하면 순서를 바꿀 수 있습니다.
        </p>

        <div className="game-drawer-list">
          {games.map((game) => {
            const isSelected = selectedGames.includes(game.name)
            const isPaletteOpen = paletteGame === game.name

            return (
              <article
                className={`game-card ${draggingGame === game.name ? 'is-dragging' : ''} ${dragOverGame === game.name && draggingGame !== game.name ? 'is-drag-over' : ''}`}
                key={game.name}
                onDragOver={(dragEvent) => {
                  dragEvent.preventDefault()
                  dragEvent.dataTransfer.dropEffect = 'move'
                  setDragOverGame(game.name)
                }}
                onDrop={(dragEvent) => {
                  dragEvent.preventDefault()
                  dropGame(game.name)
                }}
              >
                <div className="game-card-main">
                  <span
                    className="game-drag-handle"
                    role="button"
                    tabIndex={0}
                    draggable="true"
                    aria-label={`${game.name} 순서 변경. 위아래 방향키로 이동할 수 있습니다.`}
                    title="드래그하여 순서 변경"
                    onDragStart={(dragEvent) => {
                      setDraggingGame(game.name)
                      dragEvent.dataTransfer.effectAllowed = 'move'
                      dragEvent.dataTransfer.setData('text/plain', game.name)
                    }}
                    onDragEnd={finishReorder}
                    onKeyDown={(keyEvent) => {
                      if (keyEvent.key === 'ArrowUp') {
                        keyEvent.preventDefault()
                        moveGameWithKeyboard(game.name, -1)
                      }
                      if (keyEvent.key === 'ArrowDown') {
                        keyEvent.preventDefault()
                        moveGameWithKeyboard(game.name, 1)
                      }
                    }}
                  >
                    ⠿
                  </span>

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
                      {RECOMMENDED_GAME_COLORS.map((color) => (
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
