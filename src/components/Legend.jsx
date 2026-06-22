import { eventTypes } from '../data/eventTypes'
import ToggleSwitch from './ToggleSwitch'

function Legend({
  selectedTypes,
  onToggleType,
}) {
  return (
    <div className="event-type-filter" aria-label="일정 유형 필터">
      <strong>일정 유형</strong>
      <div className="event-type-list">
        {eventTypes.map((type) => (
          <div key={type} className="event-type-item">
            <span>{type}</span>
            <ToggleSwitch
              checked={selectedTypes.includes(type)}
              onChange={() => onToggleType(type)}
              color="var(--primary)"
              label={`${type} 일정 ${selectedTypes.includes(type) ? '숨기기' : '표시하기'}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Legend
