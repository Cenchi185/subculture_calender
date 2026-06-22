function ToggleSwitch({ checked, onChange, color, label }) {
  return (
    <label
      className="toggle-switch"
      style={{ '--toggle-color': color }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={label}
      />
      <span className="toggle-slider"></span>
    </label>
  )
}

export default ToggleSwitch
