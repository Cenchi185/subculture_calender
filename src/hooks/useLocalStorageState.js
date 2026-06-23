import { useEffect, useState } from 'react'

const resolveInitialValue = (initialValue) =>
  typeof initialValue === 'function' ? initialValue() : initialValue

export const STRING_STORAGE_OPTIONS = Object.freeze({
  serialize: String,
  deserialize: String,
})

export function useLocalStorageState(
  key,
  initialValue,
  {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = {}
) {
  const [value, setValue] = useState(() => {
    const fallbackValue = resolveInitialValue(initialValue)

    try {
      const savedValue = localStorage.getItem(key)
      return savedValue === null ? fallbackValue : deserialize(savedValue)
    } catch {
      localStorage.removeItem(key)
      return fallbackValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, serialize(value))
    } catch {
      // 저장 공간이 차거나 접근이 제한돼도 화면 기능은 계속 동작합니다.
    }
  }, [key, serialize, value])

  return [value, setValue]
}
