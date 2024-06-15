import React, { Component } from 'react'
import {Slider} from "@nextui-org/react"
import {exchain} from '../App.js'
export default function Settings () {

    return (
      <div>
        <Slider 
        label="Difficulté du POW" 
        step={1} 
        maxValue={10} 
        minValue={0} 
        defaultValue={exchain.blockProofOfWorkDifficulty}
        onChange={(newValue) => exchain.blockProofOfWorkDifficulty = newValue }
        className="max-w-md"
        />
        <Slider 
        label="Récompense de minage" 
        step={1} 
        maxValue={1000} 
        minValue={0} 
        defaultValue={exchain.blockMineReward}
        onChangeCommitted={(newValue) =>  exchain.blockMineReward = newValue}
        className="max-w-md"
        />
      </div>
    )
}
