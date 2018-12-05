import React, { Component } from "react";
import AceEditor from "react-ace";

import "brace/mode/json";
import "brace/theme/monokai";

const dgraph = require("dgraph-js-http");

const clientStub = new dgraph.DgraphClientStub("/");
const dgraphClient = new dgraph.DgraphClient(clientStub);

class App extends Component {
  state = {
    query: `query all($name: string) {
  movie(func: eq(name@sv, $name), first: 10) {
    uid
    name@sv
  }
}`,
    vars: `{
  "$name": "Den förlorade sonen"
}`
  };

  query = async () => {
    this.setState({ results: { status: "Loading..." } });
    const result = await dgraphClient
      .newTxn()
      .queryWithVars(this.state.query, JSON.parse(this.state.vars));

    this.setState({ results: result.data });
  };

  render() {
    return (
      <div>
        <div
          style={{
            display: "flex",
            flexFlow: "row wrap",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              display: "flex",
              flexBasis: "50%",
              flexDirection: "column"
            }}
          >
            <div>
              <h3>
                Query <button onClick={this.query}>Run</button>
              </h3>
              <AceEditor
                mode="json"
                showGutter={false}
                theme="monokai"
                name="foo"
                height={200}
                onChange={query => this.setState({ query })}
                value={this.state.query}
              />
            </div>
            <div>
              <h3>Vars</h3>
              <AceEditor
                mode="json"
                showGutter={false}
                theme="monokai"
                name="bar"
                height={200}
                onChange={vars => this.setState({ vars })}
                value={this.state.vars}
              />
            </div>
            <div>
              <h3>Examples</h3>
              <ul>
                <li><a href="#" onClick={() => this.setState({ query: `query all($name: string) {
  movie(func: eq(name@sv, $name), first: 10) {
    uid
    name@sv
  }
}`,
    vars: `{
  "$name": "Den förlorade sonen"
}`})}>Name as variable</a></li>
                <li><a href="#" onClick={() => this.setState({ query: `query {
  movie(func: eq(name@sv, "Den förlorade sonen"), first: 10) {
    uid
    name@sv
  }
}`,
    vars: `{
}`})}>Name as value</a></li>
              </ul>
            </div>
          </div>
          <div>
            <h3>Results</h3>
            <AceEditor
              mode="json"
              showGutter={false}
              theme="monokai"
              name="baz"
              readOnly
              height={460}
              value={JSON.stringify(this.state.results, null, 4)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
