const iotex = require('./iotex-deploy')

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const byteCode = `60806040526000805534801561001457600080fd5b5060df806100236000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063464ed56614604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60aa565b6040518082815260200191505060405180910390f35b8060008190555050565b600080549050905600a165627a7a7230582068f3949e0e8ea3891f2f45e7a52eae6240a83645349d24307ba8044fdf9b30320029`

const publicKey = 'fd170d3d1ae0ecdb035cad3f4bc3a9fc224aa17d9858c3d08481a608862d49e7f39bac00fef24c10f10d6edaa34e65139f7511c5ac5848063856f34166faeb1978bad3c3e656bd01'
const privateKey = '723219e98f086bb63270b66c655d1a78091740de71a37437ce3ac2146ae9c52a715cc300'
const rawAddress = 'io1qyqsyqcymxkheset0pzcmy8453utlrlzvfhsdujmdcekeu'

let deployTx = ''

async function deploy(){
  let res = null
  try{
    res = await iotex.getAddressState(rawAddress)
  } catch(e){console.log(e)}

  try{
    let nonce = res.address.pendingNonce
    res = await iotex.signTransaction(byteCode,nonce,1000000,1,0,publicKey,privateKey,rawAddress)
  } catch(e){console.log(e)}

  try{
    res = await iotex.deploy(res.rawTransaction)
  } catch(e){console.log(e)}

  try{
    console.log('contract is being mined')
    await wait(5000)
    res = await iotex.getTransactionReceipt(res.hash)
  } catch(e){console.log(e)}

  console.log('contractAddress: ',res.receipt.contractAddress)
}

deploy()
