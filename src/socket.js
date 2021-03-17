import io from 'socket.io-client'
import bus from './EventBus'

let connStr
if (location.hostname == 'localhost') {
  connStr = 'http://localhost:3014'
} else {
  connStr = 'https://agilesimulations.co.uk:3014'
}
console.log('Connecting to: ' + connStr)
const socket = io(connStr)

// --- Send ---

bus.$on('sendLoadGame', (data) => { socket.emit('sendLoadGame', data) })

bus.$on('sendMakeCaptain', (data) => { socket.emit('sendMakeCaptain', data) })

bus.$on('sendRestartGame', (data) => { socket.emit('sendRestartGame', data) })

bus.$on('sendHide', (data) => { socket.emit('sendHide', data) })

bus.$on('sendGameState', (data) => { socket.emit('sendGameState', data) })

bus.$on('sendGetGameDetails', (data) => { socket.emit('sendGetGameDetails', data) })

bus.$on('sendGetAvailableGames', (data) => { socket.emit('sendGetAvailableGames', data) })

bus.$on('sendRetro', (data) => { socket.emit('sendRetro', data) })

bus.$on('sendSetColumnWip', (data) => { socket.emit('sendSetColumnWip', data) })

bus.$on('sendRetroDone', (data) => { socket.emit('sendRetroDone', data) })

bus.$on('sendShowEventCard', (data) => { socket.emit('sendShowEventCard', data) })

bus.$on('sendUpdateCurrentDay', (data) => { socket.emit('sendUpdateCurrentDay', data) })

bus.$on('sendStartAutoDeploy', (data) => { socket.emit('sendStartAutoDeploy', data) })

bus.$on('sendIncrementAutoDeploy', (data) => { socket.emit('sendIncrementAutoDeploy', data) })

bus.$on('sendUpdatePersonAutoDeployEffort', (data) => { socket.emit('sendUpdatePersonAutoDeployEffort', data) })

bus.$on('sendPairingDay', (data) => { socket.emit('sendPairingDay', data) })

bus.$on('sendAddEffortToOthersCard', (data) => { socket.emit('sendAddEffortToOthersCard', data) })

bus.$on('sendUpdateOtherTeamEffort', (data) => { socket.emit('sendUpdateOtherTeamEffort', data) })

bus.$on('sendPullInCard', (data) => { socket.emit('sendPullInCard', data) })

bus.$on('sendMoveCardToNextColumn', (data) => { socket.emit('sendMoveCardToNextColumn', data) })

bus.$on('sendUpdatePersonEffort', (data) => { socket.emit('sendUpdatePersonEffort', data) })

bus.$on('sendUpdateEffort', (data) => { socket.emit('sendUpdateEffort', data) })

bus.$on('sendSendMessageToFacilitators', (data) => { socket.emit('sendSendMessageToFacilitators', data) })

bus.$on('sendSendMessage', (data) => { socket.emit('sendSendMessage', data) })

bus.$on('sendUpdateMessages', (data) => { socket.emit('sendUpdateMessages', data) })

bus.$on('sendAnswerFacilitatorQuestion', (data) => { socket.emit('sendAnswerFacilitatorQuestion', data) })

bus.$on('sendUpdateFacilitatorMessages', (data) => { socket.emit('sendUpdateFacilitatorMessages', data) })

bus.$on('sendUpdateProjectEstimate', (data) => { socket.emit('sendUpdateProjectEstimate', data) })

bus.$on('sendUpdateMVPEstimate', (data) => { socket.emit('sendUpdateMVPEstimate', data) })

bus.$on('sendUpdateReEstimate', (data) => { socket.emit('sendUpdateReEstimate', data) })

bus.$on('sendShowSetEstimates', (data) => { socket.emit('sendShowSetEstimates', data) })

// Facilitator

bus.$on('sendUpdateStealth', (data) => { socket.emit('sendUpdateStealth', data) })

bus.$on('sendUpdateConfig', (data) => { socket.emit('sendUpdateConfig', data) })

bus.$on('sendUpdateSplitColumns', (data) => { socket.emit('sendUpdateSplitColumns', data) })

bus.$on('sendUpdateIncludeColumn', (data) => { socket.emit('sendUpdateIncludeColumn', data) })

bus.$on('sendMoveColumnUp', (data) => { socket.emit('sendMoveColumnUp', data) })

bus.$on('sendMoveColumnDown', (data) => { socket.emit('sendMoveColumnDown', data) })

bus.$on('sendDeleteColumn', (data) => { socket.emit('sendDeleteColumn', data) })

bus.$on('sendAddColumn', (data) => { socket.emit('sendAddColumn', data) })

bus.$on('sendUpdateWipLimits', (data) => { socket.emit('sendUpdateWipLimits', data) })

bus.$on('sendUpdateWipLimitType', (data) => { socket.emit('sendUpdateWipLimitType', data) })

bus.$on('sendUpdateTeamActive', (data) => { socket.emit('sendUpdateTeamActive', data) })

bus.$on('sendGetGames', (data) => { socket.emit('sendGetGames', data) })

bus.$on('sendUpdateGameInclude', (data) => { socket.emit('sendUpdateGameInclude', data) })

bus.$on('sendDeleteGame', (data) => { socket.emit('sendDeleteGame', data) })

bus.$on('sendRunDemoToMvp', (data) => { socket.emit('sendRunDemoToMvp', data) })

bus.$on('sendRunDemoToEnd', (data) => { socket.emit('sendRunDemoToEnd', data) })

// Results

bus.$on('sendShowGameResult', (data) => { socket.emit('sendShowGameResult', data) })

bus.$on('sendShowAllTeamsResult', (data) => { socket.emit('sendShowAllTeamsResult', data) })

bus.$on('sendShowSingleTeamResult', (data) => { socket.emit('sendShowSingleTeamResult', data) })

bus.$on('sendShowMultipleTeamsResult', (data) => { socket.emit('sendShowMultipleTeamsResult', data) })

bus.$on('sendSetWipUseMovingAverage', (data) => { socket.emit('sendSetWipUseMovingAverage', data) })

bus.$on('sendSetWipUseDays', (data) => { socket.emit('sendSetWipUseDays', data) })

bus.$on('sendSetCumulativeFlowUseDays', (data) => { socket.emit('sendSetCumulativeFlowUseDays', data) })

bus.$on('sendSetCardSize', (data) => { socket.emit('sendSetCardSize', data) })

bus.$on('sendSetMonteCarloRuns', (data) => { socket.emit('sendSetMonteCarloRuns', data) })

bus.$on('sendSetMonteCarloRunTo', (data) => { socket.emit('sendSetMonteCarloRunTo', data) })

bus.$on('sendShowSourceOfVariation', (data) => { socket.emit('sendShowSourceOfVariation', data) })

bus.$on('sendUpdateStatistic', (data) => { socket.emit('sendUpdateStatistic', data) })

// Demo

bus.$on('sendSetDemoStepThrough', (data) => { socket.emit('sendSetDemoStepThrough', data) })

bus.$on('sendSetDemoRunTo', (data) => { socket.emit('sendSetDemoRunTo', data) })

bus.$on('sendSetupRunGame', (data) => { socket.emit('sendSetupRunGame', data) })

bus.$on('sendSetDemoRunning', (data) => { socket.emit('sendSetDemoRunning', data) })

bus.$on('sendRunDemoGame', (data) => { socket.emit('sendRunDemoGame', data) })

// --- Receive ---

socket.on('broadcastMessage', (data) => { bus.$emit('broadcastMessage', data) })

socket.on('loadGame', (data) => { bus.$emit('loadGame', data) })

socket.on('loadTeam', (data) => { bus.$emit('loadTeam', data) })

socket.on('makeCaptain', (data) => { bus.$emit('makeCaptain', data) })

socket.on('updateStealth', (data) => { bus.$emit('updateStealth', data) })

socket.on('updateGameState', (data) => { bus.$emit('updateGameState', data) })

socket.on('updateGames', (data) => { bus.$emit('updateGames', data) })

socket.on('updateGameDetails', (data) => { bus.$emit('updateGameDetails', data) })

socket.on('updateConnections', (data) => { bus.$emit('updateConnections', data) })

socket.on('showEventCard', (data) => { bus.$emit('showEventCard', data) })

socket.on('autodeployComplete', (data) => { bus.$emit('autodeployComplete', data) })

socket.on('showResult', (data) => { bus.$emit('showResult', data) })

socket.on('showSetEstimates', (data) => { bus.$emit('showSetEstimates', data) })

socket.on('moveCardToNextColumnError', (data) => { bus.$emit('moveCardToNextColumnError', data) })

socket.on('cardNotCompleteError', (data) => { bus.$emit('cardNotCompleteError', data) })

// Day

socket.on('retro', (data) => { bus.$emit('retro', data) })

socket.on('hide', (data) => { bus.$emit('hide', data) })

// Status

socket.on('hint', (data) => { bus.$emit('hint', data) })

socket.on('updatePersonEffort', (data) => { bus.$emit('updatePersonEffort', data) })

socket.on('updatePersonAutoDeployEffort', (data) => { bus.$emit('updatePersonAutoDeployEffort', data) })

socket.on('updateOtherTeamEffort', (data) => { bus.$emit('updateOtherTeamEffort', data) })

socket.on('broadcastMessage', (data) => { bus.$emit('broadcastMessage', data) })

// Facilitator

// Graphs

socket.on('showResult', (data) => { bus.$emit('showResult', data) })

socket.on('updateStatistic', (data) => { bus.$emit('updateStatistic', data) })

socket.on('updateSourcesOfVariation', (data) => { bus.$emit('updateSourcesOfVariation', data) })

// Demo

socket.on('startRun', (data) => { bus.$emit('startRun', data) })


export default bus
