/* eslint-disable react/prop-types */
import './Header.css'

export default function Header({showModal, setIsAddingBalance, isAddingBalance}) {
  return (
    <header className='header'> 
      <nav className='nav'>
        <ul>
          <li> <button className='header__btn' onClick={() => setIsAddingBalance(!isAddingBalance)}>Add balance</button></li>
          <li> <button className='header__btn' onClick={showModal}>Add todays spendings</button></li>
        </ul>
      </nav>
    </header>
  )
}
