import { connect } from 'react-redux';
import StatsComponent from "../components/StatsComponent"
import { requestRecalculate } from '../actions/StatisticsActions';

function mapStateToProps(state) {
    const {
        statisticsStore: { 
            isCalculationCurrent,
            probabilities,
            cumulativeProbabilities,
            mode
        }
    } = state;

    return {
        isCalculationCurrent,
        probabilities,
        cumulativeProbabilities,
        mode
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onRequestRecalculate : () => {
            return dispatch(requestRecalculate());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsComponent);