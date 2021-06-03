import { useRef } from 'react'

export default function useRenderCount() {
  const renderCount = useRef(0)
  renderCount.current += 1

  return (
    <input
      style={{
        borderRadius: 6,
        padding: 0,
        border: 0,
        height: 20,
        textAlign: 'center',
        width: 20,
      }}
      readOnly
      value={String(renderCount.current)}
    />
  )
}
