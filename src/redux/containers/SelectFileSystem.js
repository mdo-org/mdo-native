import { connect } from "react-redux";
import fileSystem from "../fileSystem";
import SelectFileSystem from "../../components/SelectFileSystem";

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => {
  return {
    onDropboxLogin: () => dispatch(fileSystem.useDropbox())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectFileSystem);
