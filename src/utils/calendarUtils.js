export const toLocalDate = (date) => new Date(`${date}T00:00:00`)

export const getExclusiveEndDate = (date) => {
  if (!date) return undefined

  const nextDay = toLocalDate(date)
  nextDay.setDate(nextDay.getDate() + 1)
  return nextDay.toISOString().slice(0, 10)
}

export const getReadableTextColor = (color = '') => {
  let hex = color.replace('#', '')
  if (hex.length === 3) {
    hex = hex.split('').map((character) => character + character).join('')
  }
  if (!/^[0-9a-f]{6}$/i.test(hex)) return '#ffffff'

  const red = Number.parseInt(hex.slice(0, 2), 16)
  const green = Number.parseInt(hex.slice(2, 4), 16)
  const blue = Number.parseInt(hex.slice(4, 6), 16)
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000

  return brightness > 160 ? '#111827' : '#ffffff'
}

export const formatTooltipDate = (date) =>
  new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
  }).format(toLocalDate(date))

export const normalizeCalendarEvents = ({
  events,
  games,
  selectedGames,
  selectedTypes,
}) => events
  .filter((event) =>
    selectedGames.includes(event.game) && selectedTypes.includes(event.type)
  )
  .map((event) => {
    const game = games.find((candidate) => candidate.name === event.game)

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
