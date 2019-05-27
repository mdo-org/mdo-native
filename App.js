import React from "react";
import { StyleSheet, Text, View } from "react-native";
import key from "weak-key";

// TODO: for some reason, the following code does not work:
// ```
// import MDo from "@mdo-org/mdo-core/lib/strings"
// ```
// So, I'm currently doing the following ugly hack:
//   1. on package.json:
//     "prestart": "cp ./node_modules/@mdo-org/mdo-core/lib/strings/index.js ./mdo-core.js"
//   2. importing from ./mdo-core.js
import MDo from "./mdo-core";

import Block from "./src/components/Block";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

const initialText = `
Hello MDo.

# Work
- [ ] Spreadsheet all the things
  @start tomorrow

# Home
Tasks I plan to work on when I'm done with work.

- [X] Take out trash
- [ ] Fix the basement light
  Not sure what's going on.

  Faulty light bulb?
`.trim();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blocks: []
    };
  }

  componentDidMount() {
    this.parseFile();
  }

  parseFile() {
    MDo.parse(initialText).then(blocks => this.setState({ blocks }));
  }

  /* eslint react/destructuring-assignment:[0] */
  render() {
    return (
      <View style={styles.container}>
        <Text>MDo Native</Text>
        {this.state.blocks.map(block => (
          <Block key={key(block)} block={block} />
        ))}
      </View>
    );
  }
}
