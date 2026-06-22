import { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { events } from '../data/events'
import CalendarDatePicker from './CalendarDatePicker'
import EventModal from './EventModal'
import TimelineView from './TimelineView'

const getExclusiveEndDate = (date) => {
  if (!date) return undefined

  const nextDay = new Date(`${date}T00:00:00`)
  nextDay.setDate(nextDay.getDate() + 1)

  return nextDay.toISOString().slice(0, 10)
}

const getReadableTextColor = (color = '') => {
  let hex = color.replace('#', '')
  if (hex.length === 3) hex = hex.split('').map((character) => character + character).join('')
  if (!/^[0-9a-f]{6}$/i.test(hex)) return '#ffffff'

  const red = Number.parseInt(hex.slice(0, 2), 16)
  const green = Number.parseInt(hex.slice(2, 4), 16)
  const blue = Number.parseInt(hex.slice(4, 6), 16)

  return (red * 299 + green * 587 + blue * 114) / 1000 > 160
    ? '#111827'
    : '#ffffff'
}

const formatTooltipDate = (date) =>
  new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${date}T00:00:00`))

function EventCalendar({ selectedGames, selectedTypes, games, focusedEvent }) {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [clearedHighlightRequestId, setClearedHighlightRequestId] = useState(null)
  const [visibleDate, setVisibleDate] = useState(() => new Date())
  const [eventTooltip, setEventTooltip] = useState(null)
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem('calendarViewMode') || 'month'
  )
  const calendarRef = useRef(null)
  const calendarContainerRef = useRef(null)

  const highlightedEventId =
    focusedEvent?.requestId !== clearedHighlightRequestId
      ? focusedEvent?.id
      : null

  useEffect(() => {
    if (!focusedEvent) return

    const focusDate = new Date(`${focusedEvent.start}T00:00:00`)
    const navigationTimer = window.setTimeout(() => {
      setVisibleDate(new Date(focusDate.getFullYear(), focusDate.getMonth(), 1))
      calendarRef.current?.getApi().gotoDate(focusDate)
    }, 0)

    calendarContainerRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })

    const highlightTimer = window.setTimeout(() => {
      setClearedHighlightRequestId(focusedEvent.requestId)
    }, 4000)

    return () => {
      window.clearTimeout(navigationTimer)
      window.clearTimeout(highlightTimer)
    }
  }, [focusedEvent])

  useEffect(() => {
    localStorage.setItem('calendarViewMode', viewMode)
  }, [viewMode])

  const openEventModal = (event) => {
    if (event.id === highlightedEventId) {
      setClearedHighlightRequestId(focusedEvent.requestId)
    }

    setEventTooltip(null)
    setSelectedEvent(event)
  }

  const showEventTooltip = (event, mouseEvent) => {
    const tooltipWidth = 270
    const left = Math.min(mouseEvent.clientX + 14, window.innerWidth - tooltipWidth - 12)
    const top = mouseEvent.clientY > window.innerHeight - 170
      ? mouseEvent.clientY - 135
      : mouseEvent.clientY + 14

    setEventTooltip({ event, left: Math.max(12, left), top: Math.max(12, top) })
  }

  const calendarApi = () => calendarRef.current?.getApi()

  const navigateToMonth = (year, month) => {
    const nextDate = new Date(year, month - 1, 1)
    setVisibleDate(nextDate)
    calendarApi()?.gotoDate(nextDate)
  }

  const moveMonth = (amount) => {
    const nextDate = new Date(
      visibleDate.getFullYear(),
      visibleDate.getMonth() + amount,
      1
    )
    navigateToMonth(nextDate.getFullYear(), nextDate.getMonth() + 1)
  }

  const moveToToday = () => {
    const today = new Date()
    navigateToMonth(today.getFullYear(), today.getMonth() + 1)
  }

  // TODO(backend): 2학기에는 events 더미 데이터 대신 이벤트 조회 API 응답을 사용합니다.
  const filteredEvents = events
    .filter((event) =>
      selectedGames.includes(event.game) &&
      selectedTypes.includes(event.type)
    )
    .map((event) => {
      const game = games.find((game) => game.name === event.game)

      return {
        ...event,
        title: event.title,
        end: getExclusiveEndDate(event.end),
        allDay: true,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        extendedProps: {
          game: event.game,
          type: event.type,
          description: event.description,
          link: event.link,
          location: event.location,
          startDate: event.start,
          endDate: event.end,
          gameColor: game?.color,
          gameIcon: game?.icon,
          gameTextColor: getReadableTextColor(game?.color),
        },
      }
    })

  return (
    <>
      <div ref={calendarContainerRef} className="calendar-container">
        <div className="calendar-view-switcher" aria-label="캘린더 보기 방식">
          <button
            type="button"
            className={viewMode === 'month' ? 'is-active' : ''}
            onClick={() => setViewMode('month')}
          >
            월간
          </button>
          <button
            type="button"
            className={viewMode === 'timeline' ? 'is-active' : ''}
            onClick={() => setViewMode('timeline')}
          >
            타임라인
          </button>
        </div>

        <CalendarDatePicker
          year={visibleDate.getFullYear()}
          month={visibleDate.getMonth() + 1}
          onNavigate={navigateToMonth}
          onPrevious={() => moveMonth(-1)}
          onToday={moveToToday}
          onNext={() => moveMonth(1)}
        />

        {viewMode === 'month' ? (
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            initialDate={visibleDate}
            headerToolbar={false}
            locale="ko"
            events={filteredEvents}
            eventClick={({ event }) => openEventModal(event)}
            eventContent={({ event }) => {
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
            }}
            eventMouseEnter={({ event, jsEvent }) => showEventTooltip(event, jsEvent)}
            eventMouseLeave={() => setEventTooltip(null)}
            eventDidMount={({ event, el }) => {
              el.setAttribute(
                'aria-label',
                `${event.extendedProps.game} ${event.extendedProps.type} ${event.title}`
              )
            }}
            eventClassNames={({ event }) => [
              'calendar-event',
              event.id === highlightedEventId
                ? 'calendar-event--highlighted'
                : '',
            ]}
            datesSet={({ view }) => setVisibleDate(view.currentStart)}
            height="auto"
          />
        ) : (
          <TimelineView
            visibleDate={visibleDate}
            events={filteredEvents}
            games={games}
            selectedGames={selectedGames}
            highlightedEventId={highlightedEventId}
            onEventClick={openEventModal}
            onEventMouseEnter={showEventTooltip}
            onEventMouseLeave={() => setEventTooltip(null)}
          />
        )}
      </div>

      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      {eventTooltip && (
        <div
          className="calendar-event-tooltip"
          role="tooltip"
          style={{ left: eventTooltip.left, top: eventTooltip.top }}
        >
          <strong>{eventTooltip.event.extendedProps.game}</strong>
          <span>{eventTooltip.event.extendedProps.type} · {eventTooltip.event.title}</span>
          <small>
            {formatTooltipDate(eventTooltip.event.extendedProps.startDate)}
            {' – '}
            {formatTooltipDate(eventTooltip.event.extendedProps.endDate)}
          </small>
        </div>
      )}
    </>
  )
}

export default EventCalendar
