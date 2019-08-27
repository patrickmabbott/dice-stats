import { connect } from 'react-redux';
import { requestAddDieToPool } from "../actions/DiePoolActions"
import DiceChooserComponent from "../components/DiceChooserComponent"

function mapStateToProps(state) {
    console.log(`TCL: mapStateToProps -> state`, state)
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiceChooserComponent);