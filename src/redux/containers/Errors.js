import { connect } from "react-redux";
import errors from "../errors";
import ErrorsComponent from "../../components/Errors";

const mapStateToProps = state => ({
  errors: errors.all(state)
});

const mapDispatchToProps = dispatch => ({
  onErrorsDismiss: () => dispatch(errors.reset())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorsComponent);
