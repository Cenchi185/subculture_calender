import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import CalendarEventCard from './CalendarEventCard'

function MonthCalendar({
  calendarRef,
  initialDate,
  events,
  highlightedEventId,
  onEventClick,
  onEventMouseEnter,
  onEventMouseLeave,
  onDateChange,
}) {
  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      initialDate={initialDate}
      headerToolbar={false}
      locale="ko"
      events={events}
      eventClick={({ event }) => onEventClick(event)}
      eventContent={({ event }) => <CalendarEventCard event={event} />}
      eventMouseEnter={({ event, jsEvent }) => onEventMouseEnter(event, jsEvent)}
      eventMouseLeave={onEventMouseLeave}
      eventDidMount={({ event, el }) => {
        el.setAttribute(
          'aria-label',
          `${event.extendedProps.game} ${event.extendedProps.type} ${event.title}`
        )
      }}
      eventClassNames={({ event }) => [
        'calendar-event',
        event.id === highlightedEventId ? 'calendar-event--highlighted' : '',
      ]}
      datesSet={({ view }) => onDateChange(view.currentStart)}
      height="auto"
    />
  )
}

export default MonthCalendar
