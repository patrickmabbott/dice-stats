import { combineReducers } from 'redux'
import DiePoolReducer from './DiePoolReducer'
import StatisticsReducer from './StatisticsReducer'
import DiceDefinitionReducer from './DiceDefinitionReducer'

export default combineReducers({
    dicePoolStore : DiePoolReducer,
    diceDefinitionStore : DiceDefinitionReducer,
    statisticsStore : StatisticsReducer
});