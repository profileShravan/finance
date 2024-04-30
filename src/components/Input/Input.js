import React from 'react'
import "./styles.css"

function Input({label, inputvalue, setInputValue, placeholder, type}) {
  return (
    <div className='input-wrapper'>
        <p className='input-label'>{label}</p>
        <input
            value={inputvalue}
            type={type}
            placeholder={placeholder}
            onChange={(e)=>setInputValue(e.target.value)}
            className='custom-input'
        />

      
    </div>
  )
}

export default Input
