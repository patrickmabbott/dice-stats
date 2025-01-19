import { combineReducers } from 'redux'
import DiePoolReducer from './DicePoolReducer'
import StatisticsReducer from './StatisticsReducer'
import DiceDefinitionReducer from './DiceDefinitionReducer'
import OptionsReducer from './OptionsReducer'

export default combineReducers({
    dicePoolStore : DiePoolReducer,
    diceDefinitionStore : DiceDefinitionReducer,
    statisticsStore : StatisticsReducer,
    optionsStore : OptionsReducer
});