const eventsReducer = (state = [], action) => {
    switch (action.type) {
        case "SET_EVENTS": {
            return action.events;
        }
        case "RESET_EVENTS": {
            return [];
        }
        case "ADD_EVENT": {
            return [...state, action.event];
        }
        case "UPDATE_EVENT": {
            return state.map((event) => {
                if (event.id === action.id) {
                    return {
                        ...event,
                        ...action.updates
                    }
                }
                return event
            })
        }
        case "REMOVE_EVENT": {
            return state.filter((event) => event.id !== action.id);
        }
        default: {
            return [];
        }
    }
};

export default eventsReducer;