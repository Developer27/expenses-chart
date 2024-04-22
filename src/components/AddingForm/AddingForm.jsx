/* eslint-disable react/prop-types */
import { useState } from 'react';
import './AddingForm.css'

export default function AddingForm(props) {
  const [value, setValue] = useState(0);

  function submitHandler(e) {
    e.preventDefault();
    props.setSpending(props.today, value)
    props.closeModal();
  }

  return (
      <form action="" className='adding-form' onSubmit={submitHandler}>
        <label htmlFor="balance">Your balance:</label>
        <input type="text" placeholder='Type your balance' 
          name='balance' 
          id='balance'
          className='adding-form-inp' 
          onChange={e => setValue(+e.target.value)}
        />
        <button className='adding-form-btn'>Add</button>
      </form>

  )
}
