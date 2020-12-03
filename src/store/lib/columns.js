
module.exports = {

  addColumn: function(columns, column) {
    const order = columns.length + 1
    columns.push({
      name: column,
      order: order,
      include: true,
      wipLimit: 0,
      cards: []
    })
    return columns
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
      let column = columns[i]
      if (column.name != column) {
        column.order = order
        order = order + 1
        newColumns.push(column)
      }
    }
    return newColumns
  }
}
