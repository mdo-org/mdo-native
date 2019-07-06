import { connect } from "react-redux";
import fileSystem from "../fileSystem";
import currentNode from "../currentNode";
import RootComponent from "../../components/Root";

const mapStateToProps = state => ({
  isFileSystemSelected: fileSystem.isMounted(state),
  isCurrentNodeAFile: currentNode.isFile(state)
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RootComponent);
