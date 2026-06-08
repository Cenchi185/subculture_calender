import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { events } from '../data/events'

function EventCalendar({ selectedGames, selectedTypes, games }) {
  const filteredEvents = events
    .filter((event) =>
      selectedGames.includes(event.game) &&
      selectedTypes.includes(event.type)
    )
    .map((event) => {
      const game = games.find((game) => game.name === event.game)

      return {
        ...event,
        title: `[${event.type}] ${event.title}`,
        backgroundColor: game?.color,
        borderColor: game?.color,
      }
    })

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      locale="ko"
      events={filteredEvents}
      height="auto"
    />
  )
}

export default EventCalendar