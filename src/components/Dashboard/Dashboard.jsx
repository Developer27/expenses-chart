/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import './Dashboard.css';
import {db} from '../../firebase';
import {v4 as uuidv4} from 'uuid';
import { Cron } from "croner";
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import AddingForm from '../AddingForm/AddingForm';
import Header from '../Header/Header';
import MyBalanceSection from '../MyBalanceSection/MyBalanceSection';
import { set } from 'firebase/database';

uuidv4();
const dbRef = doc(db, 'balance', 'b7NyfUtxKVfFDqXbV3RV');
const q = query(collection(db, 'balance'), orderBy('id'));

export default function Dashboard() {
  // const [columns, setColumns] = useState(Data);
  const [columns, setColumns] = useState([]);
  const [sum, setSum] = useState(200);
  const [isShownForm, setIsShownForm] = useState(false);
  const [myBalance, setMyBalance] = useState(0);
  const [isAddingBalance, setIsAddingBalance] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updatedSpending, setUpdatedSpending] = useState(0);
  const [total, setTotal] = useState(0);
  const openRef = useRef(null);
  const balanceRef = useRef(null);

  const days = ['sun','mon','tues','wed','thurs','fri','sat'];
  const days1 = [
    {short: 'sun', full: 'Sunday'},
    {short: 'mon', full: 'Monday'},
    {short: 'tue', full: 'Tuesday'},
    {short: 'wed', full: 'Wednesday'},
    {short: 'thurs', full: 'Thursday'},
    {short: 'fri', full: 'Friday'},
    {short: 'sat', full: 'Saturday'}];
 
  const date = new Date().getDay();
  const today = days1[date];


  // const pattern = '30,59 5,23 * * 6';
  const pattern = '*/5 * * * *';

  const job = Cron(pattern, async () => {
    console.log('Job is running...');
    resetDb();

    if(sum) {
      console.log('sum, total', sum, total);
      // setTotal(total+sum);
      // setSum(0);
    } 
  });
  
  // const nextTimes = Cron(pattern).nextRuns(1);

  // console.log('Next run times:', nextTimes.map(d => d.toLocaleTimeString()));

  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc =>  ({
        item: doc.data()
      }));
      setMyBalance(data[0].item.balance);
      data.shift()
      setColumns(data);
      setIsLoading(false);
    })
    console.log('1')
  }, []);

  // useEffect(() => {
  //   async function getData() {
  //     const data = await getDoc(dbRef);
  //     setMyBalance(data.data().balance)
  //   }
  //   getData();
  //   console.log('2')
  // }, [isAddingBalance]);
 
  useEffect(() => {
    calcSum();
    console.log('3')
  }, [isLoading, columns])

  // useEffect(() => {
  //   calcSum();
  //   console.log('3')
  // }, [isLoading, closeModal])



  async function resetDb() {
    const querySnapshot = await getDocs(q);
    const arr = [];
    querySnapshot.forEach((doc, i) => {
      arr.push(doc.data());
      if(doc.data().id != 0) {
        updateDoc(doc.ref, {amount: 0}).then(() => {
          console.log("Document successfully updated!");
      })
      .catch((error) => {
          console.error("Error updating document: ", error);
      });
    }
  });
 console.log(arr)
}


// async function resetDb() {
//   onSnapshot(q, (snapshot) => {
//     snapshot.docs.forEach((doc , i) => {
     
//         updateDoc(doc.ref, {amount: 0}).then(() => {
//           console.log("Document successfully updated!", i);
          
//       })
//       .catch((error) => {
//           console.error("Error updating document: ", error);
//       });
//     }
//     );
    
//   });
  
// //   querySnapshot.forEach((doc, i) => {
// //     if(doc.data().id != 0) {
// //       updateDoc(doc.ref, {amount: 0}).then(() => {
// //         console.log("Document successfully updated!");
// //     })
// //     .catch((error) => {
// //         console.error("Error updating document: ", error);
// //     });
// //   }
// // });

// }
// console.log('total', total)

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
    // if(sum) {
    //   setSum(sum);
    // }
    console.log(spent)
    // setSum(sum);
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

  return (
    
    <div className='dashboard-wrapper'> 
  
      <div id="myModal" className="modal" ref={openRef}>
        <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
          <div className="add-balance-day">Today is: {today.full}</div>
          
          <AddingForm setUpdatedSpending={setUpdatedSpending}
            setSpending={setSpending} 
            today={today.short} 
            closeModal={closeModal}
            updateBalance={updateBalance}
            myBalance={myBalance}
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
              return <div key={i} className="col-wrapper" >
                  <div className='amount'>₴{col.item.amount}</div>
                  <div className={`dashboard-column ${col.item.day === today.short ? 'today' : ''}`} style={{height: `${col.item.amount/20}%`}}
                    onMouseOver={(e) => showAmount(e)}
                    onMouseOut={(e) => hideAmount(e)}
                    onClick={(e) => toggleAmount(e)}
                  >
                    <span>{`${col.item.show}`}</span>

                  </div>
                  <p className="chart-col-day">{col.item.day}</p>
              </div> 
            })}
          </div>
        </div>

        <div className="total-spendings">
          <div className='total-wrapper'>
            <p className='total-spendings__title'>Total this week</p>
            <p className='total-spendings__price'>₴{sum}</p>
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