import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
========================================
REQUEST INTERCEPTOR
========================================
*/

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("chatkaro_token");

    /*
    ========================================
    AUTH TOKEN
    ========================================
    */

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    /*
    ========================================
    FORMDATA / FILE UPLOAD
    ========================================
    
    FormData ke case me Content-Type
    manually set nahi karna hai.

    Browser automatically:
    multipart/form-data;
    boundary=....
    set karega.
    */

    if (
      config.data instanceof FormData
    ) {
      delete config.headers[
        "Content-Type"
      ];
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

/*
========================================
RESPONSE INTERCEPTOR
========================================
*/

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    console.error(
      "API ERROR:",
      error.response?.data ||
        error.message
    );

    if (
      error.response?.status === 401
    ) {
      localStorage.removeItem(
        "chatkaro_token"
      );

      localStorage.removeItem(
        "chatkaro_user"
      );
    }

    return Promise.reject(error);
  }
);

/*
========================================
GET
========================================
*/

export const get = (
  url,
  config = {}
) => {
  return api.get(
    url,
    config
  );
};

/*
========================================
POST
========================================
*/

export const post = (
  url,
  data = {},
  config = {}
) => {
  return api.post(
    url,
    data,
    config
  );
};

/*
========================================
PUT
========================================
*/

export const put = (
  url,
  data = {},
  config = {}
) => {
  return api.put(
    url,
    data,
    config
  );
};

/*
========================================
PATCH
========================================
*/

export const patch = (
  url,
  data = {},
  config = {}
) => {
  return api.patch(
    url,
    data,
    config
  );
};

/*
========================================
DELETE
========================================
*/

export const del = (
  url,
  config = {}
) => {
  return api.delete(
    url,
    config
  );
};

/*
========================================
DEFAULT EXPORT
========================================
*/

export default api;