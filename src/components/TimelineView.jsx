import { useEffect, useRef } from 'react'

const toDate = (date) => new Date(`${date}T00:00:00`)

function TimelineView({
  visibleDate,
  events,
  games,
  selectedGames,
  highlightedEventId,
  onEventClick,
  onEventMouseEnter,
  onEventMouseLeave,
}) {
  const year = visibleDate.getFullYear()
  const scrollRef = useRef(null)
  const month = visibleDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthStart = new Date(year, month, 1)
  const monthEnd = new Date(year, month, daysInMonth)
  const today = new Date()
  const activeGames = games.filter((game) => selectedGames.includes(game.name))
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1)

  const monthEvents = events.filter((event) => {
    const start = toDate(event.extendedProps.startDate)
    const end = toDate(event.extendedProps.endDate)
    return start <= monthEnd && end >= monthStart
  })

  useEffect(() => {
    if (!highlightedEventId) return

    const scrollTimer = window.setTimeout(() => {
      scrollRef.current
        ?.querySelector(`[data-event-id="${highlightedEventId}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }, 0)

    return () => window.clearTimeout(scrollTimer)
  }, [highlightedEventId, visibleDate])

  return (
    <div className="timeline-view">
      <div className="timeline-scroll" ref={scrollRef}>
        <div
          className="timeline-table"
          style={{ minWidth: `${180 + daysInMonth * 34}px` }}
        >
          <div className="timeline-header-row">
            <div className="timeline-corner">게임</div>
            <div
              className="timeline-days"
              style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(34px, 1fr))` }}
            >
              {days.map((day) => {
                const date = new Date(year, month, day)
                const isWeekend = date.getDay() === 0 || date.getDay() === 6
                const isToday =
                  year === today.getFullYear() &&
                  month === today.getMonth() &&
                  day === today.getDate()

                return (
                  <div
                    key={day}
                    className={`${isWeekend ? 'is-weekend' : ''} ${isToday ? 'is-today' : ''}`}
                  >
                    <span>{day}</span>
                    <small>{['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}</small>
                  </div>
                )
              })}
            </div>
          </div>

          {activeGames.map((game) => {
            const gameEvents = monthEvents.filter(
              (event) => event.extendedProps.game === game.name
            )

            return (
              <div className="timeline-game-row" key={game.name}>
                <div className="timeline-game-label">
                  <span style={{ '--game-color': game.color }}>
                    {game.icon ? <img src={game.icon} alt="" /> : game.name.slice(0, 1)}
                  </span>
                  <strong>{game.name}</strong>
                </div>

                <div className="timeline-track">
                  {gameEvents.length > 0 ? (
                    gameEvents.map((event) => {
                      const originalStart = toDate(event.extendedProps.startDate)
                      const originalEnd = toDate(event.extendedProps.endDate)
                      const startDay = originalStart < monthStart ? 1 : originalStart.getDate()
                      const endDay = originalEnd > monthEnd ? daysInMonth : originalEnd.getDate()
                      const continuesBefore = originalStart < monthStart
                      const continuesAfter = originalEnd > monthEnd

                      return (
                        <div
                          className="timeline-lane"
                          key={event.id}
                          style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(34px, 1fr))` }}
                        >
                          <button
                            type="button"
                            data-event-id={event.id}
                            className={`timeline-event ${event.id === highlightedEventId ? 'timeline-event--highlighted' : ''}`}
                            style={{
                              gridColumn: `${startDay} / ${endDay + 1}`,
                              '--event-color': event.extendedProps.gameColor,
                              '--event-label-color': event.extendedProps.gameTextColor,
                            }}
                            onClick={() => onEventClick(event)}
                            onMouseEnter={(mouseEvent) => onEventMouseEnter(event, mouseEvent)}
                            onMouseLeave={onEventMouseLeave}
                          >
                            {continuesBefore && <span aria-hidden="true">‹</span>}
                            <small>{event.extendedProps.type}</small>
                            <strong>{event.title}</strong>
                            {continuesAfter && <span aria-hidden="true">›</span>}
                          </button>
                        </div>
                      )
                    })
                  ) : (
                    <div className="timeline-empty-lane">이달의 일정 없음</div>
                  )}
                </div>
              </div>
            )
          })}

          {activeGames.length === 0 && (
            <div className="timeline-no-games">표시할 게임을 선택해 주세요.</div>
          )}
        </div>
      </div>
      <p className="timeline-scroll-hint">가로로 스크롤해 월 전체 일정을 확인할 수 있습니다.</p>
    </div>
  )
}

export default TimelineView
