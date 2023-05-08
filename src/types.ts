//单元格对象
export interface BlockState {
  x: number
  y: number
  revealed: boolean
  mine: boolean
  flagged: boolean
  adjacentMines: number
}