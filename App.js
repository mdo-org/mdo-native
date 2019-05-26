import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Block from "./src/components/Block";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

const blocks = [{ text: "hello world" }];

const renderBlock = block => <Block key={block.text} block={block} />;

/* eslint react/prefer-stateless-function:[0] */
export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>MDo Native</Text>
        {blocks.map(renderBlock)}
      </View>
    );
  }
}
