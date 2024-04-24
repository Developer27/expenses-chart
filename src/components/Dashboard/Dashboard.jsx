/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import './Dashboard.css';
import {db} from '../../firebase';
import {v4 as uuidv4} from 'uuid';
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import AddingForm from '../AddingForm/AddingForm';
import Header from '../Header/Header';
import MyBalanceSection from '../MyBalanceSection/MyBalanceSection';
import ColumnChart from '../ChartColumn/ColumnChart';


uuidv4();
const dbRef = doc(db, 'balance', 'b7NyfUtxKVfFDqXbV3RV');
const q = query(collection(db, 'balance'), orderBy('id'));

export default function Dashboard() {
  // const [columns, setColumns] = useState(Data);
  const [columns, setColumns] = useState([]);
  const [sum, setSum] = useState(0);
  const [total, setTotal] = useState(0);
  const [myBalance, setMyBalance] = useState(0);
  const [isBalanceExceeded, setIsBalanceExceeded] = useState(false);
  const [isAddingBalance, setIsAddingBalance] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const exceededRef = useRef(null);


  const openRef = useRef(null);
  const balanceRef = useRef(null);

  const days = [
    {short: 'sun', full: 'Sunday'},
    {short: 'mon', full: 'Monday'},
    {short: 'tue', full: 'Tuesday'},
    {short: 'wed', full: 'Wednesday'},
    {short: 'thu', full: 'Thursday'},
    {short: 'fri', full: 'Friday'},
    {short: 'sat', full: 'Saturday'}];
 
  const date = new Date().getDay();
  const today = days[date];

  // const pattern = '59 23 * * 0';
  // const pattern = '*/5 * * * *';

  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc =>  ({
        item: doc.data()
      }));
      setMyBalance(data[0].item.balance);
      setTotal(data[0].item.total);
      data.shift()
      setColumns(data);
      setIsLoading(false);
    })
  }, []);

  useEffect(() => {
    calcSum();
  }, [isLoading, columns])

  function showAmount(e) {
    columns.map(item =>  {
      if(item.item.day === `${e.target.nextSibling.innerText}`) {
        if(!item.show) {
          e.target.previousSibling.classList.add('show');
        } 
      }
    })
  }

  function hideAmount(e) {
    columns.map(item =>  {
      if(item.item.day === `${e.target.nextSibling.innerText}`) {
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
        if(item.item.day === `${e.target.nextSibling.innerHTML}`) {
          item.item.show = true;
        }
      })
    } else {
      e.target.previousSibling.classList.remove('show');
      e.target.children[0].innerText = 'false'
      columns.map(item =>  {
        if(item.item.day === `${e.target.nextSibling.innerHTML}`) {
          item.item.show = false;
        }  
      })
    }
  } 

  async function calcSum() {
    const spent = await columns.map(item => item.item.amount);
    let sum;
    if(spent.length) {
      sum = spent.reduce((accumulator, currentValue) =>  {
          return accumulator + currentValue;
        })
      setSum(sum);
    } else {
      setSum(0);
    }
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
    setIsAddingBalance(!isAddingBalance);
  }

  async function setSpending(day, newAmount) {
    await updateDoc(doc(db, "balance", day), {amount: newAmount});
  }

  async function updateBalance(newBalance) {
    updateDoc(dbRef,  {
      balance: newBalance
    })
    setMyBalance(newBalance);
  }

  async function updateTotal(newTotal) {
    updateDoc(dbRef,  {
      total: newTotal
    })
    setMyBalance(newTotal);
  }

  return (
    
    <div className='dashboard-wrapper'> 
   
      <div id="myModal" className="modal" ref={openRef}>
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <div className="add-balance-day">Today is: {today.full}</div>
            
          <AddingForm 
            setSpending={setSpending} 
            today={today.short} 
            closeModal={closeModal}
            updateBalance={updateBalance}
            myBalance={myBalance}
            total={total}
            updateTotal={updateTotal}
            setIsBalanceExceeded={setIsBalanceExceeded}
            isBalanceExceeded={isBalanceExceeded}
            exceededRef={exceededRef}
          />
        </div>
      </div>

      <div className='upper-wrapper'>
        <Header 
          showModal={showModal} 
          setIsAddingBalance={setIsAddingBalance} 
          isAddingBalance={isAddingBalance}
        /> 

        <MyBalanceSection 
          isAddingBalance={isAddingBalance}
          addBalance={addBalance}
          balanceRef={balanceRef}
          myBalance={myBalance}
          isBalanceExceeded={isBalanceExceeded}
          exceededRef={exceededRef}
        />
      </div>
      <section className='chart-section'>
        <div className="chart">
          <p className='chart-section__title'>
            Spending - Last 7 days
          </p>
          <div className="chart-columns">
          {sum === 0 ? 
            <div className='no-spendings'>{`You haven't spent anything this week!`}</div>
            : 
            columns.map((col, i) => {
              return <ColumnChart
                    key={i}
                    amount={col.item.amount}
                    day={col.item.day}
                    short={today.short}
                    show={col.item.show}
                    showAmount={showAmount}
                    hideAmount={hideAmount}
                    toggleAmount={toggleAmount}
                    />
            })}
          </div>
        </div>

        <div className="total-spendings">
          <div className='total-wrapper'>
            <p className='total-spendings__title'>Total this week</p>
            <p className='total-spendings__price'>₴{sum}</p>
          </div>
          <div className='percentage-wrapper'>
            <p className='total-spendings__title'>Total this month</p>
            <div className='total-spendings__price'>₴{total}</div>
          </div>
        </div>
      </section>   
    </div>
  )
}
