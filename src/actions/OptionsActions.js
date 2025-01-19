import { store } from "..";

export const SET_GAME = 'SET_GAME';

function dispatchSetGame(game) {
    return {
        type : SET_GAME,
        game
    }
}

export function requestSetGame(game) {
    return (dispatch) => {
        return dispatch(dispatchSetGame(game));
    }
}