import { connect } from "react-redux";
import currentNode from "../currentNode";
import fileSystem from "../fileSystem";
import loading from "../loading";
import DirectoryComponent from "../../components/Directory";

const mapStateToProps = state => ({
  path: currentNode.path(state),
  contents: currentNode.contents(state),
  isLoading: loading.isLoading(state)
});

const mapDispatchToProps = dispatch => ({
  onLogout: () => dispatch(fileSystem.reset()),
  onRefresh: () => dispatch(currentNode.refresh()),
  onOpenNode: node => dispatch(currentNode.set(node))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DirectoryComponent);
