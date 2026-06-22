function ActiveGameLegend({ games, selectedGames }) {
  const activeGames = games.filter((game) => selectedGames.includes(game.name))

  return (
    <div className="active-game-legend" aria-label="표시 중인 게임 범례">
      <strong>표시 중인 게임</strong>
      <div className="active-game-list">
        {activeGames.length > 0 ? (
          activeGames.map((game) => (
            <div className="active-game-chip" key={game.name}>
              <span className="active-game-icon" style={{ '--game-color': game.color }}>
                {game.icon ? <img src={game.icon} alt="" /> : game.name.slice(0, 1)}
              </span>
              <span>{game.name}</span>
              <i style={{ backgroundColor: game.color }} aria-hidden="true" />
            </div>
          ))
        ) : (
          <span className="active-game-empty">표시 중인 게임이 없습니다.</span>
        )}
      </div>
    </div>
  )
}

export default ActiveGameLegend
