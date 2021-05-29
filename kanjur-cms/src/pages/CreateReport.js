import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Navbar from '../components/Navbar'
import { editProduct } from '../store/action/ProductAction'
import { fetchTransaction } from '../store/action/ReportAction'

function CreateReport() {
  const dispatch = useDispatch()
  const products = useSelector(state => state.products)
  const transaction = useSelector(state => state.transactions)

  useEffect(() => {
    dispatch(fetchTransaction())
  }, [dispatch])


  let ArrayReport = []
  products.forEach(el => {
    ArrayReport.push({
      ProductId: el.id,
      stockRecorded: el.stock,
      stockReal: el.stock
    })
  })
  const [report, setReport] = useState(ArrayReport)

  function handleRealStockChange(index, value) {
    if(report[index].stockRecorded !== +value){
      let dupeReport = [...report]
      let before = dupeReport[index]
      dupeReport[index] = {...before, stockReal: +value}
      setReport(dupeReport)
    } else {
    }
  }

  function handleUpdateProduct(index, product){
    let payload = {
      name: product.name,
      price: product.price,
      barcode: product.barcode_number,
      stock: report[index].stockReal,
      stockBefore: report[index].stockReal
    }
    dispatch(editProduct(product.id, payload))
  }

  function getDailyIncome(transaction) {
    let income = 0
    transaction.forEach(el => {
      income += el.totalPrice
    })
    return income
  }

  return (
    <div style={{ display: "flex"}}>
    <Navbar/>
    <div className="row container" style={{width: "85vw", marginTop: "5vh"}}>
      <div className="container col-12 table-wrapper-scroll-y my-custom-scrollbar">
      <h2>Create Daily Product Report</h2>
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th className="col-4">Name</th>
              <th className="col-2">Barcode Number</th>
              <th className="col-1">Current Stock</th>
              <th className="col-1">Recorded Stock</th>
              <th className="col-1">Real Stock</th>
              <th className="col-2">Action</th>
            </tr>
          </thead>
          {/**
           * nanti looping pake map buat list product
          */}
          {
            products.map((el, i) => {
              return (
                <tbody key={el.id}>
                <tr>
                  <td>{ el.name }</td>
                  <td>{ el.barcode_number }</td>
                  <td>{ el.stock }</td>
                  <td>{ report[i].stockRecorded}</td>
                  <td>
                    <input 
                      type="number" 
                      value={ report[i].stockReal }
                      onChange={(e) => handleRealStockChange(i, e.target.value)}
                      style={{width: "100%"}}
                    >
                    </input>
                  </td>
                  <td><button onClick={(e) => {
                    e.preventDefault()
                    handleUpdateProduct(i, el)
                  }}>Update stock</button></td>
                </tr>
                </tbody>
              )
            })
          }
        </table>
        <button>GENERATE REPORT</button>
      </div>
      {JSON.stringify(report, null, 2)}"OUTPUT PRODUCT"<br></br>
      {JSON.stringify(transaction, null, 2)}"OUTPUT TRANSACTION"<br></br>
      {JSON.stringify(getDailyIncome(transaction))}"OUTPUT TOTAL INCOME"
    </div>
    </div>
  )
}

export default CreateReport
