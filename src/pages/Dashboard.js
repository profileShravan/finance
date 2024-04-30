import React, { useEffect, useState } from 'react'
import Header from '../components/Header/Header'
import Cards from '../components/Cards/Cards'
import AddExpenseModal from '../components/Modals/addExpense';
import AddIncomeModal from '../components/Modals/addIncome'
import TransactionTable from '../components/TransactionTable/TransactionTable';
import { addDoc, collection, query, getDocs, writeBatch } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import Chart from '../components/Charts/Chart';
import NoTransaction from '../components/NoTransaction/NoTransaction';



function Dashboard() {
  const [isExpenseModalVisible , setIsExpenseModalVisible] = useState(false)
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([])
  const [loading , setLoading] = useState(true)

  const [income , setIncome] = useState(0);
  const [expense, setExpence] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0)

  const [user] =useAuthState(auth)


  const showExpenseModal = () =>{
    setIsExpenseModalVisible(true)
  }
  const showIncomeModal = ()=>{
    setIsIncomeModalVisible(true)
  }
  const handleExpenseCancel = ()=>{
    setIsExpenseModalVisible(false)
  }
  const handleIncomeCancel= ()=>{
    setIsIncomeModalVisible(false)
  }

  const onFinish = (values, type)=>{
    const newTransactions = {
      type:type,
      date: values.date.format("YYYY-MM-DD"),
      amount:parseFloat(values.amount),
      tag: values.tag,
      name:values.name,
      id: Date.now(),
    };
    addTransaction(newTransactions);
  }

  async function addTransaction(transaction, many){
    console.log(transaction);
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID:", docRef.id )
      if(!many)toast.success("Transaction Added!");
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
      
    } catch (error) {
      console.error("Error adding docement", error)
      if(!many)toast.error("Couldn't add transactions")
    }
    handleExpenseCancel();
    handleIncomeCancel();
  }

  useEffect(() => {
  }, [income, expense, totalBalance]);
  

  useEffect(()=>{
    fetchTransaction();
  },[user])

  useEffect(()=>{
    calculateBalance();
  },[transactions]);

  const calculateBalance = () =>{
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((transaction)=>{
      if(transaction.type === "income"){
        incomeTotal += transaction.amount;
      }
      else{
        expenseTotal += transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpence(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal)
  }

  async function fetchTransaction(){
    setLoading(true);
    if(user){
      const q = query(collection(db, `users/${user.uid}/transactions` ));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      // console.log("Transection",transactionsArray)
      // toast.success("Transection Fetched!")
    }
    setLoading(false)
  }
  
  let sortedTransactions = transactions.sort((a , b )=> {
    return new Date(a.date) - new Date(b.date)
  })
  
  
  const resetBalance = async () => {
    try {
      if (!user) {
        toast.error("No user signed in.");
        return;
      }
  
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);
  
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
  
      await batch.commit();
      setTransactions([]);
      toast.success("Transactions Reset!");
    } catch (error) {
      console.error("Error resetting transactions", error);
      toast.error("Couldn't reset transactions");
    }
  };
  

  return (
    <>
      <Header/>
      <>
      {
        loading ? (<div className='container'><div className="spinner"></div></div>)
        :
        (<> 
        <Cards
          resetBalance={resetBalance}
          showExpenseModal={showExpenseModal}
          showIncomeModal={showIncomeModal}
          income={income}
          expense={expense}
          totalBalance={totalBalance}
        />
        {
          transactions.length > 0 ? <Chart sortedTransactions={sortedTransactions} /> : <NoTransaction/>
        }
         <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
        />
        <AddIncomeModal 
          isIncomeModalVisible={isIncomeModalVisible}
          handleIncomeCancel={handleIncomeCancel}
          onFinish={onFinish}
        /> 
      </>)
       } 
      </>
      <TransactionTable transections={transactions} setTransactions={setTransactions} addTransaction={addTransaction} fetchTransactions={fetchTransaction}/>
    </>
  )
}

export default Dashboard;
