import React from 'react'
import cardImage from '../../assists/credit-card.png'
import './styles.css'

function NoTransaction() {
  return (
    <div className='no-transaction'>
      <img src={cardImage}  />
      <p>You Have No Transaction Currently</p>
    </div>
  )
}

export default NoTransaction
