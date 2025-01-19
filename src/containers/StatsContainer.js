import { connect } from 'react-redux';
import StatsComponent from "../components/StatsComponent"
import { requestRecalculate, requestSetMode } from '../actions/StatisticsActions';

function mapStateToProps(state) {
    const {
        statisticsStore: { 
            isCalculationCurrent,
            primaryProbabilities,
            secondaryProbabilities,
            cumulativePrimaryProbabilities,
            cumulativeSecondaryProbabilities,
            averages,
            maxProbabilityEntriesToShow,
            mode
        },
        dicePoolStore : { currentDicePool },
    } = state;

    //Find the primary and secondary names for the current dice pool.
    

    return {
        isCalculationCurrent,
        primaryProbabilities,
        secondaryProbabilities,
        cumulativePrimaryProbabilities,
        cumulativeSecondaryProbabilities,
        averages,
        maxProbabilityEntriesToShow,
        mode,
        diceResultNames : currentDicePool.diceResultNames
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onRequestRecalculate : () => {
            return dispatch(requestRecalculate());
        },
        setMode : (mode) => {
            return dispatch(requestSetMode(mode));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsComponent);