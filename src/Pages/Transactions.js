import React from 'react'
import {Autocomplete, AutocompleteItem, Input} from "@nextui-org/react"
import { exchain, wallets } from '../App'
const Transaction = require('../Data/transaction.js')


// Définit et exporte la fonction Transactions qui sera utilisée pour créer des transactions
export default function Transactions () {
  // Définit la fonction createTransaction qui sera appelée lors de la soumission du formulaire
  const createTransaction = (e) => {
    e.preventDefault() // Empêche le comportement par défaut du formulaire (rechargement de la page)
    // Récupère l'adresse de l'expéditeur depuis le premier portefeuille dans la liste des portefeuilles
    let sendAdress = wallets[0].publicKey
    // Extrait l'adresse du destinataire depuis le champ de saisie, en supprimant les crochets
    let destinationAddress = e.target.destinationAddress.value.substring(e.target.destinationAddress.value.indexOf("[") + 1, e.target.destinationAddress.value.indexOf("]"))
    // Récupère le montant à envoyer depuis le champ de saisie du formulaire
    let amount = e.target.amount.value
    // Ajoute la nouvelle transaction à la liste des transactions en attente de la blockchain
    exchain.addTransaction(new Transaction(sendAdress, destinationAddress, amount))
    // Affiche dans la console les transactions en attente pour vérification
    console.log(exchain.pendingTransactions)
  }
    return (
      <form className='flex flex-col justify-between min-h-60' onSubmit={createTransaction}>
        <Autocomplete 
          isDisabled
          placeholder={wallets[0].name + " [" + wallets[0].publicKey + "]"}
          label="Destinataire"
          name='sendAddress'  
        >

        </Autocomplete>
        <Autocomplete 
          isRequired
          label="Destinataire" 
          name='destinationAddress'
        >
          {wallets.slice(1).map((wallet) => (
            <AutocompleteItem key={wallet.publicKey} value={wallet.publicKey}>
            {wallet.name + " [" + wallet.publicKey + "]"}
            </AutocompleteItem>
          ))}
        </Autocomplete>
        <Input type="number" name='amount' placeholder="Montant" defaultValue='10' isRequired/>
        <Input type='submit' value='Créer la transaction' className=' rounded-md p-2' />
      </form>
    )
}
