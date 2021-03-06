import { produce } from 'immer'
import {
  NEW_INCIDENT_CHANGE_STAGE,
  NEW_INCIDENT_RESET,
  NEW_INCIDENT_TYPE_SELECT,
} from '../actions/newIncident'

const defaultState = {
  selectedIncident: null,
  isFirstStage: true,

  query: '한국과학기술원 N1 404',
  map: {
    lat: 36.374159,
    lng: 127.365864,
  },
}

export default (state = defaultState, action) =>
  produce(state, draftState => {
    const draft = draftState

    switch (action.type) {
      case NEW_INCIDENT_RESET: {
        draft.isFirstStage = true
        draft.selectedIncident = null
        return
      }

      case NEW_INCIDENT_TYPE_SELECT: {
        draft.selectedIncident = action.payload
        return
      }

      case NEW_INCIDENT_CHANGE_STAGE: {
        draft.isFirstStage = !draft.isFirstStage
        return
      }

      default:
        return
    }
  })
