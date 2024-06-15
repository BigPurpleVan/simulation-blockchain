import React, { useState } from 'react';
import {wallets, exchain, newWallet} from '../App';
import {Input, Button, Spacer} from "@nextui-org/react";


export default function Wallets (){
    const [seed, setSeed] = useState(1);
    const reset = () => {
        setSeed(Math.random());
    }
    return (
      <div>
        <h2 className='text-xl font-bold m-3' >Wallets</h2>
          {wallets.map((wallet, index) => {
            return (
              <table className='flex flex-col' key={seed}>
                <tr>
                  <th>Nom :</th>
                  <td>{wallet.name}</td>
                </tr>
                <tr>
                  <th className='mr-0.5'>Clé publique :</th>
                  <td>{wallet.publicKey}</td>
                </tr>
                <tr>
                  <th>Clé privée :</th>
                  <td>{wallet.privateKey}</td>
                </tr>
                <tr>
                  <th>Balance :</th>
                  <td>{exchain.getBalance(wallet.publicKey)}</td>
                </tr>
                <Spacer y={4} />
              </table>
            )
          })}
   
        <form className='flex'>
            <Input className='w-1/3' placeholder="Nom du wallet" id="NameInput" />
            <Spacer x={4} />
            <Input className='w-1/3' type="number" defaultValue='0' id="BalanceInput" />
            <Spacer x={4} />
            <Button className='w-1/8' onClick={() => {
              newWallet(document.getElementById("NameInput").value)
              reset()
            }}>Créer un wallet</Button>
        </form>
      </div>
    )
  }
