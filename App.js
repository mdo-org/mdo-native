import React from "react";
import { StyleSheet, Text, View } from "react-native";
import key from "weak-key";
import MDo from "@mdo-org/mdo-core/lib/strings/index";
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
    MDo.parse(initialText)
      .then(blocks => this.setState({ blocks }))
      .catch(err => console.error(err));
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
