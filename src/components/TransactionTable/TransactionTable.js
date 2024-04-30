import React, { useState } from 'react'
import './styles.css'
import { Radio, Select, Table, Space } from 'antd';
import { IoIosSearch } from "react-icons/io";
import { parse, unparse } from 'papaparse';
import { toast } from 'react-toastify';
import { DeleteOutlined } from '@ant-design/icons';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';


function TransactionTable({transections, setTransactions, addTransaction, fetchTransactions}) {
    const {Option} = Select;

    const [search, setSearch] = useState("")
    const [typeFilter, setTypeFilter]= useState("")
    const [sortKey, setSortKey] = useState("")
    const [toggleData, setToggleDate] =  useState(true)
    const [toggleAmount, setToggleAmount] = useState(true)

    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          title: 'Tag',
          dataIndex: 'tag',
          key: 'tag ',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
          },
          {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
          },
          {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <Space size="middle">
                    <a onClick={() => handleDelete(record.id)}><DeleteOutlined /></a>
                </Space>
            ),
        },
      ];

      async function handleDelete(id) {
        console.log(id); // Confirm the id being passed
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error("User not authenticated.");
            }
    
            // Reference to the document to be deleted
            const transactionRef = doc(db, `users/${user.uid}/transactions`, id.toString());
    
            // Delete the transaction document from Firestore
            await deleteDoc(transactionRef);
    
            // Remove the transaction from the UI
            let updatedTransactions = transections.filter(transaction => transaction.id !== id);
            setTransactions(updatedTransactions);
    
            // Show success toast
            toast.success("Transaction deleted successfully!");
        } catch (error) {
            console.error("Error deleting transaction:", error);
            toast.error("Failed to delete transaction.");
        }
    }
    
      let filteredTransactions = transections.filter((item)=> 
      item.name.toLowerCase().includes(search.toLowerCase()) && item.type.includes(typeFilter));

      let sortTransaction = filteredTransactions.sort((a , b)=>{
        if(sortKey === 'date'){
          if(toggleData === true){
            return new Date(a.date) - new Date (b.date);
          }
          else{
            return  new Date (b.date) - new Date(a.date) ;
          }
            
        }
        else if(sortKey === 'amount'){
            if(toggleAmount === true){
              return a.amount - b.amount
            }
            else{
              return b.amount - a.amount 
            }
        }
        else{
            return 0;
        }
      })

      function exportCSV (){
        var csv = unparse({
          fields: ["name", "type", "tag", "date", "amount"],
          data:transections,
        });
        var data = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        var csvURL = window.URL.createObjectURL(data);
        const tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.download  = "transactions.csv";
        document.body.appendChild(tempLink)
        tempLink.click(); 
        document.body.removeChild(tempLink);
      }

      function importFromCSV (event){
        event.preventDefault();
        try {
          parse(event.target.files[0],{
            header: true,
            complete: async function (results){
              // console.log("results", results)
              for(const transaction of results.data){

                const newTransaction = {
                  ...transaction,
                  amount : parseFloat(transaction.amount), 
                  key: transaction.date.getTime()
                }
                await addTransaction(newTransaction, true);
              }
            }
          });
          toast.success("All Transaction Added!");
          fetchTransactions();
          event.target.files = null;
        } catch (e) {
          toast.error(e.message)
        }
      }
      
     
  return (
    <div className='transaction-wrapper'>

      <div className='table-search-bar'>
        <div className='input-flex'>
            <IoIosSearch/>
            <input value={search} onChange={(e)=> setSearch(e.target.value)} placeholder='Search by name' />
        </div>
        <Select 
            className='select-input'
            onChange={(value)=> setTypeFilter(value)}
            value={typeFilter}
            placeholder="Filter"
            allowClear
        >
            <Option value="">All</Option>
            <Option value="income">Income</Option>
            <Option value="expense" >Expense</Option>
        </Select>
      </div>

      <div className='my-table'>
        <div className='table'>

            <h2>My Transaction</h2>

            <Radio.Group 
                className='input-radio'
                onChange={(e=> setSortKey(e.target.value))}
                value={sortKey}
            >
                <Radio.Button value="" >No Sort</Radio.Button>
                <Radio.Button onClick={()=>setToggleDate(!toggleData)} value="date" >Sort by Date</Radio.Button>
                <Radio.Button onClick={()=>setToggleAmount(!toggleAmount)} value="amount" >Sort by Amount</Radio.Button>
            </Radio.Group>
            <div className='table-btn'>
              <button className='btn' onClick={exportCSV}>Export to CSV</button>
              <label htmlFor="file-csv" className='btn blue' >Import from CSV</label>
              <input id='file-csv' type='file' accept='.csv' onChange={importFromCSV} required style={{display:"none"}} />
            </div>


        </div>
            <Table dataSource={sortTransaction} columns={columns} />
        </div>  
    </div>
  )
}

export default TransactionTable
