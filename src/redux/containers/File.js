import { connect } from "react-redux";
import currentNode from "../currentNode";
import File from "../../components/File";

const mapStateToProps = state => ({
  path: currentNode.getPath(state),
  contents: currentNode.getContents(state)
});

const mapDispatchToProps = dispatch => ({
  onRefresh: () => dispatch(currentNode.refresh()),
  onUpdateBlockText: (index, text) =>
    dispatch(currentNode.updateBlockText({ index, text })),
  onMoveBlockUp: index => dispatch(currentNode.moveBlockUp({ index })),
  onMoveBlockDown: index => dispatch(currentNode.moveBlockDown({ index }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(File);
