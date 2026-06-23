import { formatTooltipDate } from '../utils/calendarUtils'

function EventTooltip({ tooltip }) {
  if (!tooltip) return null

  const { event, left, top } = tooltip
  const { game, type, startDate, endDate } = event.extendedProps

  return (
    <div
      className="calendar-event-tooltip"
      role="tooltip"
      style={{ left, top }}
    >
      <strong>{game}</strong>
      <span>{type} · {event.title}</span>
      <small>
        {formatTooltipDate(startDate)} – {formatTooltipDate(endDate)}
      </small>
    </div>
  )
}

export default EventTooltip
