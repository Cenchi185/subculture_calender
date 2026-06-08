function ToggleSwitch({ checked, onChange, color }) {
  return (
    <label
      className="toggle-switch"
      style={{ '--toggle-color': color }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span className="toggle-slider"></span>
    </label>
  )
}

export default ToggleSwitch