import { Line, Pie } from '@ant-design/charts';
import React from 'react'
import './styles.css'

function Chart({sortedTransactions}) {
    // console.log("sorted",sortedTransactions)

    const data = sortedTransactions.map((item) => {
        return {date : item.date , amount: item.amount};
    }); 
    const spendingData = sortedTransactions.filter((transaction)=>{
        if(transaction.type === 'expense'){
            return {tag: transaction.tag, amount:transaction.amount}
        }
    });
    
    let finalSpending = spendingData.reduce((acc, obj)=>{
        let key= obj.tag;
        if(!acc[key]){
            acc[key] = {tag: obj.tag, amount: obj.amount};
        }
        else{
            acc[key].amount += obj.amount;
        }
        return acc;
    }, {});

    let newSpendings =[
        {tag: "food", amount: 0},
        {tag: "education", amount: 0},
        {tag: "office", amount: 0},
    ];

    spendingData.forEach((item)=>{
        if(item.tag === 'food'){
            newSpendings[0].amount += item.amount;
        }
        else if(item.tag === 'education'){
            newSpendings[1].amount += item.amount;
        }
        else{ 
            newSpendings[2].amount += item.amount;
        }
    })
    
      const config = {
        data,
        width:800,
        autoFit:true,
        xField: 'date',
        yField: 'amount',
      }
      const spendingConfig = {
        data: newSpendings,
        width: 500,
        angleField: "amount",
        colorField: "tag",
        
      };

      let chart;
      let picChart;
  return (
    <div className='chart-wrapper'>
      <div className='graph'>
        <h2>Your Analytics</h2>
        <Line {...config} onReady={(chartInstance)=> (chart= chartInstance)} />;
      </div>
      <div className='pie-chart'>
        <h2>Your Spends</h2>
        <Pie {...spendingConfig} onReady={(chartInstance)=> (picChart= chartInstance)} />

      </div>
    </div>
  )
}

export default Chart
