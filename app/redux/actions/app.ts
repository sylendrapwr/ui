import { GetState, Dispatch } from '../reducers/types';
import { handleGitUpdate } from '../../helper';

export const SET_LAST_COMMIT = 'SET_LAST_COMMIT';
export const GET_LAST_COMMIT = 'GET_LAST_COMMIT';
export const SAVE_USER_SERIAL = 'SAVE_USER_SERIAL';

export function setLastCommit(commit) {
  return {
    types: SET_LAST_COMMIT,
    payload: commit
  };
}

export function getLastCommit() {
  return {
    type: GET_LAST_COMMIT
  };
}

export function getSerialNumber(data) {
  return {
    type: SAVE_USER_SERIAL,
    payload: data
  };
}
