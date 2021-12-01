export function Comp() {
    const onRefChange = useCallback(node => {
        if (node === null) { 
            // DOM node referenced by ref has been unmounted
        } else {
            // DOM node referenced by ref has changed and exists
        }
    }, []); // adjust deps
    return <h1 ref={onRefChange}>Hey</h1>;
};

//useCallback is used to prevent double calling of ref callback with null and the element.
//You can trigger re-renders on change by storing the current DOM node with useState:

const [domNode, setDomNode] = useState(null);
const onRefChange = useCallback(node => {
  setDomNode(node); // trigger re-render on changes
  // ...
}, []); 
