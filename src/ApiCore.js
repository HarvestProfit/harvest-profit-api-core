import axios from 'axios';
import Cookie from 'js-cookie';

export const PER_PAGE_COUNT = 25;

/*
eslint no-underscore-dangle: ["error", {
  "allow": [
  "_delete",
  "_deleteAuthenticated",
  "_get",
  "_getAuthenticated",
  "_post",
  "_postAuthenticated",
  "_put",
  "_putAuthenticated",
  "_setInteceptor"]
}]
*/

/**
 * This class is used to make API requests to the main app server.
 * Re-Authentication is handled exclusively by this class.
 */
class ApiCore{
  constructor(url, token) {
    this.baseUrl = url;
    this.token = token;
    this.interceptor = this.setInteceptor();

  }

  /**
   * Setup interceptor to refresh tokens if necessary. Only useful for
   * authenticated API requests.
   * @private
   */
  setInteceptor() {
    axios.interceptors.response.use(response => response, (error) => {
      const original = error ? error.config : { url: '' };
      let responseCode = 0;
      if (error && error.response) {
        responseCode = error.response.status;
      }

      if (original && original.url.indexOf('refresh') === -1 && !original.harvest_retried && responseCode === 403) {
        original.harvest_retried = true;
        return new Promise((resolve, reject) => {
          this.getAuthenticated('/refresh').then((response) => {
            original.headers.Authorization = response.data.auth_token;
            return resolve(axios(original));
          }).catch((exception) => {
            return reject(exception);
          });
        });
      }
      return Promise.reject(error);
    });
  }

  /**
   * Performs a get request on the specified Url with optional parameters
   * @private
   * @param {string} url The url to make a request to
   * @param {object} params The params to add to the url
   */
  get(url, params = {}) {
    const apiUrl = this.baseUrl + url;
    return axios.get(apiUrl, {
      params,
    });
  }

  /**
   * Performs an authenticated get request on the specified Url with optional
   * parameters
   * @private
   * @param {string} url The url to make a request to
   * @param {object} params The params to add to the url
   */
  getAuthenticated(url, params = {}) {
    const apiUrl = this.baseUrl + url;
    return axios.get(apiUrl, {
      params,
      headers: {
        Authorization: this.token,
      },
    });
  }

  /**
   * Performs a post request on the specified Url with optional parameters
   * @private
   * @param {string} url The url to make a request to
   * @param {object} data The data to post
   */
  post(url, data = {}) {
    const apiUrl = this.baseUrl + url;
    return axios.post(apiUrl, data);
  }

  /**
   * Performs an authenticated post request on the specified Url with optional
   * parameters
   * @private
   * @param {string} url The url to make a request to
   * @param {object} data The data to post
   */
  postAuthenticated(url, data = {}) {
    const apiUrl = this.baseUrl + url;
    return axios.post(apiUrl, data, {
      headers: {
        Authorization: this.token,
      },
    });
  }

  /**
   * Performs a put request on the specified Url with optional parameters
   * @private
   * @param {string} url The url to make a request to
   * @param {object} data The data to post
   */
  put(url, data = {}) {
    const apiUrl = this.baseUrl + url;
    return axios.put(apiUrl, data);
  }

  /**
   * Performs an authenticated put request on the specified Url with optional
   * parameters
   * @private
   * @param {string} url The url to make a request to
   * @param {object} data The data to post
   */
  putAuthenticated(url, data = {}) {
    const apiUrl = this.baseUrl + url;
    return axios.put(apiUrl, data, {
      headers: {
        Authorization: this.token,
      },
    });
  }

  /**
   * Performs a delete request on the specified Url with optional parameters
   * @private
   * @param {string} url The url to make a delete request to
   * @param {object} params The params to add to the url
   */
  delete(url, params = {}) {
    const apiUrl = this.baseUrl + url;
    return axios.delete(apiUrl, {
      params,
    });
  }

  /**
   * Performs an authenticated delete request on the specified Url with optional
   * parameters
   * @private
   * @param {string} url The url to make a delete request to
   * @param {object} params The params to add to the url
   */
  deleteAuthenticated(url, params = {}) {
    const apiUrl = this.baseUrl + url;
    return axios.delete(apiUrl, {
      params,
      headers: {
        Authorization: this.token,
      },
    });
  }
}

export default ApiCore;
