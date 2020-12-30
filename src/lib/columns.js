
import stringFuns from './stringFuns.js'

function getColumnIndex(columns, column) {
  let index = 0
  for (let i = 0; i < columns.length; i++) {
    if (column.name == columns[i].name) {
      index = i
    }
  }
  return index
}

function wipLimitReached(column) {
  return column.cards.length >= column.wipLimit
}

const ColumnFuns = {

  nextColumnName: function(column, columns) {
    const n = getColumnIndex(columns, column)
    return stringFuns.properCase(columns[n + 1].name)
  },

  canMoveCardToNextColumn: function(workCard, column, columns, wipLimits, wipLimitType) {
    const canMove = {error: false, message: ''}
    if (wipLimits && wipLimitType == 'hard') {
      const n = getColumnIndex(columns, column)
      if (wipLimitReached(columns[n + 1])) {
        canMove.error = true
        canMove.message =
          'Unable to move card to ' + stringFuns.properCase(columns[n + 1].name) +
          ' (hard) WIP limit reached'
      }
    }
    if (wipLimits && wipLimitType == 'soft') {
      const n = getColumnIndex(columns, column)
      if (wipLimitReached(columns[n + 1])) {
        canMove.error = false
        canMove.message =
          'Move card to ' + stringFuns.properCase(columns[n + 1].name) +
          ' - this will breach (soft) WIP limit'
      }
    }
    return canMove
  }
}

export default ColumnFuns
