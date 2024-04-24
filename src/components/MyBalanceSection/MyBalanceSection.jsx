/* eslint-disable react/prop-types */
import './MyBalanceSection.css'

export default function MyBalanceSection({isAddingBalance, addBalance, balanceRef, myBalance, isBalanceExceeded, exceededRef}) {
  return (
    <div className="my-balance-wrapper">
    <div>
      <p className='my-balance__title'>
        My balance
        {isBalanceExceeded ? 
          <span ref={exceededRef} className='my-balance__exceeded'>You exceeded your balance!</span> 
          :
          ''
        }
      </p>
      {isAddingBalance ?
        <form className="adding-balance-wrapper" onSubmit={addBalance}>
          <input type="text"
            ref={balanceRef}
            className='adding-balance-inp'
            placeholder='Type your balance'
          />
          <button className='submit-balance'>Submit</button> 
        </form> 
        :
        <p className='my-balance__price'>₴{myBalance}</p>
      } 
    </div>
    <img src="/logo.svg" alt="balance-icon" className='my_balance__img' />
  </div>
  )
}
