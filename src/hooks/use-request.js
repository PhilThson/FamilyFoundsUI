import { useState, useCallback } from "react";
import loadingStatus from "../helpers/loading-status";

const useRequest = () => {
  const [loadingState, setLoadingState] = useState(loadingStatus.default);

  const request = useCallback(
    async (url, method, content) => {
      setLoadingState(loadingStatus.isLoading);
      try {
        const headers = {
          "Accept": "application/json",
          "Content-Type": "application/json",
        };
        if (!method) {
          method = "GET";
        }
        let body = null;
        if (content) {
          body = JSON.stringify(content);
        }

        const response = await fetch(url, {
          method: method,
          headers: headers,
          body: body,
        });

        if (response.status >= 400 && response.status < 600) {
          let errorMessage = "An error occurred";
          if (response.status === 400) {
            errorMessage = "Bad request";
          } else if (response.status === 401) {
            errorMessage = "Unauthorized";
          } else if (response.status === 500) {
            errorMessage = "Server error";
          }

          throw new Error(errorMessage);
        }

        const result = await response.json();
        setLoadingState(loadingStatus.loaded);
        return result;
      } catch (error) {
        setLoadingState(loadingStatus.hasError);
        throw error;
      }
    }, []
  );

  return { request, loadingState };
};

export default useRequest;