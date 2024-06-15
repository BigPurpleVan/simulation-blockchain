import './App.css';
import {Tabs, Tab, Card, CardBody, Switch } from "@nextui-org/react";
import React, {useState} from 'react';
import Blocks from "./Pages/Blocks";
import Wallets from "./Pages/Wallets";
import Pending from "./Pages/Pending";
import Transactions from "./Pages/Transactions";
import Nodes from "./Pages/Nodes";
import Settings from "./Pages/Settings"; 
import {SunIcon} from "./Icons/SunIcon.jsx"
import {MoonIcon} from "./Icons/MoonIcon.jsx"

const Blockchain = require('./Data/blockchain')
const Transaction = require('./Data/transaction')
const { KeyGenerator } = require('./Data/signature')

//Creation de la blockchain exemple
export const exchain = new Blockchain()
exchain.blockProofOfWorkDifficulty = 3

//Creation de l'adresse d'un mineur
export const minorAddress = new KeyGenerator().generate().publicKey

//Creation du wallet example et de la liste des wallets
export const wallets = []
export const newWallet = (name, balance = 0) =>{
  let wallet = (new KeyGenerator()).generate()
  new Transaction(exchain.system.publicKey, wallet.publicKey, 1000).sign(exchain.system.privateKey)
  exchain.mine(minorAddress)
  wallets.push({
    name: name,
    privateKey: wallet.privateKey,
    publicKey: wallet.publicKey,
    balance: exchain.getBalance(wallet.publicKey)
  })
}
newWallet('Mon Wallet');
const systemTransaction = (new Transaction(exchain.system.publicKey, wallets[0].publicKey, 1000)).sign(exchain.system.privateKey)
wallets[0].balance = exchain.getBalance(wallets[0].publicKey)
exchain.addTransaction(systemTransaction)





function App() {
  const [isDark, setIsDark] = useState(true)
  const [theme, setTheme] = useState("dark")
  return (
    <body className= {theme +" text-foreground bg-background min-h-screen"}>
    <Switch
      size="lg"
      color="secondary"
      startContent={<SunIcon />}
      endContent={<MoonIcon />}
      onChange={() =>{console.log(isDark);setTheme(isDark ? "light" : "dark"); setIsDark(!isDark)}}
    >
      Dark mode
    </Switch>
      <Tabs className="flex justify-center h-full" aria-label="Options">
        <Tab title="Blocks">
          <Card>
            <CardBody>
              <Blocks />
            </CardBody>
          </Card>
        </Tab>
        <Tab title="Wallets">
          <Card>
            <CardBody>
              <Wallets />
            </CardBody>
          </Card>
        </Tab>
        <Tab title="En attente">
          <Card>
            <CardBody>
              <Pending />
            </CardBody>
          </Card>
        </Tab>
        <Tab title="Transaction">
          <Card>
            <CardBody>
              <Transactions />
            </CardBody>
          </Card>
        </Tab>
        <Tab title="Nodes">
          <Card>
            <CardBody>
              <Nodes />
            </CardBody>
          </Card>
        </Tab>
        <Tab title="Parametres">
          <Card>
            <CardBody>
              <Settings />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </body>
  );
}

export default App;
