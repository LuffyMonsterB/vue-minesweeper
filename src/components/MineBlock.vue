<script setup lang="ts">
import { isDev } from '~/composables'
import { BlockState } from '~/types'

const numberColors = [
  'text-transparent',
  'text-blue-500',
  'text-green-500',
  'text-yellow-500',
  'text-orange-500',
  'text-red-500',
  'text-purple-500',
  'text-pink-500',
  'text-teal-500'
]

defineProps<{ block: BlockState }>()

function getBlockClass(block: BlockState) {
  if (block.flagged) {
    return 'bg-gray-500/10'
  }
  if (!block.revealed)
    return 'bg-gray-500/10 hover:bg-gray-500/20'
  return block.mine ?
    ''
    : numberColors[block.adjacentMines]
}


</script>

<template>
  <button w-10 h-10 m="0.5" border="1 gray-400/10" flex="~" items-center justify-center :class="getBlockClass(block)">
    <template v-if="block.flagged">
      <div text-red i-mdi-flag></div>
    </template>
    <template v-else-if="block.revealed || isDev">
      <div v-if="block.mine" i-mdi-mine>
      </div>
      <div v-else font-600>
        {{ block.adjacentMines }}
      </div>
    </template>

  </button>
</template>
