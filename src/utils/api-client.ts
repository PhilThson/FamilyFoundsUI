import {
  FetchError,
  FetchClientData,
  IAuthenticateResponse,
  ApiClientResponse,
  IMyRequestInit,
} from "../models/Main";
import { REFRESH_TOKEN_URL } from "../settings/constants";
import { AppDispatch } from "../store";
import { authSliceActions } from "../store/auth-slice";

export async function client(endpoint: string, fetchData: FetchClientData) {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (fetchData.auth?.isLoggedIn) {
    headers["Authorization"] = `Bearer ${fetchData.auth.accessToken}`;
  }

  const config: IMyRequestInit = {
    method: fetchData.method,
    ...fetchData.customConfig,
    headers: {
      ...headers,
      ...fetchData.customConfig?.headers,
    },
    credentials: "include",
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
    console.log("Endpoint:", endpoint);
    console.log("Config:", config as RequestInit);
    const response = await window.fetch(endpoint, config as RequestInit);
    try {
      data = await response.json();
    } catch (err) {
      console.log("No data from HTTP Response");
    }
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

async function clientRetryWrapper(
  endpoint: string,
  fetchData: FetchClientData,
  dispatch?: AppDispatch,
  isRetry = false
): Promise<ApiClientResponse> {
  try {
    console.log("Inside Retry wrapper");
    return await client(endpoint, fetchData);
  } catch (clientError) {
    console.log("Error catched in Retry wrapper");
    if (clientError as FetchError) {
      console.log("Fetch error:", clientError);
      const statusCode = (clientError as FetchError).statusCode;
      if (statusCode === 401 && !isRetry && fetchData.auth?.isLoggedIn) {
        console.log("Retrying request...");
        try {
          //get new JWT based on refresh token
          const refreshTokenResponse = await fetch(REFRESH_TOKEN_URL, {
            method: "POST",
            headers: {
              Accept: "application/json",
            },
          });
          const data = await refreshTokenResponse.json();
          fetchData.auth.accessToken = (data as IAuthenticateResponse).jwtToken;
          if (dispatch) {
            //update Auth store
            dispatch(
              authSliceActions.updateLoginState(data as IAuthenticateResponse)
            );
          }
          //retry first request with new token and retry flag
          return await clientRetryWrapper(endpoint, fetchData, undefined, true);
        } catch (err) {
          //error on retry or reauth
          let msg = "Retry failed.";
          console.error(msg);
          if (err instanceof FetchError) {
            msg = msg + " " + (err as FetchError).message;
          } else {
            msg += " Please login.";
          }
          return Promise.reject(msg);
        }
      } else {
        //other than 401 response
        //or is second retry
        //or user is not logged in
        console.log("Other than 401 response");
        return Promise.reject((clientError as FetchError)?.message);
      }
    } else {
      console.log("Not a FetchError:", clientError);
      //not a FetchError hence re-throw (possibly data inside)
      return Promise.reject(
        (clientError as Error)?.message
          ? (clientError as Error)?.message
          : "Failed to fetch"
      );
    }
  }
}

client.get = function (
  endpoint: string,
  fetchData: FetchClientData,
  dispatch?: AppDispatch
) {
  fetchData.method = "GET";
  return clientRetryWrapper(endpoint, fetchData, dispatch);
};

client.post = function (
  endpoint: string,
  fetchData: FetchClientData,
  dispatch?: AppDispatch
) {
  fetchData.method = "POST";
  return clientRetryWrapper(endpoint, fetchData, dispatch);
};

client.put = function (
  endpoint: string,
  fetchData: FetchClientData,
  dispatch?: AppDispatch
) {
  fetchData.method = "PUT";
  return clientRetryWrapper(endpoint, fetchData, dispatch);
};

client.delete = function (
  endpoint: string,
  fetchData: FetchClientData,
  dispatch?: AppDispatch
) {
  fetchData.method = "DELETE";
  return clientRetryWrapper(endpoint, fetchData, dispatch);
};
