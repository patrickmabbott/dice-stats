import { connect } from 'react-redux';
import { requestSetCurrentPool, requestSaveCurrentPool, requestClearCounts } from "../actions/DiePoolActions"
import DicePoolChooserComponent from "../components/DicePoolChooserComponent"

function mapStateToProps(state) {
    const {
        dicePoolStore: { 
            currentDicePool,
            dicePools
         }
    } = state;

    return {
        dicePool : currentDicePool,
        dicePools
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onSetDicePool : (poolName) => {
            dispatch(requestSetCurrentPool(poolName));
        },
        onSaveDicePool : (poolName) => {
            dispatch(requestSaveCurrentPool(poolName))
        },
        onClearCounts : () => {
            dispatch(requestClearCounts());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DicePoolChooserComponent);