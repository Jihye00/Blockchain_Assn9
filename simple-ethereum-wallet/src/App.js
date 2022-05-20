import { useEffect, useState } from "react";
import Web3 from 'web3';
import Box from '@material-ui/core/Box';
import Select from 'react-select';

const rpcURL = "http://localhost:8545"
const web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));
console.log(web3.version.network)

const GetAccountList = ({accountList, setAccountList, total, setTotal}) => {
  // web3.currentProvider.enable()

  async function getList() {
    var sum = 0;
    var accList = []
    const list = await web3.eth.getAccounts();
    console.log(list)
    for (var acc of list) {
      var balance = Number(await web3.utils.fromWei(await web3.eth.getBalance(acc), "ether"))
      accList.push({ label: acc, value: balance })
      sum += balance
    }
    setAccountList(accList)
    setTotal({label: "Total", value: sum})
  }
  

  useEffect(()=>{
    getList()
  }, [total.value, web3])
  return(<div></div>)
}

const SendEther = ({accountList}) => {
  const [fromAddress, setFromAddress] = useState(accountList[0])
  const [amount, setAmount] = useState(0)
  const [toAddress, setToAddress] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div>
      <Box style={{ "display": "flex", "flexDirection": "row", border: '1px solid lightgray' }}>
        <div style={{ "marginRight": "1%" }}><b>Transmitter</b></div>
        <Select value={fromAddress} options={accountList} onChange={(e) => {
          setFromAddress(e)
        }}
          style={{ display: "flex", border: '1px solid skyblue'}} />
      </Box>
      <Box style={{ "display": "flex", "flexDirection": "row", backgroundColor: "lightgray", border: '1px solid lightgray' }}>
        <div style={{ "marginRight": "1%" }}><b>Recipient</b></div>
        <input type="text" style={{ border: '1px solid skyblue' }} onChange={(e) => setToAddress(e.target.value)}></input>
      </Box>
      <Box style={{ "display": "flex", "flexDirection": "row", border: '1px solid lightgray' }}>
        <div style={{ "marginRight": "1%" }}><b>Value</b></div>
        <input type="number" style={{ border: '1px solid skyblue' }} onChange={(e) => setAmount(e.target.value)}></input>
        <b>ETH</b>
      </Box>
      <Box style={{ "display": "flex", "flexDirection": "row", backgroundColor: "lightgray", border: '1px solid lightgray' }}>
        <div style={{ "marginRight": "1%" }}><b>Password</b></div>
        <input type="text" style={{ border: '1px solid skyblue' }} onChange={(e) => setPassword(e.target.value)}></input>
        <button onClick={() => {
          console.log(fromAddress.label, amount, toAddress, password)
          // web3.eth.personal.unlockAccount(fromAddress.label)
          web3.eth.personal.unlockAccount(fromAddress.label, password, 100).then(web3.eth.sendTransaction({from:fromAddress.label, to: toAddress, value: web3.utils.toWei(amount)}, password).then(console.log))
        }}>Send</button>
      </Box>
    </div>
  )
}

const EachAccount = ({accountItem}) => {
  return (
    <div style={{ "display": "flex", "flexDirection": "row", "alignItems": "center" }}>
      <div style={{ width: '60%' }}>
        {(accountItem.label === "Total") ?
          <Box style={{ backgroundColor: "skyblue", border: '1px solid lightgray' }}>
            <b>{accountItem.label}</b>
          </Box>
          :
          <Box style={{ backgroundColor: "yellow", border: '1px solid lightgray' }}>
            {accountItem.label}
          </Box>}
      </div>
      <div style={{ width: '40%' }}>
        {(accountItem.label === "Total") ?
          <Box style={{ backgroundColor: "skyblue", border: '1px solid lightgray' }}>
            <b>{accountItem.value} ETH</b>
          </Box>
          :
          <Box style={{ backgroundColor: "lightgreen", border: '1px solid lightgray' }}>
            {accountItem.value} ETH
          </Box>}
      </div>
    </div>
  )
}

const ViewAccount = ({accountList, total}) => {
  return (
    <div>
      {(accountList).map(item => <EachAccount accountItem={item} />)}
      <EachAccount accountItem={total} />
    </div>
  )
}

function App() {
  const [accountList, setAccountList] = useState([]);
  const [total, setTotal] = useState({ label: "Total", value: 0 })

  return (
    <div style={{ "maxWidth": "800px" }}>
      <GetAccountList accountList={accountList} setAccountList={setAccountList} total={total} setTotal={setTotal} />
      <div style={{ "textAlign": "center" }}>
        <h1 style={{ "color": "green" }}>Simple Ethereum Wallet</h1>
      </div>
      <div style={{ "marginLeft": "10%", "marginRight": "10%" }}>
        <div style={{ border: '4px solid gray' }}>
          {<ViewAccount accountList={accountList} total={total}/>}
        </div>
        <div style={{ border: '4px solid gray' }}>
          {<SendEther accountList={accountList} />}
        </div>
      </div>
    </div>
  );
}

export default App;
