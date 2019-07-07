import { connect } from "react-redux";
import currentNode from "../currentNode";
import loading from "../loading";
import DirectoryComponent from "../../components/Directory";

const mapStateToProps = state => ({
  path: currentNode.getPath(state),
  contents: currentNode.getContents(state),
  isLoading: loading.isLoading(state)
});

const mapDispatchToProps = dispatch => ({
  onRefresh: () => dispatch(currentNode.refresh()),
  onOpenNode: node => dispatch(currentNode.set(node))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DirectoryComponent);
