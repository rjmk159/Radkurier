// import { REHYDRATE } from 'redux-persist';


const INITIAL_STATE = {
  userDetails: {},
  isLoading:false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'REHYDRATE':
      if (action.key === 'persistEmail' && action.payload) {
        const newState = { ...state, ...action.payload };
        return newState;
      }
      return state;
    case 'SAVE_USER':
      return { ...state, userDetails: action.details, isLoading:false };
      case 'LOADING':
        return { ...state, isLoading: true };  
    case 'LOGOUT_USER':
      return { ...INITIAL_STATE };
    default:
      return { ...state };
  }
};
