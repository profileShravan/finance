import React from 'react'
import "./styles.css"
import { Row ,Card } from 'antd'
import Button from '../Button/Button'

function Cards({resetBalance, showExpenseModal, showIncomeModal, income, expense, totalBalance}) {
  return (
    <>
      <Row className='my-row'>
        <Card  className='my-card'>
            <h2>Current Balance</h2>
            <p>₹{totalBalance}</p>
            <Button text="Reset Balance" blue={true} onClick={resetBalance} />
        </Card>

        <Card className='my-card'>
            <h2>Total Income</h2>
            <p>₹{income}</p>
            <Button text="Add Income" blue={true} onClick={showIncomeModal} />
        </Card>
        <Card className='my-card' >
            <h2>Total Expenses</h2>
            <p>₹{expense}</p>
            <Button text="Add Expenses" blue={true} onClick={showExpenseModal} />
        </Card>
      </Row>
    </>
  )
}

export default Cards
