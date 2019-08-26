import { connect } from 'react-redux';
import DiceChooserComponent from "../components/DiceChooserComponent"

function mapStateToProps(state) {
    console.log(`TCL: mapStateToProps -> state`, state)
    const {
        dicePoolStore: { dicePools, currentDicePool }
    } = state;
    return {
        dicePool : currentDicePool
    };
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiceChooserComponent);