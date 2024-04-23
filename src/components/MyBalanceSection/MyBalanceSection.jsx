/* eslint-disable react/prop-types */
import './MyBalanceSection.css'

export default function MyBalanceSection({isAddingBalance, addBalance, balanceRef, myBalance}) {
  return (
    <div className="my-balance-wrapper">
    <div>
      <p className='my-balance__title'>My balance</p>
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
