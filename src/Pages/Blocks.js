import React from 'react'
import {exchain} from '../App.js'
import { Card, CardBody, CardFooter, CardHeader, Spacer, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from '@nextui-org/react'

export default function Blocks() {
  const [infoTransaction, setInfoTransaction] = React.useState()
  
  
  return (
    <div>
      <h2 className='text-xl font-bold m-3'>Blocks enregistrées dans la blockchain</h2>
      <div className='flex'>
          {exchain.chain.map((block, index) => (
            <>
              <Card isPressable={true} className='max-w-96 whitespace-nowrap cursor-pointer' key={index} onPress={()=>{setInfoTransaction(
                block.transactions
              )}}>
                  <CardHeader>
                    <h3 className='text-lg font-bold'>Block {index}</h3>
                  </CardHeader>
                  <CardBody>
                    <p className='overflow-hidden text-ellipsis'>Hash: {block.hash}</p>
                    <p className='overflow-hidden text-ellipsis'>Previous Hash: {block.previousHash}</p>
                  </CardBody>
                  <CardFooter className='flex flex-col items-start'>
                    <p>Date : {new Date(block.timestamp*1000).toLocaleString()}</p>
                    <p>Timestamp: {block.timestamp}</p>
                    <p>Nonce: {block.nonce}</p>
                  </CardFooter>
              </Card>
              <Spacer x={4} />
            </>
          ))}
      </div>
        {infoTransaction === undefined  ? <div>Pas de transaction</div> : infoTransaction.map((transaction, index) => (
          <Table key={index}>
            <TableHeader>
              <TableColumn>Transaction {index}</TableColumn>
              <TableColumn></TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Source</TableCell>
                <TableCell>{transaction.fromAddress}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Destination</TableCell>
                <TableCell>{transaction.toAddress}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Montant</TableCell>
                <TableCell>{transaction.amount}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>{new Date(transaction.timestamp*1000).toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Signature</TableCell>
                <TableCell>{transaction.signature}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
            ))}
    </div>
  )
}
