/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import './AddingForm.css'

export default function AddingForm({myBalance, updateBalance, today, closeModal, setSpending, updateTotal, total, setIsBalanceExceeded, isBalanceExceeded, exceededRef}) {
  const [value, setValue] = useState(0);
 
  function submitHandler(e) {
    e.preventDefault();
    if(value >= myBalance) {
      console.log("NO MONEY")
      updateBalance(0);
      if(myBalance < value) {
        setIsBalanceExceeded(!isBalanceExceeded)
      }
      
    } else {
      updateBalance(myBalance-value);
      updateTotal(total + value);
    }
    setSpending(today, value);
    closeModal();
  }

  return (
      <form action="" className='adding-form' onSubmit={submitHandler}>
        <label htmlFor="balance">Your balance:</label>
        <input type="text" placeholder='Type your spending' 
          name='balance' 
          id='balance'
          className='adding-form-inp' 
          onChange={e => setValue(+e.target.value)}
        />
        <button className='adding-form-btn'>Add</button>
      </form>

  )
}
