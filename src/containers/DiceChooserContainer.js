import { connect } from 'react-redux';
import { requestAddDieToPool, requestRemoveDieToPool } from "../actions/DiePoolActions"
import DiceChooserComponent from "../components/DiceChooserComponent"

function mapStateToProps(state) {
    const {
        dicePoolStore: { currentDicePool },
        diceDefinitionStore : { definitions }
    } = state;

    return {
        dicePool : currentDicePool,
        definitions
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onChangeCount : (definition, countChange) => {
            if(countChange >= 1) {
                return dispatch(requestAddDieToPool(definition, countChange));
            }
            else if(countChange < 0) {
                return dispatch(requestRemoveDieToPool(definition, countChange));
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiceChooserComponent);