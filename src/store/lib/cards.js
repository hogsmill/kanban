
function cardValue(workCards, card) {
  if (!card.urgent) {
    if (card.delivery < 3) {
      card.value = 700
    } else if (card.delivery < 6) {
      card.value = 400
    } else {
      card.value = 200
    }
  } else {
    card.value = -100 * card.delivery
  }
  const workCard = workCards.find(function(workCard) { return workCard.number == card.number })
  workCard.delivery = card.delivery
  workCard.value = card.value
}

function selectDependentTeam(teams, teamName) {
  // Make sure we don't pick our own team...
  const otherTeams = []
  for (let i = 0; i < teams.length; i++) {
    if (teams[i].include && teams[i].name != teamName) {
      otherTeams.push(i)
    }
  }
  const index = otherTeams[Math.floor(Math.random() * otherTeams.length)]
  return teams[index]
}

function getCardFirstColumn(card, columns) {
  let column
  for (let i = 0; i < columns.length; i++) {
    if (!column && card[columns[i].name] > 0) {
      column = columns[i].name
    }
  }
  return column
}

module.exports = {

  pullInCard: function(columns, workCards, currentWorkCard, currentDay, teams, teamName) {
    const newColumns = []
    const card = workCards.find(function(c) {
      return c.number == currentWorkCard
    })
    if (teams.length < 2) {
      card.teamDependency = 0
    }
    const cardColumn = getCardFirstColumn(card, columns)
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i]
      if (column.name == cardColumn) {
        const cards = column.cards
        card.commit = currentDay
        if (card.teamDependency) {
          card.dependentOn = selectDependentTeam(teams, teamName)
        }
        cards.push(card)
        column.cards = cards
      }
      newColumns.push(column)
    }
    return newColumns
  },

  addWorkedOn: function(card, column, name, role) {
    if (!card.workedOn[column]) {
      card.workedOn[column] = []
    }
    const workedInColumn = card.workedOn[column].find(function(n) {
      return n.id == name.id
    })
    if (!workedInColumn) {
      name.role = role
      card.workedOn[column].push(name)
    }
    return card
  },

  cardCompleteInColumn: function(card, colName, team, autoDeploy) {
    let dependentDone = true
    if (colName == 'deploy') {
      dependentDone = card.teamDependency == 0 || card.teamDependency == card.dependencyDone
    }
    // TODO: shouldn't need >= - check adding effort
    return !card.blocked && !card.failed && card.effort[colName] >= card[colName] && dependentDone
  },

  moveCard: function(columns, workCards, card, n, currentDay) {
    const fromCol = columns[n]
    const toCol = columns[n + 1]
    let i
    const cards = []
    for (i = 0; i < fromCol.cards.length; i++) {
      if (fromCol.cards[i].number != card.number) {
        cards.push(fromCol.cards[i])
      }
    }
    fromCol.cards = cards
    if (toCol.name == 'done') {
      card.done = true
      card.delivery = currentDay
      card.time = card.delivery - card.commit
      cardValue(workCards, card)
    }
    toCol.cards.push(card)
  },

  calculateActuals: function(columns, workCards, day, project) {
    const actuals = {
      project: project
    }
    const done = columns.find(function(c) { return c.name == 'done' })
    if (!project && done.cards.length == workCards.length) {
      actuals.project = day
    }
    return actuals
  }
}
