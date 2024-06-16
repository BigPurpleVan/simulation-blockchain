import React from 'react'
import {exchain} from '../App.js'
import { Card, CardBody, CardFooter, CardHeader, Spacer} from '@nextui-org/react'


export default function Blocks() {
  console.log(exchain.chain[1])
    return (
      <div>
        <h2 className='text-xl font-bold m-3'>Blocks enregistrées dans la blockchain</h2>
        <div className='flex'>
            {exchain.chain.map((block, index) => {
                return (
                  <>
                    <Card className='max-w-96 whitespace-nowrap cursor-pointer' key={index}>
                        <CardHeader>
                          <h3 className='text-lg font-bold'>Block {index}</h3>
                        </CardHeader>
                        <CardBody>
                          <p className='overflow-hidden text-ellipsis'>Hash: {block.hash}</p>
                          <p className='overflow-hidden text-ellipsis'>Previous Hash: {block.previousHash}</p>
                        </CardBody>
                        <CardFooter className='flex flex-col items-start'>
                          <p>Date : {new Date(block.timestamp).toLocaleString()}</p>
                          <p>Timestamp: {block.timestamp}</p>
                          <p>Nonce: {block.nonce}</p>
                        </CardFooter>
                    </Card>
                    <Spacer x={4} />
                  </>
                )
            })}
        </div>
        <div>
        {exchain.chain.transactions === undefined ? (<div className='hidden'> <p>Pas de transaction</p> </div>) : exchain.chain.transactions.map((transaction, index) => {
          return transaction  ? (
                  <div className='hidden' key={index}>
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
                        <td>Date:</td>
                        <td>{new Date(transaction.timestamp * 1000).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td>Signature:</td>
                        <td>{transaction.signature}</td>
                      </tr>
                    </table>
                    <Spacer y={4} />
                  </div>
                ) : (<></>)
            }) } 
        </div>
      </div>
    )
}
