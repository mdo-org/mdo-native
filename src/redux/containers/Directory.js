import { connect } from "react-redux";
import currentNode from "../currentNode";
import DirectoryComponent from "../../components/Directory";

const mapStateToProps = state => ({
  path: currentNode.getPath(state),
  contents: currentNode.getContents(state)
});

const mapDispatchToProps = dispatch => ({
  onRefresh: () => dispatch(currentNode.refresh()),
  onOpenNode: node => dispatch(currentNode.set(node))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DirectoryComponent);
