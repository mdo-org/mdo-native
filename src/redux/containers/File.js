import { connect } from "react-redux";
import currentNode from "../currentNode";
import loading from "../loading";
import File from "../../components/File";

const mapStateToProps = state => ({
  path: currentNode.getPath(state),
  contents: currentNode.getContents(state),
  hasPendingChanges: currentNode.hasPendingChanges(state),
  isLoading: loading.isLoading(state)
});

const mapDispatchToProps = dispatch => ({
  onRunMDo: () => dispatch(currentNode.runMDo()),
  onSave: () => dispatch(currentNode.save()),
  onRefresh: () => dispatch(currentNode.refresh()),
  onToggleCheckbox: index => dispatch(currentNode.toggleCheckbox({ index })),
  onUpdateBlockText: (index, text) =>
    dispatch(currentNode.updateBlockText({ index, text })),
  onMoveBlockUp: index => dispatch(currentNode.moveBlockUp({ index })),
  onMoveBlockDown: index => dispatch(currentNode.moveBlockDown({ index })),
  onNewBlockBelow: index => dispatch(currentNode.onNewBlockBelow({ index }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(File);
