import { BlockState } from "~/types"

const directions = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, 1],
  [0, -1],
  [-1, 1],
  [-1, 0],
  [-1, -1]
]

interface GameState {
  board: BlockState[][]
  mineGenerated: boolean
  gameState: 'play' | 'won' | 'lost'
}

export class GamePlay {
  state = ref() as Ref<GameState>

  constructor(public width: number, public height: number, public mines: number) {
    this.init()
  }
  get board() {
    return this.state.value.board
  }
  // 初始化网格
  init(width = this.width, height = this.height, mines = this.mines) {
    this.width = width
    this.height = height
    this.mines = mines
    this.state.value = {
      mineGenerated: false,
      gameState: 'play',
      board: Array.from({ length: this.height }, (_, y) =>
        Array.from({ length: this.width }, (_, x): BlockState => ({
          x, y,
          revealed: false,
          mine: false,
          flagged: false,
          adjacentMines: 0
        }))
      )
    }
  }

  // 生成炸弹
  generateMines(initial: BlockState) {
    const random = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }
    const randomInt = (min: number, max: number) => {
      return Math.round(random(min, max))
    }
    //随机位置
    const placeRandom = () => {
      const x = randomInt(0, this.width - 1)
      const y = randomInt(0, this.height - 1)
      const block = this.board[y][x]
      if (Math.abs(initial.x - block.x) <= 1 && Math.abs(initial.y - block.y) <= 1) {
        return false
      }
      if (block.mine) {
        return false
      }
      block.mine = true
      return true
    }
    Array.from({ length: this.mines }, () => null).forEach(() => {
      while (true) {
        if (placeRandom()) break
      }
    })

  }

  //更新数量
  updateNumbers() {
    this.board.forEach((row, y) => {
      row.forEach((block, x) => {
        if (block.mine) return
        this.getSiblings(block).forEach(b => {
          if (b.mine) {
            block.adjacentMines += 1
          }
        })
      })
    })
  }

  //点击到0后扩展
  expandZero(block: BlockState) {
    if (block.adjacentMines) return
    this.getSiblings(block).forEach(b => {
      if (!b.revealed) {
        b.revealed = true
        this.expandZero(b)
      }
    })
  }

  getSiblings(block: BlockState) {
    return directions.map(([dx, dy]) => {
      const x2 = block.x + dx
      const y2 = block.y + dy
      if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height)
        return undefined
      return this.board[y2][x2]
    })
      .filter(Boolean) as BlockState[]
  }

  onBtnClick(block: BlockState) {
    if (this.state.value.gameState != 'play') return
    if (!this.state.value.mineGenerated) {
      this.generateMines(block)
      this.state.value.mineGenerated = true
      this.updateNumbers()
    }

    block.revealed = true
    block.flagged = false
    if (block.mine) {
      this.state.value.gameState = 'lost'
      this.showAllMines()
      return
    }
    this.expandZero(block)
    this.checkGameState()
  }
  onRightClick(block: BlockState) {
    if (this.state.value.gameState != 'play') return
    if (!block.revealed) {
      block.flagged = !block.flagged
      this.checkGameState()
    }
  }

  showAllMines() {
    this.board.flat().forEach(s => {
      if (s.mine) {
        s.revealed = true
      }
    })
  }

  checkGameState() {
    const blocks = this.board.flat()
    if (blocks.every(block => block.revealed || block.flagged)) {
      if (blocks.some(block => block.flagged && !block.mine)) {
        this.state.value.gameState = 'lost'
        this.showAllMines()
      } else {
        this.state.value.gameState = 'won'
      }
    }
  }

}