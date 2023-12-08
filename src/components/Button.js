import React from 'react'

const Button = ({
    label='Button',
    type='',
    className='',
    disabled=false,
}) => {
  return (
    <button type={type} disabled={disabled} className={`${className}`}>{label}</button>
  )
}

export default Button
