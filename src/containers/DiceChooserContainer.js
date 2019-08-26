import { connect } from 'react-redux';

function mapStateToProps(state) {
    const {
        dicePool: { dicePool }
    } = state;
    return {
        dicePool
    };
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiceChooserComponent);