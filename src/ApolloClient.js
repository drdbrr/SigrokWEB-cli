import { ApolloClient, HttpLink, InMemoryCache, makeVar/*, ApolloLink*/, ApolloLink, Observable } from '@apollo/client';

export const selectedSessionVar = makeVar('');
export const sessionVar = makeVar({});
export const channelsVar = makeVar({logic:[], analog:[]});
export const runStateVar = makeVar(false);

const cache = new InMemoryCache();

const link = new HttpLink({ uri: '/sigrok' });

/*
const queryRequiresVariable = ({ variableName, operation }) =>
    operation.query.definitions?.some(({ variableDefinitions }) =>
        variableDefinitions?.some(
            ({ variable }) => variable.name.value === variableName
        )
    );

const injectVariables = async operation => {
    const variableName = "id";
    if (queryRequiresVariable({variableName, operation})) {
        const id = selectedSessionVar();
        console.log("FOUND", operation.variables);
        console.log('cache.data.data.ROOT_QUERY:', cache.data.data.ROOT_QUERY);
        operation.variables[variableName] = id;
    }
};

const variableInjectionLink = new ApolloLink(
    (operation, forward) =>
        new Observable(observer => {
            let handle;
            Promise.resolve(operation)
            .then(oper => injectVariables(oper))
            .then(() => {
                handle = forward(operation).subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer)
                });
            })
            .catch(observer.error.bind(observer));
        return () => {
            if (handle) handle.unsubscribe();
        };
    })
);

export const Client = new ApolloClient({
    connectToDevTools: true,
    link: ApolloLink.from([
    variableInjectionLink,
    new HttpLink({
      uri: "/sigrok",
      credentials: "same-origin"
    })
  ]),
  cache
});
*/
export const Client = new ApolloClient({
    connectToDevTools: true,
    cache,
    link: link,    
});
