const request = require('request');

module.exports = {

  getAddressState: function(rawAddress){
    let url = 'https://www.iotexscan.io/api/getAddressId'
    let data = {json:{"id":rawAddress}}
    return new Promise((resolve,reject) => {
      request.post(url, data,(error, response, body)=>{
        if (!error && response.statusCode == 200) {
          resolve(body)
        }
        else{
          reject(error)
        }
      })
    })
  }
  ,
  signTransaction:
  function(byteCode,
    nonce,
    gasLimit,
    version,
    amount,
    publicKey,
    privateKey,
    rawAddress){
      let url = 'https://www.iotexscan.io/api/wallet/transaction/generateExecution'
      let data = {
        json: {
          'rawSmartContractRequest':{
            'byteCode': byteCode,
            'nonce': nonce,
            'gasLimit': gasLimit,
            'version': version,
            'contract': '',
            'amount': amount
          },
          'wallet':{
            'publicKey': publicKey,
            'privateKey': privateKey,
            'rawAddress': rawAddress
          }
        }
      }
      return new Promise((resolve,reject) => {
        request.post(url, data,(error, response, body)=>{
          if (!error && response.statusCode == 200) {
            resolve(body)
          }
          else{
            reject(error)
          }
        })
      })
    }
    ,
    deploy: function(rawTransaction){
      let url = 'https://www.iotexscan.io/api/wallet/transaction/sendTransaction'
      let data ={
        json: {
          'rawTransaction':rawTransaction,
          'type': 'contract'
        }
      }
      return new Promise((resolve,reject) => {
        request.post(url, data,(error, response, body)=>{
          if (!error && response.statusCode == 200) {
            resolve(body)
          }
          else{
            reject(error)
          }
        })
      })
    }
    ,
    getTransactionInfo: function(id){
      let url = 'https://www.iotexscan.io/api/getExecutionId'
      let data =  {json: {"id":id}}
      return new Promise((resolve,reject) => {
        request.post(url, data,(error, response, body)=>{
          if (!error && response.statusCode == 200) {
            resolve(body)
          }
          else{
            reject(error)
          }
        })
      })
    }
    ,
    getTransactionReceipt: function(id){
      let url = 'https://www.iotexscan.io/api/getExecutionReceipt'
      let data =  {json: {"id":id}}
      return new Promise((resolve,reject) => {
        request.post(url, data,(error, response, body)=>{
          if (!error && response.statusCode == 200) {
            resolve(body)
          }
          else{
            reject(error)
          }
        })
      })
    }

  }
