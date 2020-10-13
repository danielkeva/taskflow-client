import { createSelector } from "reselect";

const currBoard = state => state.board.currBoard;

export const selectCurrBoard = createSelector(
    currBoard,
    board => board
);
