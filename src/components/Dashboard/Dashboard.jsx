/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import './Dashboard.css';
import {db} from '../../firebase';
import {v4 as uuidv4} from 'uuid';

import Data from 'C:/prog/expenses-chart/src/data.json';
import { collection, doc, getDoc, onSnapshot, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';


uuidv4();
const dbRef = doc(db, 'balance', 'b7NyfUtxKVfFDqXbV3RV');

export default function Dashboard() {
  const [columns, setColumns] = useState(Data);
  const [sum, setSum] = useState(0);
  const [isShownForm, setIsShownForm] = useState(false);
  const [myBalance, setMyBalance] = useState(0);
  const [isAddingBalance, setIsAddingBalance] = useState(false);


  const days = ['sun','mon','tues','wed','thrus','fri','sat'];
  const openRef = useRef(null);
  const balanceRef = useRef(null);
  const date = new Date().getDay();
  const today = days[date];



  // console.log(x.data().balance)


  useEffect(() => {
    async function getData() {
      const q = doc(db, 'balance', 'b7NyfUtxKVfFDqXbV3RV');
      const data = await getDoc(q);
      setMyBalance(data.data().balance)
    }
    getData();
  }, [isAddingBalance]);

  useEffect(() => {
    calcSum();
  }, [])

  function showAmount(e) {
    columns.map(item =>  {
      if(item.day === `${e.target.nextSibling.innerText}`) {
        if(!item.show) {
          e.target.previousSibling.classList.add('show');
        } 
      }
    })
  }

  function hideAmount(e) {
    columns.map(item =>  {
      if(item.day === `${e.target.nextSibling.innerText}`) {
        if(e.target.children[0].innerText === 'false') { 
          e.target.previousSibling.classList.remove('show');
        }
      }
    })  
  }

  function toggleAmount(e) {
    if(e.target.children[0].innerText === 'false') {
      e.target.previousSibling.classList.add('show');
      e.target.children[0].innerText = 'true'
      columns.map(item =>  {
        if(item.day === `${e.target.nextSibling.innerHTML}`) {
          
          item.show = true;
        }
      })
    } else {
      e.target.previousSibling.classList.remove('show');
      e.target.children[0].innerText = 'false'
      columns.map(item =>  {
        if(item.day === `${e.target.nextSibling.innerHTML}`) {
          
          item.show = false;
        }  
      })
    }
  } 

  function calcSum() {
    const spent = columns.map(item => item.amount);
    const sum = spent.reduce((aaccumulator, currentValue) =>  {
      return aaccumulator + currentValue;
    })
    setSum(sum);
  }
  
  function showModal() {
    openRef.current.style.display = 'flex';
  }

  function closeModal() {
    openRef.current.style.display = 'none';
  }

  function addBalance(e) {
    e.preventDefault();
    updateDoc(dbRef,  {
      balance: balanceRef.current.value
    })
    // setMyBalance(balanceRef.current.value);
    setIsAddingBalance(!isAddingBalance);

  }

  return (
    <div className='dashboard-wrapper'>
      
      {/* <div id="myModal" className="modal" ref={openRef}>
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <AddingForm setMyBalance={setMyBalance}/>
        </div>
      </div> */}

      <header className='header'> 
        <nav className='nav'>
          <button onClick={() => setIsAddingBalance(!isAddingBalance)} >Add balance</button>
        </nav>
      </header>
      {/* <AddingForm/> */}
      <div className="my-balance-wrapper">
        <div>
          <p className='my-balance__title'>My balance</p>
          {isAddingBalance ?
            <form className="adding-balance-wrappe" onSubmit={addBalance}>
              <input type="text"
                ref={balanceRef}
                className='adding-balance-inp'
                placeholder='Type your balance'
              />
              <button>Submit</button> 
            </form> 
            :
            <p className='my-balance__price'>${myBalance}</p>
          } 
        </div>
        <img src="src\assets\images\logo.svg" alt="balance-icon" className='my_balance__img' />
      </div>

      <section className='chart-section'>
        <div className="chart">
          <p className='chart-section__title'>
            Spending - Last 7 days
          </p>
          <div className="chart-columns">
            {columns.map((col, i) => {
              return <div key={i} className="col-wrapper" >
                  <div className='amount'>${col.amount}</div>
                  <div className={`dashboard-column ${col.day === today ? 'today' : ''}`} style={{height: `${col.amount}%`}}
                    onMouseOver={(e) => showAmount(e)}
                    onMouseOut={(e) => hideAmount(e)}
                    onClick={(e) => toggleAmount(e)}
                  >
                  <span>{`${col.show}`}</span>

                  </div>
                  <p className="chart-col-day">{col.day}</p>
              </div> 
            })}
          </div>
        </div>

        <div className="total-spendings">
          <div className='total-wrapper'>
            <p className='total-spendings__title'>Total this month</p>
            <p className='total-spendings__price'>${sum}</p>
          </div>
          <div className='percentage-wrapper'>
            <p className='pecentage-number'>+2.4%</p>
            <p className='percentage-text'>from last month</p>
          </div>
        </div>
      </section>
    </div>
  )
}
