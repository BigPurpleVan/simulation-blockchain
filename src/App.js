import './App.css';
import {Tabs, Tab, Card, CardBody, Switch } from "@nextui-org/react";
import React, {useState} from 'react';
import Blocks from "./Pages/Blocks";
import Wallets from "./Pages/Wallets";
import Pending from "./Pages/Pending";
import Transactions from "./Pages/Transactions";
import Settings from "./Pages/Settings"; 
import {SunIcon} from "./Icons/SunIcon.jsx"
import {MoonIcon} from "./Icons/MoonIcon.jsx"

// Importe les modules nécessaires pour la blockchain, les transactions et la génération de clés
const Blockchain = require('./Data/blockchain')
const Transaction = require('./Data/transaction')
const { KeyGenerator } = require('./Data/signature')

// Crée une instance de la blockchain pour l'exemple
export const exchain = new Blockchain()

// Génère une adresse publique pour un mineur en utilisant KeyGenerator et l'exporte
export const minorAddress = new KeyGenerator().generate().publicKey

// Initialise et exporte une liste vide pour stocker les portefeuilles
export const wallets = []

// Définit et exporte une fonction pour créer un nouveau portefeuille
export const newWallet = (name, balance = 0) => {
  // Génère une nouvelle paire de clés pour le portefeuille
  let wallet = (new KeyGenerator()).generate()
  console.log(balance)
  if (balance > 0){      // Crée une transaction initiale pour créditer le portefeuille avec nombre defini d'unités
    // en utilisant la clé privée du système pour signer la transaction
    exchain.addTransaction(new Transaction(exchain.system.publicKey, wallet.publicKey, balance).sign(exchain.system.privateKey))
    // Mine un nouveau bloc pour inclure la transaction précédente
    exchain.mine(minorAddress)
  }

  // Ajoute le nouveau portefeuille à la liste des portefeuilles avec son nom, clés et solde
  wallets.push({
    name: name,
    privateKey: wallet.privateKey,
    publicKey: wallet.publicKey,
    balance: exchain.getBalance(wallet.publicKey) // Récupère le solde actuel du portefeuille
  })
}

// Crée un exemple de portefeuille nommé 'Mon Wallet'
newWallet('Mon Wallet', 1000);




function App() {
  const [isDark, setIsDark] = useState(true)
  const [theme, setTheme] = useState("dark")
  return (
    <div className= {theme +" text-foreground bg-background min-h-screen"}>
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
        <Tab title="Parametres">
          <Card>
            <CardBody>
              <Settings />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
