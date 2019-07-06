import { connect } from "react-redux";
import loading from "../loading";
import LoadingComponent from "../../components/Loading";

const mapStateToProps = state => ({
  isLoading: loading.isLoading(state)
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadingComponent);
