import React from 'react'
import {Autocomplete, AutocompleteItem, Input} from "@nextui-org/react"
import { exchain, wallets } from '../App'
const Transaction = require('../Data/transaction.js')


export default function Transactions () {
  const createTransaction = (e) => {
    e.preventDefault()
    let sendAdress = wallets[0].publicKey
    let destinationAddress = e.target.destinationAddress.value.substring(e.target.destinationAddress.value.indexOf("[") + 1, e.target.destinationAddress.value.indexOf("]"))
    let amount = e.target.amount.value
    exchain.addTransaction(new Transaction(sendAdress, destinationAddress, amount))
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
