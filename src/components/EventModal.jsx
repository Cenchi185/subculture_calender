import { useEffect } from 'react'
import './EventModal.css'

const formatDate = (date) => {
  if (!date) return '미정'

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(new Date(`${date}T00:00:00`))
}

function EventModal({ event, onClose }) {
  useEffect(() => {
    if (!event) return undefined

    const handleKeyDown = (keyEvent) => {
      if (keyEvent.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.classList.add('modal-open')

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('modal-open')
    }
  }, [event, onClose])

  if (!event) return null

  const { title, extendedProps } = event
  const gameColor = extendedProps.gameColor || event.backgroundColor
  const cleanTitle = title.replace(/^\[[^\]]+\]\s*/, '')

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="event-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
        onMouseDown={(mouseEvent) => mouseEvent.stopPropagation()}
      >
        <div className="modal-accent" style={{ backgroundColor: gameColor }} />

        <button
          type="button"
          className="modal-close-btn"
          style={{ '--modal-game-color': gameColor }}
          aria-label="이벤트 상세 닫기"
          onClick={onClose}
        >
          ×
        </button>

        <span className="modal-game" style={{ color: gameColor }}>
          {extendedProps.game}
        </span>
        <h2 id="event-modal-title">{cleanTitle}</h2>
        <span className="modal-type">{extendedProps.type}</span>

        <dl className="modal-info">
          <div>
            <dt>시작일</dt>
            <dd>{formatDate(extendedProps.startDate)}</dd>
          </div>
          <div>
            <dt>종료일</dt>
            <dd>{formatDate(extendedProps.endDate)}</dd>
          </div>
          {extendedProps.location && (
            <div className="modal-info-wide">
              <dt>행사 장소</dt>
              <dd>{extendedProps.location}</dd>
            </div>
          )}
        </dl>

        <p className="modal-description">{extendedProps.description}</p>

        {extendedProps.link && (
          <a
            className="modal-link"
            href={extendedProps.link}
            target="_blank"
            rel="noreferrer"
          >
            공식 공지 보러가기
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </section>
    </div>
  )
}

export default EventModal
