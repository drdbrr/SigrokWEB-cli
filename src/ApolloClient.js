import { ApolloClient, HttpLink, ApolloLink, InMemoryCache, makeVar, from, setContext } from '@apollo/client';
import { createRef } from 'react';

export const sidVar = makeVar('');
export const cidVar = makeVar('');
export const selectedSessionVar = makeVar('');
export const runStateVar = makeVar(false);
export const channelsVar = makeVar({});


const link = new HttpLink({
    uri: '/sigrok',
});

const cache = new InMemoryCache({
    possibleTypes:{
        Session:["BlankSession", "DeviceSession"],
        Channel:["AnalogChannel", "LogicChannel"],
        Option:["ValueOpt", "ListOpt", "VlOpt", "EmptyOpt"],
    },
    typePolicies:{
        Query:{
            fields:{
                channelsList:{
                    merge(current, income){
                        let data = {...channelsVar()};
                        income.map((item, i)=>{
                            data = { ...data };
                            if (item.type === 'logic'){
                                //const testRef = useRef({text:item.text, color:item.color, enabled:item.enabled, traceHeight:item.traceHeight});
                                data[item.type] = { ...data[item.type], [item.name]:{ ...item, lineRef:createRef(), rowRef:createRef(), testRef:createRef() } };
                            }
                            else if (item.type === 'analog'){
                                data[item.type] = { ...data[item.type], [item.name]:{ ...item, lineRef:createRef(), rowRef:createRef(), logicLineRef:createRef() } };
                            }
                        });
                        channelsVar(data);
                        return income;
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

/*
const authMiddleware = new ApolloLink((operation, forward) => {
    operation.variables['omg'] = selectedSessionVar();
    return forward(operation);
})
*/

const sidMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
    headers: {
        ...headers,
        credentials: 'include', //include, same-origin
        'X-sid': selectedSessionVar(),
        'client-name': 'Webrok',
        'client-version': '1.0.0',
    }
  }));

  return forward(operation);
})

export const Client = new ApolloClient({
    connectToDevTools: true,
    cache,
    //link: link,    
    link: from([sidMiddleware, link]),
    //link: new TestMiddleware().concat(link),
});
