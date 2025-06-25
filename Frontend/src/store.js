import {configureStore} from '@reduxjs/toolkit';


export const store = configureStore({
    
    reducer: {
        userDetails : (state = null, action) => {
            switch(action.type){
                case 'SET_USER' : return  action.payload;

                case 'CLEAR_USER' : return null;

                default: return state;


            }
        }
    },
    
})