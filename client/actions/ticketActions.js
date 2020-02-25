/**
 * ************************************
 *
 * @module  ticketActions.js
 * @author team snapdesk
 * @date 02/22/2020
 * @description Action Creators for ticketReducer
 *
 * ************************************
 */

// import actionType constants
import axios from 'axios';
import * as types from '../constants/actionTypes';

export const postTicket = () => (dispatch, getState) =>
  // this part is why thunk is necessary to delay the firing of the dispatch handlers
  axios
    .post('/api/tickets', {
      // POST request to create a new ticket
      mentee_id: getState().user.userId,
      message: getState().tickets.messageInput,
      status: 'active',
      snaps_given: getState().tickets.messageRating,
    })
    .then(({ data }) => {
      // check if the returned user is logged in, if not, reroute
      if (!data.isLoggedIn) {
        dispatch({
          type: types.USER_LOGIN,
          payload: data,
        })
      }
      else {
        // if they're still logged in, continue with new ticket request
        dispatch({
          type: types.POST_TICKET,
          payload: data,
        })
      }     
    })

export const getTickets = () => dispatch =>
  // get all active tickets from the DB. the timer for this is configurable from FeedContainer.jsx
  axios
    .get('/api/tickets')
    .then(({ data }) => {
      if (!data.isLoggedIn) {
        dispatch({
          type: types.USER_LOGIN,
          payload: data,
        })
      }
      // if the user is logged in, get all active tickets. if the DB request returns undefined, forward an empty array to reducer.
      else {
        dispatch({
          type: types.GET_TICKETS,
          payload: data.activeTickets || [],
        })
      }     
    })

export const updateMessage = event => ({
  type: types.UPDATE_MESSAGE,
  payload: event.target.value,
});

export const updateRating = event => ({
  type: types.UPDATE_RATING,
  payload: event.target.value,
});

export const deleteTicket = id => (dispatch, getState) =>
  // don't actually delete the ticket from the DB, just set status to deleted so it isn't displayed
  axios
    .put('/api/tickets/delete', {
      ticketId: id,
      status: 'deleted',
    })
    .then(({ data }) => {
      if (!data.isLoggedIn) {
        dispatch({
          type: types.USER_LOGIN,
          payload: data,
        })
      }
      else {
        dispatch({
          type: types.DELETE_TICKET,
          payload: id,
        })
      }     
    })
    
// none of these are working yet
export const resolveTicket = id => ({
  type: types.RESOLVE_TICKET,
  payload: id,
})

export const acceptTicket = id => ({
  type: types.ACCEPT_TICKET,
  payload: id,
})

export const cancelAccept = id => ({
  type: types.CANCEL_ACCEPT,
  payload: id,
})
