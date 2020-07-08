import React from 'react'

export const CheckBox = props => {
    return (
      <div className="form-check">
        <label className="form-check-label">
          <input className="form-check-input" key={props.id} onClick={props.handleCheckChildElement} type="checkbox" checked={props.isChecked} value={props.value} /> {props.value}
        </label>
      </div>
    )
}

export default CheckBox
