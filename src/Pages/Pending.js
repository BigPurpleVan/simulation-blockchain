import React from 'react'
import {exchain, minorAddress} from '../App.js'
import { Button, Spacer, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from '@nextui-org/react'

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
                  <Table>
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
                    </TableBody>
                  </Table>
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
