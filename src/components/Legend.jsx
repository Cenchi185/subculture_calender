import { eventTypes } from '../data/eventTypes'
import ToggleSwitch from './ToggleSwitch'

function Legend({
  games,
  selectedGames,
  selectedTypes,
  onToggleGame,
  onToggleType,
  onChangeGameColor,
}) {
  return (
    <div className="filter-panel">
      <div className="filter-group">
        <h3>게임</h3>

        <div className="legend">
          {games.map((game) => (
            <div key={game.name} className="legend-item">
              <div className="legend-info">
                <input
                  type="color"
                  value={game.color}
                  onChange={(e) =>
                    onChangeGameColor(game.name, e.target.value)
                  }
                  className="color-picker"
                />

                <span>{game.name}</span>
              </div>

              <ToggleSwitch
                checked={selectedGames.includes(game.name)}
                onChange={() => onToggleGame(game.name)}
                color={game.color}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h3>일정 종류</h3>

        <div className="legend">
          {eventTypes.map((type) => (
            <div key={type} className="legend-item">
              <span>{type}</span>

              <ToggleSwitch
                checked={selectedTypes.includes(type)}
                onChange={() => onToggleType(type)}
                color="#64748b"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Legend