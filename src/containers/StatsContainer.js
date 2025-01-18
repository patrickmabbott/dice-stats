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
        }
    } = state;

    return {
        isCalculationCurrent,
        primaryProbabilities,
        secondaryProbabilities,
        cumulativePrimaryProbabilities,
        cumulativeSecondaryProbabilities,
        averages,
        maxProbabilityEntriesToShow,
        mode
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