// Turn a Mongoose ValidationError into a clean, client-safe plain object:
//   { error: "Validation failed", details: [ { field, message }, ... ] }
function formatValidationError(err) {
  const errors = (err && err.errors) || {};
  const details = Object.values(errors).map((e) => ({
    field: e.path,
    message: e.message,
  }));
  return { error: "Validation failed", details };
}

module.exports = { formatValidationError };
