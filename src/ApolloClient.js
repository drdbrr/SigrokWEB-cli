import { ApolloClient, HttpLink, ApolloLink, InMemoryCache, makeVar, from, setContext } from '@apollo/client';
import { createRef } from 'react';

export const sidVar = makeVar('');
export const stateVar = makeVar({ disabled: [], isRun: false });
export const channelsVar = makeVar({});

const ChannelsTypes = ['analog', 'logic'];

const customFetch = (uri, options) => {
    
//     const param = options.headers['x-custom-param'];
//     
//     if ( param )
//         return fetch(`${uri}${window.location.search}`, options);
    
    
    return fetch(`${uri}${window.location.search}`, options);
};

const link = new HttpLink({
    uri: '/sigrok',
    fetch: customFetch,
    includeExtensions: true,
});

const cache = new InMemoryCache({
    possibleTypes:{
        Session:["BlankSession", "DeviceSession"],
        Channel:["AnalogChannel", "LogicChannel"],
        Option: ["ValueOpt", "ListOpt", "VlOpt", "EmptyOpt"],
    },
    typePolicies:{
        Query:{
            fields:{
                options:{
                    merge(current, list){
                        const newState = {...stateVar()};
                        
                        list.forEach((item)=>{
                            if(item.__typename === 'VlOpt' || item.__typename === 'ValueOpt')
                                newState[item.keyName] = item.value
                        });
                        
                        stateVar(newState);
                        return list;
                    }
                },
                channelsList:{
                    merge(current, list){
                        /*
                        list.map((item, i)=>{
                            channelsVar({
                                ...channelsVar(),
                                [item.name]:
                                    {...item,
                                        lineRef: createRef(),
                                        rowRef: createRef(),
                                        [ ChannelsTypes.find((v)=> v === item.type ) + 'Ref' ]: createRef()
                                    } 
                            })
                            */
                            
                            
                            const newObject = list.reduce((a,v)=>({
                                ...a,
                                [v.name]: {
                                    ...v,
                                    lineRef: createRef(),
                                    rowRef: createRef(),
                                    [ ChannelsTypes.find((v)=> v === item.type ) + 'Ref' ]: createRef(),
                                } 
                            }), {});
                            
                            
                            /*
                            if (item.type === 'logic'){
                                //const testRef = useRef({text:item.text, color:item.color, enabled:item.enabled, traceHeight:item.traceHeight});
                                data[item.type] = { ...data[item.type], [item.name]:{ ...item, lineRef:createRef(), rowRef:createRef(), testRef:createRef() } };
                            }
                            else if (item.type === 'analog'){
                                data[item.type] = { ...data[item.type], [item.name]:{ ...item, lineRef:createRef(), rowRef:createRef(), logicLineRef:createRef() } };
                            }
                            */
                        //});
                        channelsVar(newObject);
                        return list;
                    },
                    //keyArgs:['name']
                },
            }
        },
    }
});

/*
class TestMiddleware extends ApolloLink {
    constructor() {
        super()
    }
    request (operation, forward) {
        operation.variables = {...operation.variables, omg:'wtf?'}
        
        operation.setContext((ctx) => ({
            headers:{
                ...ctx.headers,
                omg:'wtf?',
            },
        }));
        console.log('operation:', operation);
        return forward(operation)
    }
}
*/


const srNameSpace = [
    ['srmng', ['DeleteSession', 'CreateSession', 'SelectSession' ,'GetSessions', 'GetDriversList', 'getDecodersList']],
].reduce((obj, [value, keys]) => {
    for (const key of keys) {
        Object.defineProperty(obj, key, { value })
    }
    return obj
}, {})

const sidMiddleware = new ApolloLink((operation, forward) => {
    operation.extensions.srExt = [ srNameSpace[operation.operationName] ];
    
    const ctx = operation.getContext();
    operation.setContext((arg)=> {
        return({
        http: {
            includeExtensions: true,
        }})
    });
        
        /*
        //uri:'/OMG', //ATTENTION
        headers: {
            ...ctx.headers,
            credentials: 'include', //include, same-origin
            'client-name': 'Webrok',
            'client-version': '1.0.0',
        }
    })
    */

    //);

  return forward(operation);
})

export const Client = new ApolloClient({
    connectToDevTools: true,
    cache,
    //link: link,    
    link: from([sidMiddleware, link]),
    //link: new TestMiddleware().concat(link),
});
