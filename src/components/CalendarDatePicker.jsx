import { useEffect, useRef, useState } from 'react'

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1)
const YEAR_PAGE_SIZE = 12

function CalendarDatePicker({ year, month, onNavigate, onPrevious, onToday, onNext }) {
  const [pickerMode, setPickerMode] = useState(null)
  const [selectedYear, setSelectedYear] = useState(year)
  const [yearPageStart, setYearPageStart] = useState(year - 5)
  const pickerRef = useRef(null)

  useEffect(() => {
    const closePicker = (pointerEvent) => {
      if (!pickerRef.current?.contains(pointerEvent.target)) {
        setPickerMode(null)
      }
    }

    const closeWithEscape = (keyEvent) => {
      if (keyEvent.key === 'Escape') setPickerMode(null)
    }

    document.addEventListener('pointerdown', closePicker)
    document.addEventListener('keydown', closeWithEscape)

    return () => {
      document.removeEventListener('pointerdown', closePicker)
      document.removeEventListener('keydown', closeWithEscape)
    }
  }, [])

  const openYearPicker = () => {
    setSelectedYear(year)
    setYearPageStart(year - 5)
    setPickerMode('year')
  }

  const openMonthPicker = () => {
    setSelectedYear(year)
    setPickerMode('month')
  }

  const chooseYear = (nextYear) => {
    setSelectedYear(nextYear)
    setPickerMode('month')
  }

  const chooseMonth = (nextMonth) => {
    onNavigate(selectedYear, nextMonth)
    setPickerMode(null)
  }

  const years = Array.from(
    { length: YEAR_PAGE_SIZE },
    (_, index) => yearPageStart + index
  )

  return (
    <div className="calendar-toolbar">
      <div className="calendar-navigation" aria-label="캘린더 이동">
        <button type="button" onClick={onPrevious} aria-label="이전 달">‹</button>
        <button type="button" className="calendar-today-button" onClick={onToday}>오늘</button>
        <button type="button" onClick={onNext} aria-label="다음 달">›</button>
      </div>

      <div className="calendar-date-picker" ref={pickerRef}>
        <div className="calendar-date-title" aria-label={`${year}년 ${month}월`}>
          <button type="button" onClick={openYearPicker}>{year}년</button>
          <button type="button" onClick={openMonthPicker}>{month}월</button>
        </div>

        {pickerMode && (
          <div className="calendar-picker-popover">
            {pickerMode === 'year' ? (
              <>
                <div className="calendar-picker-heading">
                  <button
                    type="button"
                    aria-label="이전 연도 목록"
                    onClick={() => setYearPageStart((start) => start - YEAR_PAGE_SIZE)}
                  >
                    ‹
                  </button>
                  <strong>{yearPageStart}–{yearPageStart + YEAR_PAGE_SIZE - 1}</strong>
                  <button
                    type="button"
                    aria-label="다음 연도 목록"
                    onClick={() => setYearPageStart((start) => start + YEAR_PAGE_SIZE)}
                  >
                    ›
                  </button>
                </div>
                <div className="calendar-picker-grid calendar-year-grid">
                  {years.map((yearOption) => (
                    <button
                      type="button"
                      key={yearOption}
                      className={yearOption === year ? 'is-current' : ''}
                      onClick={() => chooseYear(yearOption)}
                    >
                      {yearOption}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="calendar-picker-heading calendar-month-heading">
                  <button type="button" onClick={() => setPickerMode('year')}>‹</button>
                  <strong>{selectedYear}년 · 월 선택</strong>
                  <span aria-hidden="true" />
                </div>
                <div className="calendar-picker-grid calendar-month-grid">
                  {MONTHS.map((monthOption) => (
                    <button
                      type="button"
                      key={monthOption}
                      className={
                        selectedYear === year && monthOption === month
                          ? 'is-current'
                          : ''
                      }
                      onClick={() => chooseMonth(monthOption)}
                    >
                      {monthOption}월
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="calendar-toolbar-spacer" aria-hidden="true" />
    </div>
  )
}

export default CalendarDatePicker
