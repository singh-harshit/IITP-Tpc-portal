import React from 'react'

export const Dropdown = props => {
    return (
        <option value={props.value}>{props.name}</option>
    )
}

export default Dropdown
