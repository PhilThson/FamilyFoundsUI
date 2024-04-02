import { FetchError, IAuthState, FetchClientData } from "../models/Main";
import { REFRESH_TOKEN_URL } from "../settings/constants";

export async function client(endpoint: string, fetchData: FetchClientData) {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (fetchData.auth?.isLoggedIn) {
    headers["Authorization"] = `Bearer ${fetchData.auth.accessToken}`;
  }

  const config = {
    method: fetchData.method,
    body: {},
    ...fetchData.customConfig,
    headers: {
      ...headers,
      ...fetchData.customConfig?.headers,
    },
  };

  if (fetchData.body) {
    if (fetchData.isForm) {
      config.body = fetchData.body;
    } else {
      config.headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(fetchData.body);
    }
  }

  let data;
  try {
    const response = await window.fetch(endpoint, config as RequestInit);
    try {
      data = await response.json();
    } catch (err) {
      console.log("No data from HTTP Response");
    }
    console.log(response);
    if (response.ok) {
      return {
        status: response.status,
        data,
        headers: response.headers,
        url: response.url,
      };
    }

    throw new FetchError(response.statusText, response.status);
  } catch (err) {
    return Promise.reject(
      (err as FetchError)?.message ? (err as FetchError)?.message : data
    );
  }
}

// async function clientRetryWrapper(props) {
//   try {

//   } catch (err) {
//     if (response.status == 401 && !isRetry && customConfig.auth?.isLoggedIn) {
//       try {
//         const refreshTokenResponse = await window.fetch(REFRESH_TOKEN_URL, {
//           method: "POST",
//           headers: {
//             Accept: "application/json",
//           },
//         });
//         const data = await refreshTokenResponse.json();
//       } catch (err) {
//         console.error(
//           "Failed to reauthenticate with refresh token. Please login"
//         );
//       }
//     }
//   }
// }

client.get = function (endpoint: string, fetchData: FetchClientData) {
  fetchData.method = "GET";
  return client(endpoint, fetchData);
};

client.post = function (endpoint: string, fetchData: FetchClientData) {
  fetchData.method = "POST";
  return client(endpoint, fetchData);
};

client.put = function (endpoint: string, fetchData: FetchClientData) {
  fetchData.method = "PUT";
  return client(endpoint, fetchData);
};

client.delete = function (endpoint: string, fetchData: FetchClientData) {
  fetchData.method = "DELETE";
  return client(endpoint, fetchData);
};
