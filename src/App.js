import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

function App() {

const [manager, setManager] = useState('');
const [players, setPlayers] = useState([]);
const [balance, setBalance] = useState('');
const [value, setValue] = useState();
const [message, setMessage] = useState('');

const init = () => {
  lottery.methods.manager().call()
   .then(data => {
     setManager(data)
   });

   lottery.methods.getPlayers().call()
    .then(pdata => {
      setPlayers(pdata)
    });



    web3.eth.getBalance(lottery.options.address)
      .then(bdata => {
        setBalance(bdata)
      });


}

const onSubmit = async event => {
  event.preventDefault();
  const accounts = await web3.eth.getAccounts();
     setMessage('waiting on transaction');

  await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether')

    });
        setMessage('you have been entered');

}
const onClick = async () => {

  const accounts = await web3.eth.getAccounts();
     setMessage('waiting on transaction');

  await lottery.methods.pickWinner().send({
      from: accounts[0]


    });
        setMessage('a winner has been picked!');

}



useEffect(() => {
    init();
}, [players, balance]);
  return (


    <div className="App">
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager} <br/>
         There are currently {players.length} players <br/>
         competing for {web3.utils.fromWei(balance, 'ether')} eth.

      </p>
    <hr/>
    <form onSubmit={onSubmit}>
      <h4>Want to try your luck?</h4>
        <div>
          <label>
          Ammount of ehter to enter
          </label> <br/>
           <input
             value={value}
             onChange={e => setValue(e.target.value)}
           />

        </div>
        <button>Enter</button>
    </form>
    <hr/>
      <button onClick={onClick}>Pick a winner</button>
    <hr/>
    <h1>{message}</h1>
    </div>
  );
}

export default App;
