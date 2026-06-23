import { useEffect, useRef, useState } from 'react'
import { STORAGE_KEYS } from '../constants/storageKeys'
import {
  STRING_STORAGE_OPTIONS,
  useLocalStorageState,
} from '../hooks/useLocalStorageState'
import { getEvents } from '../services/eventService'
import { normalizeCalendarEvents } from '../utils/calendarUtils'
import CalendarDatePicker from './CalendarDatePicker'
import EventModal from './EventModal'
import EventTooltip from './EventTooltip'
import MonthCalendar from './MonthCalendar'
import TimelineView from './TimelineView'

const events = getEvents()

function EventCalendar({ selectedGames, selectedTypes, games, focusedEvent }) {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [clearedHighlightRequestId, setClearedHighlightRequestId] = useState(null)
  const [visibleDate, setVisibleDate] = useState(() => new Date())
  const [eventTooltip, setEventTooltip] = useState(null)
  const [viewMode, setViewMode] = useLocalStorageState(
    STORAGE_KEYS.calendarViewMode,
    'month',
    STRING_STORAGE_OPTIONS
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

  const filteredEvents = normalizeCalendarEvents({
    events,
    games,
    selectedGames,
    selectedTypes,
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
            캘린더
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
          <MonthCalendar
            calendarRef={calendarRef}
            initialDate={visibleDate}
            events={filteredEvents}
            highlightedEventId={highlightedEventId}
            onEventClick={openEventModal}
            onEventMouseEnter={showEventTooltip}
            onEventMouseLeave={() => setEventTooltip(null)}
            onDateChange={setVisibleDate}
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

      <EventTooltip tooltip={eventTooltip} />
    </>
  )
}

export default EventCalendar
