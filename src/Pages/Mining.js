import { Card, CardBody, CardHeader } from '@nextui-org/react'
import React from 'react'
export default function Mining() {
  return (
    <div>
        <Card>
            <CardHeader>
                <h3 className='text-lg font-bold'>Minage en cours</h3>
            </CardHeader>
            <CardBody>
                <p>Hash: </p>
                <p id='hashResult'></p>
                <p>Nonce: </p>
                <p id='nonceResult'></p>
            </CardBody>
        </Card>
    </div>
  )
}
