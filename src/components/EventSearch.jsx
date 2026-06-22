import { useMemo, useState } from 'react'

const formatShortDate = (date) =>
  new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${date}T00:00:00`))

function EventSearch({ events, onSelect }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const results = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase('ko-KR')
    if (!keyword) return []

    return events
      .filter((event) =>
        [event.title, event.game, event.type, event.description]
          .join(' ')
          .toLocaleLowerCase('ko-KR')
          .includes(keyword)
      )
      .slice(0, 6)
  }, [events, query])

  const selectEvent = (event) => {
    setQuery(event.title)
    setIsOpen(false)
    onSelect(event)
  }

  const handleSubmit = (submitEvent) => {
    submitEvent.preventDefault()
    if (results.length > 0) selectEvent(results[0])
  }

  const hasQuery = query.trim().length > 0

  return (
    <div className="event-search">
      <form className="event-search-form" role="search" onSubmit={handleSubmit}>
        <span className="event-search-icon" aria-hidden="true">⌕</span>
        <input
          type="search"
          value={query}
          placeholder="게임명 또는 이벤트를 검색하세요"
          aria-label="일정 검색"
          aria-expanded={isOpen && hasQuery}
          aria-controls="event-search-results"
          onFocus={() => setIsOpen(true)}
          onChange={(changeEvent) => {
            setQuery(changeEvent.target.value)
            setIsOpen(true)
          }}
          onKeyDown={(keyEvent) => {
            if (keyEvent.key === 'Escape') setIsOpen(false)
          }}
        />
      </form>

      {isOpen && hasQuery && (
        <div id="event-search-results" className="event-search-results">
          {results.length > 0 ? (
            results.map((event) => (
              <button
                type="button"
                className="event-search-result"
                key={event.id}
                onClick={() => selectEvent(event)}
              >
                <span className="event-search-result-icon" aria-hidden="true">↗</span>
                <span className="event-search-result-text">
                  <strong>{event.title}</strong>
                  <small>{event.game} · {event.type}</small>
                </span>
                <time dateTime={event.start}>{formatShortDate(event.start)}</time>
              </button>
            ))
          ) : (
            <p className="event-search-empty">검색 결과가 없습니다.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default EventSearch
