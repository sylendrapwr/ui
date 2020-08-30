import { Action } from 'redux';
// eslint-disable-next-line import/named
import { SAVE_USER_SERIAL } from '../actions/app';

const initialState = {
  user: null
};

export default function setSerialNumber(
  state = initialState,
  action: Action<string>
) {
  switch (action.type) {
    case SAVE_USER_SERIAL:
      return {
        ...initialState,
        user: action.payload
      };
    default:
      return state;
  }
}
