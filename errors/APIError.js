class APIError extends Error {
  constructor(state, mess) {
    super();
    this.message = mess;
    this.status = state;
  }

  static badRequest(mess) {
    return new APIError(404, mess);
  }
}

module.exports = APIError;
