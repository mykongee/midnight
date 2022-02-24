//@ts-check
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Node from './Node.jsx';

(function () {
  // document.querySelector('.add-color-button').addEventListener('click', () => {
  //   console.log('clicked');
  // });
  const vscode = acquireVsCodeApi();

  const App = () => {
    // console.log(vscode);

    const [vsState, setVsState] = React.useState(vscode.getState() || {state: "init"});
    const [tree, setTree] = React.useState([]);
    const [nodes, setNodes] = React.useState([]);
    // const nodes = [];

    React.useEffect(() => {
      window.addEventListener('click', () => {
        console.log('WINDOW CLICKED');
      });
    }, []);

    React.useEffect(() => {
      window.addEventListener('message', event => {
        const message = event.data; // postMessage -> {tree: newState}
        console.log('message received in react app', message);
        setVsState(message);
      });
    }, []);

    React.useEffect(() => {
      if (vsState.tree) {
        // console.log(vsState.tree[0]);
        update(vsState.tree);
      }
    }, [vsState]);

    const update = (arr) => {
      const newNodes = [];
      for (const node of arr) {
        console.log('update: ', node);
        newNodes.push(
          <Node name={node.name}/>
        );
          
        // nodes.push(node);
      }
      console.log(newNodes);
      setNodes(newNodes);
      console.log(nodes);
    };

    return (
      <div>
				<button onClick={() => console.log('clicked: ', vsState)}>TEST BUTTON</button>
        <h1>FROM REACT COMPONENT</h1>
        {/* <p>{vsState.state}</p> */}
        {nodes[0] ? nodes : 'no nodes'}
        {/* <p>{vsState.tree ? vsState.tree[0].name : 'nothing'}</p> */}
        <p>{vsState.test}</p>
      </div>
    );
  };

  ReactDOM.render(<App />, document.getElementById('root'));
}());