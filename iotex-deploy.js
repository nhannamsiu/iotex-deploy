const request = require('request');

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let self = module.exports = {
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
    deployContract: function(rawTransaction){
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
    ,
    deploy: async function(publicKey,privateKey,rawAddress,byteCode,gasLimit,amount){
      let res = null
      let deployTx = ''
      try{
        res = await self.getAddressState(rawAddress)
      } catch(e){console.log(e)}

      try{
        let nonce = res.address.pendingNonce
        res = await self.signTransaction(byteCode,nonce,gasLimit,1,amount,publicKey,privateKey,rawAddress)
      } catch(e){console.log(e)}

      try{
        res = await self.deployContract(res.rawTransaction)
        deployTx = res.hash
      } catch(e){console.log(e)}

      try{
        console.log('contract is being mined, timeOut = 5000ms')
        await wait(5000)
        res = await self.getTransactionReceipt(deployTx)
        return {'Tx': deployTx, 'contractAddress': res.receipt.contractAddress}
      } catch(e){
        return {'Tx': deployTx, 'notice': 'Transaction took more than 5s to mine, use this Tx to lookup later for contract address at https://www.iotexscan.io'}
      }
    }

  }
