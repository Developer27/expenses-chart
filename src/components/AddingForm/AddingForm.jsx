/* eslint-disable react/prop-types */
import { useState } from 'react';
import './AddingForm.css'

export default function AddingForm(props) {
  const [value, setValue] = useState(0);

  function submitHandler(e) {
    e.preventDefault();
    props.setMyBalance(value);
  }
  return (
    <div className='adding-form-wrapper'>
      <form action="" className='adding-form' onSubmit={submitHandler}>
        <div className="add-my-balance">
          <label htmlFor="balance">Your balance:</label>
          <input type="text" placeholder='Type your balance' name='balance' id='balance' onChange={e => setValue(e.target.value)}/>
          <button>Add</button>
        </div>
      
      </form>
    </div>
  )
}
