import { connect } from "react-redux";
import HeaderComponent from "../../components/Header";
import fileSystem from "../fileSystem";
import currentNode from "../currentNode";

const mapStateToProps = state => ({
  includeBackButton: !currentNode.isRoot(state),
  includeLogoutButton: fileSystem.isMounted(state)
});

const mapDispatchToProps = dispatch => ({
  onGoBack: () => dispatch(currentNode.goBack()),
  onLogout: () => dispatch(fileSystem.reset())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderComponent);
