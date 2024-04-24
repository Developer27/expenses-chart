/* eslint-disable no-unused-vars */
import { collection, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import './App.css'
import Dashboard from './components/Dashboard/Dashboard';
import { db } from './firebase';
import { Cron } from "croner";

const q = query(collection(db, 'balance'), orderBy('id'));
const dbRef = doc(db, 'balance', 'b7NyfUtxKVfFDqXbV3RV');

function App() {
  // const pattern = '* * * * *';
  const pattern = '59 23 * * 0';
  const resetWeek = Cron(pattern,async () => {
    console.log('Job is running...');
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc, i) => {
      if(doc.data().id != 0) {
        updateDoc(doc.ref, {amount: 0}).then(() => {
          console.log("Document successfully updated!");
      })
      .catch((error) => {
          console.error("Error updating document: ", error);
      });
    }
  });
});

const resetTotal = Cron(pattern,async () => {
  console.log('Job1 is running...');
  updateDoc(dbRef,  {
    total: 0
  })
});
  return (
    <div className='app-container'>
      <Dashboard/>
    </div>
  )
}

export default App
