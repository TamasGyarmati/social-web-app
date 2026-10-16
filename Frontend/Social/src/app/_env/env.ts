const host = 'localhost';
const port = 5000;

const apiUri = `http://${host}:${port}`;

export const env = {
  host,
  port,
  apiUri,

  authLoginUri: `${apiUri}/api/Auth/login`,
  authRegisterUri: `${apiUri}/api/Auth/register`,

  postGetAllUri: `${apiUri}/api/Post/all`,
  postUri: `${apiUri}/api/Post`,

  commentGetByPostIdUri: `${apiUri}/api/Comment/all`,
  commentUri: `${apiUri}/api/Comment`,

  whoamiUri: `${apiUri}/User/whoami`,
  userPostAvatarUri: `${apiUri}/User/avatar`,
  userUpdateUri: `${apiUri}/User/all`,
  userUpdatePasswordUri: `${apiUri}/User/password`,
  userUpdateEmailUri: `${apiUri}/User/email`,
  userDeleteUri: `${apiUri}/User/me`,
  userGetAllUri: `${apiUri}/User/all`,
  userGetByIdUri: `${apiUri}/User`,
  userFollowByIdUri: `${apiUri}/User/follow`,

  jwtAccessToken: 'social-access-token',
  jwtAccessTokenExp: 'social-access-token-expiration',
  jwtRefreshToken: 'social-refresh-token',
  jwtRefreshTokenExp: 'social-refresh-token-expiration',
};
