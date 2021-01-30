
const correlation = require('./statistics/correlation.js')
const cycleTime = require('./statistics/cycleTime.js')
const distribution = require('./statistics/distribution.js')
const scatterPlot = require('./statistics/scatterPlot.js')
const monteCarlo = require('./statistics/monteCarlo.js')

module.exports = {

  updateStatistic: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateStatistic', data) }

    db.collection('kanbanGames').findOne({gameName: data.gameName}, function(err, gameRes) {
      if (err) throw err
      if (gameRes) {
        db.collection('kanban').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
          if (err) throw err
          if (res) {
            const cards = res.columns.find(function(c) {
              return c.name == 'done'
            }).cards
            switch(data.statistic) {
              case 'correlation':
                data.results = correlation.run(cards)
                break
              case 'cycle-time':
                data.results = cycleTime.run(cards)
                break
              case 'distribution':
                data.results = distribution.run(cards)
                break
              case 'scatter-plot':
                data.results = scatterPlot.run(cards)
                if (data.results.length) {
                  data.limits = scatterPlot.limits(data.results)
                }
                break
              case 'monte-carlo':
                data.results = monteCarlo.run(cards, gameRes.graphConfig.monteCarlo)
                break
            }
            io.emit('updateStatistic', data)
          }
        })
      }
    })
  }

}
