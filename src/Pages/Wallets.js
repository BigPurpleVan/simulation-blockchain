import React, { useState } from 'react';
import {wallets, exchain, newWallet} from '../App';
import {Input, Button, Spacer, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";



export default function Wallets (){
    const [seed, setSeed] = useState(1);
    const reset = () => {
        setSeed(Math.random());
    }
    console.log(wallets)
    return (
      <div key={seed}>
        <h2 className='text-xl font-bold m-3' >Wallets</h2>
          {wallets.map((wallet, index) => {
            return (
              <Table className='flex flex-col'>
                <TableHeader>
                  <TableColumn>Wallet {index}</TableColumn>
                  <TableColumn></TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>{wallet.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Adresse</TableCell>
                    <TableCell>{wallet.publicKey}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Solde</TableCell>
                    <TableCell>{exchain.getBalance(wallet.publicKey)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )
          })}
   
        <form className='flex'>
            <Input className='w-1/3' placeholder="Nom du wallet" id="NameInput" />
            <Spacer x={4} />
            <Input className='w-1/3' type="number" defaultValue='0' id="BalanceInput" />
            <Spacer x={4} />
            <Button className='w-1/8' onClick={() => {
              if(document.getElementById('NameInput').value === ""){
                  alert("Veuillez entrer un nom")
                }else{
                  newWallet(document.getElementById("NameInput").value, document.getElementById("BalanceInput").value)
                  reset()
              }
            }}>Créer un wallet</Button>
        </form>
      </div>
    )
  }
