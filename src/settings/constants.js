export const BASE_HTTPS_API_URL = process.env.REACT_APP_BASE_HTTPS_API_URL;
export const BASE_AUTH_API_URL = process.env.REACT_APP_BASE_AUTH_API_URL;
export const TRANSACTIONS_URL = `${BASE_HTTPS_API_URL}/transactions`;
export const CATEGORIES_URL = `${BASE_HTTPS_API_URL}/categories`;
export const IMPORT_SOURCES_URL = `${BASE_HTTPS_API_URL}/importSources`;
export const AUTH_URL = `${BASE_AUTH_API_URL}/authenticate`;
export const REFRESH_TOKEN_URL = `${BASE_AUTH_API_URL}/refreshToken`