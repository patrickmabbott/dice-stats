import { connect } from 'react-redux';
import OptionsComponent from "../components/OptionsComponent"
import { requestSetGame } from '../actions/OptionsActions';

function mapStateToProps(state) {
    const {
        optionsStore: { 
            game
        }
    } = state;

    return {
        game
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setGame : (game) => {
            return dispatch(requestSetGame(game));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionsComponent);