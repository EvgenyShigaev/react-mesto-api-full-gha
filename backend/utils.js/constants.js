// eslint-disable-next-line no-useless-escape
const URL_REGEX = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

// /(https?:\/\/)?([\w.-]+\.[\w]{2,})$/;

// const URL_REGEX = /(https?:\/\/)(www)?([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=])*#?$/;

module.exports = {
  URL_REGEX,
};
