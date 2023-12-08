import React from 'react'

const Input = ({
  label='',
  name='',
  type='text',
  className='',
  inputclassName='',
  isRequired=true,
  placeholder='',
  value='',
  onChange=()=>{}
}) => {
  return (
    <div className={`${className}`}>
      <label for={name} className="block text-sm font-medium text-gray-800">{label}</label>
      <input type={type} id={name} placeholder={placeholder} className={`border bg-gray-50 border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:ring-blue-500 ${inputclassName}`} isRequired={isRequired} value={value} onChange={onChange}/>
    </div>
  )
}

export default Input
