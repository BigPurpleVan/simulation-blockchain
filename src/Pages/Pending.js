import React from 'react'
import {exchain, minorAddress} from '../App.js'
import { Button, Spacer } from '@nextui-org/react'

export default function Pending(){
    const mineBlock = () => {
        exchain.mine(minorAddress)
    }
    return (
      <div>
        <h2 className='text-xl font-bold m-3' >Transactions en attente</h2>
        <div>
            {exchain.pendingTransactions.map((transaction, index) => {
                return (
                  <div key={index}>
                    <table>
                      <tr>
                        <th>Transaction {index}</th>
                      </tr>
                      <tr>
                        <td>Source:</td>
                        <td>{transaction.fromAddress}</td>
                      </tr>
                      <tr>
                        <td>Destinataire:</td>
                        <td>{transaction.toAddress}</td>
                      </tr>
                      <tr>
                        <td>Montant:</td>
                        <td>{transaction.amount}</td>
                      </tr>
                      <tr>
                        <td>Timestamp:</td>
                        <td>{transaction.timestamp}</td>
                      </tr>
                    </table>
                    <Spacer y={4} />
                  </div>
                )
                
            })}
        </div>
        <div>
          <Button onPress={mineBlock}>
            Miner le prochain block
          </Button>
        </div>
      </div>
    )

}
