import { connect } from 'react-redux';
import OptionsComponent from "../components/GameChooseComponent"
import { requestSetCurrentPool } from '../actions/DiePoolActions';

function mapStateToProps(state) {
    const {
        dicePoolStore: { 
            currentDicePool,
            dicePools
        }
    } = state;

    return {
        currentDicePool,
        dicePools
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setDicePool : (name) => {
            return dispatch(requestSetCurrentPool(name));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionsComponent);