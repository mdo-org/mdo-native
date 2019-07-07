export default function stringifyError(err, description) {
  if (err.message) return err.message;
  if (typeof err.error === "string") return err.error;
  if (typeof err.error_summary === "string") return err.error_summary;
  if (err.error && typeof err.error.error_summary === "string")
    return err.error.error_summary;
  if (description) return `Unkown error while ${description}.`;
  return "Unkown error.";
}
