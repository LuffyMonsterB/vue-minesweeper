<script setup lang="ts">
import { GamePlay, isDev, toggleDev } from '~/composables'

const play = new GamePlay(9,9,10)
useStorage('vue-minesweeper-state',play.state)
const state = computed(()=>play.board)

const start =ref(new Date())
const now = $(useNow())
const timeCount = $computed(()=>{
    return Math.round((+now - +start.value)/1000)
})

function newGame(difficulty:'easy'|'medium'|'hard'|null){
  start.value = new Date()
  switch(difficulty){
    case 'easy':
      play.init(9,9,10)
      break
    case 'medium':
      play.init(16,16,40)
      break
    case 'hard':
      play.init(30,16,99)
      break
    default:
      play.init()
      break
  }
}

</script>

<template>
  <div>
    <div i-carbon-campsite inline-block text-4xl></div>
    <p>
      <a rel="noreferrer" href="https://github.com/antfu/vitesse-lite" target="_blank">
        Minesweeper
      </a>
    </p>
    <div py-2></div>
    <div flex="~ gap-1" justify-center>
      <button btn border-1 p-1 hover="bg-gray/10" @click="newGame(null)">New Game</button>
      <button btn border-1 p-1 hover="bg-gray/10" @click="newGame('easy')">Easy</button>
      <button btn border-1 p-1 hover="bg-gray/10" @click="newGame('medium')">Medium</button>
      <button btn border-1 p-1 hover="bg-gray/10" @click="newGame('hard')">Hard</button>
    </div>
    <div py-2></div>
    <div font-mono flex="~ gap-1" justify-center items-center>
      <div i-carbon-timer></div>
      <div>{{ timeCount }}s</div>
    </div>
    <div py-2></div>
    <div v-for="row, y in state" :key="y" flex="~" items-center justify-center>
      <MineBlock v-for="block, x in row" :key="x" :block="block" @click="play.onBtnClick(block)"
        @contextmenu.prevent="play.onRightClick(block)" />
    </div>
  </div>
  <div py-4></div>
  <div flex="~ gap-1" justify-center>
      <button btn border-1 p-1 hover="bg-gray/10" @click="toggleDev()">{{ isDev ? 'Dev':'Normal' }} Mode</button>
    </div>
  <Confetti :passed="play.state.value.gameState==='won'"></Confetti>
</template>
