
const correlation = require('./statistics/correlation.js')
const cycleTime = require('./statistics/cycleTime.js')
const distribution = require('./statistics/distribution.js')
const scatterPlot = require('./statistics/scatterPlot.js')
const monteCarlo = require('./statistics/monteCarlo.js')

module.exports = {

  updateStatistic: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateStatistic', data) }

    db.collection('kanban').findOne({gameName: data.gameName, teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const cards = res.columns.find(function(c) {
          return c.name == 'done'
        }).cards
        switch(data.statistic) {
          case 'correlation':
            data.results = correlation.correlation(cards)
            break
          case 'cycle-time':
            data.results = cycleTime.cycleTime(cards)
            break
          case 'distribution':
            data.results = distribution.distribution(cards)
            break
          case 'scatter-plot':
            data.results = scatterPlot.scatterPlot(cards)
            if (data.results.length) {
              data.limits = scatterPlot.limits(data.results)
            }
            break
          case 'monte-carlo':
            data.results = cycleTime.cycleTime(cards)
            console.log(data.results)
            break
        }
        io.emit('updateStatistic', data)
      }
    })
  }

}
