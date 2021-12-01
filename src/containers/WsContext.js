import React, { createContext, useContext, useCallback, useState, useReducer, useEffect } from 'react';
//import { GET_SESSION } from "../operations/queries/getSession";
//import { GET_OPTIONS } from '../operations/queries/getOptions';
//import { useQuery, useReactiveVar, useApolloClient } from '@apollo/client';
import { stateVar, /*sidVar, channelsVar*/ } from '../ApolloClient';
//import SrLoading from '../components/SrLoading';

const SrCtx = createContext({});

const ConnectionLifecycle = {
    PRE_CREATED: 0,
    GOING_AWAY: 1,
    REFRESHING: 2,
    RESUMED: 3,
    PAUSED: 4,
    FINISHED: 5,
    DESTROYED: 6,
};

const initialState = {
    connectionStatus: ConnectionLifecycle.PRE_CREATED
};

const wsReducer = (state, { type, payload })=>{
    switch (type) {
        case 'INIT': {
            return { ...state, connectionStatus: ConnectionLifecycle.RESUMED };
        }
        case 'RECONNECTION_AFTER_RENDER': {
            return { ...state, connectionStatus: ConnectionLifecycle.REFRESHING };
        }
        case 'REFRESH_FAILED': {
            return { ...state, connectionStatus: ConnectionLifecycle.PRE_CREATED };
        }
        case 'REJOIN': {
            return { ...state,connectionStatus: ConnectionLifecycle.RESUMED };
        }
        case 'SESSION_PAUSED': {
            return { ...state, connectionStatus: ConnectionLifecycle.PAUSED };
        }
        case 'DISCONNECTED': {
            return { ...state, connectionStatus: ConnectionLifecycle.DESTROYED };
        }
        case 'GOING_AWAY': {
            return { ...state, connectionStatus: ConnectionLifecycle.GOING_AWAY };
        }
        default: {
            return state;
        }
    }
}

const useWs = (onOpen, onMessage, onClose) =>{
    const [ ws, setWs ] = useState(false);
    
    const updateOpenHandler = () => {
        if (!ws) return;
        ws.addEventListener('open', onOpen);
        return () => ws.removeEventListener('open', onOpen);
    };
    
    const updateMessageHandler = () => {
        if (!ws) return;
        ws.addEventListener('message', onMessage);
        return () => ws.removeEventListener('message', onMessage);
    };
    
    const updateCloseHandler = () => {
        if (!ws) return;
        ws.addEventListener('close', onClose);
        return () => ws.removeEventListener('close', onClose);
    };
    
    useEffect(updateOpenHandler, [ws, onOpen]);
    useEffect(updateMessageHandler, [ws, onMessage]);
    useEffect(updateCloseHandler, [ws, onClose]);
    
    const connect = useCallback(() =>{
        const conn = new WebSocket('ws://' + window.location.hostname + ':5000/srsocket');
        setWs(conn);
    }, []);
    
    const close = useCallback(() => {
        if (ws.readyState === ws.OPEN) ws.close(1001);
    }, [ws]);
    
    const sendMessage = (args) => {
        session.send(JSON.stringify(args));
    };
    
    return [connect, sendMessage, close];
};

const useConnectionPauseHandler = (state, dispatch) => {
    const [connectFn, setConnectFn] = useState(null);

    const disconnectCallback = useCallback(() => {
        if (state.connectionStatus !== ConnectionLifecycle.RESUMED)
            dispatch({ type: 'DISCONNECTED' });
    }, [dispatch, state.connectionStatus]);
    
    const pauseCallback = useCallback(() => {
        if (state.connectionStatus === ConnectionLifecycle.PRE_CREATED ||
            state.connectionStatus === ConnectionLifecycle.PAUSED) {
            
            console.log('expected disconnection');
            dispatch({ type: 'DISCONNECTED' });
        }
        else if (state.connectionStatus === ConnectionLifecycle.REFRESHING) {
            dispatch({ type: 'REFRESH_FAILED' });
        }
        /*
        else if (state.connectionStatus !== ConnectionLifecycle.GOING_AWAY) {
            console.log('unexpected disconnection');
            dispatch({ type: 'SESSION_PAUSED' });
            if (connectFn) connectFn(state.gameCode, null, state.playerId);
                setTimeout(disconnectCallback, 30 * 1000);
        }
        */
    }, [
        disconnectCallback,
        dispatch,
        connectFn,
        state.connectionStatus,
    ]);

    const registerConnectFunction = useCallback((fn) => {
        setConnectFn(() => fn);
    }, []);

    return [registerConnectFunction, pauseCallback];
};


const useConnectionCallback = () => {
    const callback = useCallback(() => {}, []);
    return callback;
};

const useMessageCallback = (dispatch) => {
    const callback = useCallback((ev) => {
        const data = JSON.parse(ev.data);
        console.log(data);
        if (data.context) dispatch({ type: data.context, payload: data });//TODO переделать dispatch в функцию управления reactVars
    }, [dispatch]);
    return callback;
};


const WsProvider = ({ children }) =>{
    //const id = sidVar();
    //const { cache } = useApolloClient();
    //const session = cache.readQuery({ query:'GET_SESSION', variables: {id:id} });
    //const { data: session, error, loading } = useQuery(GET_SESSION, {variables:{id:id}});
    
    const [state, dispatch] = useReducer(wsReducer, initialState);
    
    const onMessage = useMessageCallback(dispatch);
    const onOpen = useConnectionCallback();
    
    const [setConnectFn, onClose] = useConnectionPauseHandler(state, dispatch);
    
    const [connect, sendMessage, closeConn] = useWs(onOpen, onMessage, onClose);
    
    useEffect(() => {
        console.log('wiring everything...');
        setConnectFn(connect);
    }, [setConnectFn, connect]);
    
    //TODO
    const run = () =>{
        const { isRun } = stateVar();
        const data = { state: !isRun};
            
        if (!isRun){
            data.channels = []; //PUSH ENABLED CHANNELS NAMES
            Object.values(channelsVar()).forEach((ch, i)=>{if (ch.rowRef.current.visible) data.channels.push(ch.name)});
            
            //TODO добавть остальные параметры
        }
        sendMessage({ context: 'RUN', payload: data});  // payload: { samplerate: str, samplesNum: str, channels: [ chParams ], Run: bool }
    };
    
    const moveFOV = (data) => sendMessage({ context: 'VIEW', payload: data });  // payload: { X: int, Y:int, Scale: float }
    
    //if (loading) return <SrLoading />
    
    return(
        <SrCtx.Provider value={{run, moveFOV}}>
            {children}
        </SrCtx.Provider>
    )
}

export default WsProvider;
