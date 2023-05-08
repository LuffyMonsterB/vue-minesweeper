<script setup lang="ts">
import { GamePlay, isDev, toggleDev } from '~/composables'

const play = new GamePlay(5,5,3)
useStorage('vue-minesweeper-state',play.state)
const state = computed(()=>play.board) 

</script>

<template>
  <div>
    <div i-carbon-campsite inline-block text-4xl></div>
    <p>
      <a rel="noreferrer" href="https://github.com/antfu/vitesse-lite" target="_blank">
        Minesweeper
      </a>
    </p>
    <div flex="~ gap-1" justify-center>
      <button btn border-1 p-1 hover="bg-gray/10" @click="toggleDev()">{{ isDev ? 'Dev':'Normal' }} Mode</button>
      <button btn border-1 p-1 hover="bg-gray/10" @click="play.init()">Reset</button>
    </div>
    
    <div py-4></div>

    <div v-for="row, y in state" :key="y" flex="~" items-center justify-center>
      <MineBlock v-for="block, x in row" :key="x" :block="block" @click="play.onBtnClick(block)"
        @contextmenu.prevent="play.onRightClick(block)" />
    </div>
  </div>
  <Confetti :passed="play.state.value.gameState==='won'"></Confetti>
</template>
