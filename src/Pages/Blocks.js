import React, { Component } from 'react'
import {exchain} from '../App.js'
import { Card, CardBody, CardFooter, CardHeader, Spacer} from '@nextui-org/react'

export default class Blocks extends Component {
  render() {
    return (
      <div>
        <h2 className='text-xl font-bold m-3'>Blocks enregistrées dans la blockchain</h2>
        <div className='flex '>
            {exchain.chain.map((block, index) => {
                return (
                  <>
                  <Card className='max-w-96 whitespace-nowrap '>
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
      </div>
    )
  }
}
