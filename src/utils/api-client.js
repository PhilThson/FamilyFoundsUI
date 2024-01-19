export async function client(endpoint, { body, isForm, ...customConfig } = {}) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }

  if (body) {
    if (isForm) {
      config.body = body;
      delete config.headers["Content-Type"];
    } else {
      config.body = JSON.stringify(body);
    }
  }

  let data
  try {
    const response = await window.fetch(endpoint, config);
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
      }
    }
    throw new Error(response.statusText)
  } catch (err) {
    return Promise.reject(err.message ? err.message : data)
  }
}

client.get = function (endpoint, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: "GET" });
}

client.post = function (endpoint, body, isForm, customConfig = {}) {
  return client(endpoint, { ...customConfig, body, isForm });
}

client.put = function (endpoint, body, customConfig = {}) {
  return client(endpoint, { ...customConfig, body, method: "PUT" });
}

client.delete = function (endpoint, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: "DELETE" });
}