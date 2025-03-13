import WebApp from "@twa-dev/sdk";


export const ACCESS_TOKEN_NAME = "access_token";
export const USER_ID_NAME = "user_id";
export const IS_FIRST_START = "is_first_start";


export const saveAccessToken = (accessToken: string) => {
  return new Promise((resolve, reject) => {
    WebApp.CloudStorage.setItem(ACCESS_TOKEN_NAME, accessToken, (error, result) => {
      if (error || !result) reject(error);
      else resolve(result!);
    });
  });
};

export const removeAccessToken = () => {
  return new Promise((resolve, reject) => {
    WebApp.CloudStorage.removeItem(ACCESS_TOKEN_NAME, (error, result) => {
      if (error || !result) reject(error);
      else resolve(result!);
    });
  });
};

export const saveUserId = (userId: number) => {
  return new Promise((resolve, reject) => {
    WebApp.CloudStorage.setItem(USER_ID_NAME, userId.toString(), (error, result) => {
      if (error || !result) reject(error);
      else resolve(result!);
    });
  });
};

export const removeUserId = () => {
  return new Promise((resolve, reject) => {
    WebApp.CloudStorage.removeItem(USER_ID_NAME, (error, result) => {
      if (error || !result) reject(error);
      else resolve(result!);
    });
  });
};

export const saveIsFirstStart = (is_first_start: string) => {
  return new Promise((resolve, reject) => {
    WebApp.CloudStorage.setItem(IS_FIRST_START, is_first_start, (error, result) => {
      if (error || !result) reject(error);
      else resolve(result!);
    });
  });
};
