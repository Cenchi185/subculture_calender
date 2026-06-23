function CalendarEventCard({ event }) {
  const {
    game,
    type,
    gameColor,
    gameIcon,
    gameTextColor,
  } = event.extendedProps

  return (
    <div
      className="calendar-event-card"
      style={{
        '--event-color': gameColor,
        '--event-label-color': gameTextColor,
      }}
    >
      <div className="calendar-event-game">
        <span className="calendar-event-icon">
          {gameIcon ? <img src={gameIcon} alt="" /> : game.slice(0, 1)}
        </span>
        <span>{game}</span>
      </div>
      <div className="calendar-event-body">
        <small>{type}</small>
        <strong>{event.title}</strong>
      </div>
    </div>
  )
}

export default CalendarEventCard
