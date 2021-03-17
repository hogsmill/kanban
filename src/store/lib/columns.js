
module.exports = {

  getColumnIndex: function(columns, column) {
    let index = 0
    for (let i = 0; i < columns.length; i++) {
      if (column.name == columns[i].name) {
        index = i
      }
    }
    return index
  },

  wipLimitReached: function(column, wipLimits) {
    return wipLimits && column.cards.length >= column.wipLimit
  },

  addColumn: function(columns, column, colour) {
    const newColumn = {
      name: column,
      include: true,
      wipLimit: 0,
      colour: colour,
      cards: []
    }
    const newColumns = []
    let doneColumn, order = 1
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].name != 'done') {
        columns[i].order = order
        order = order + 1
        newColumns.push(columns[i])
      } else {
        doneColumn = columns[i]
      }
    }
    newColumn.order = order
    newColumns.push(newColumn)
    doneColumn.order = order + 1
    newColumns.push(doneColumn)
    return newColumns
  },

  includeColumn: function(columns, column, include) {
    const newColumns = []
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i]
      if (col.name == column) {
        col.include = include
      }
      newColumns.push(col)
    }
    return newColumns
  },

  deleteColumn: function(columns, column) {
    const newColumns = []
    let order = 1
    for (let i = 0; i < columns.length; i++) {
      const newColumn = columns[i]
      if (newColumn.name != column) {
        newColumn.order = order
        order = order + 1
        newColumns.push(newColumn)
      }
    }
    return newColumns
  }
}
