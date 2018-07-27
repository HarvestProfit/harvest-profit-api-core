import ApiCore from '../src/ApiCore';
import moxios from 'moxios';
import Cookie from 'js-cookie';

describe('Api', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
    Cookie.remove('harvest_profit');
  });

  describe('Basic Api requests', () => {
    let params = {
      name: 'Harvest',
      email: 'harvest@harvestprofit.com'
    }
    let apiCore = new ApiCore('harvestprofit.com', 'abc123');
    beforeEach(() => {
      moxios.wait(function () {
        let request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
        });
      });
    });

    it('it should make a get request', async () => {
      await apiCore.get('/endpoint', params)
      .then(function (response) {
        expect(response.status).toEqual(200);
      });
    });

    it('it should make a post request', async () => {
      await apiCore.post('/create', params)
      .then(function (response) {
        expect(response.status).toEqual(200);
      });
    })

    it('it should make a put request', async () => {
      await apiCore.put('/update', params)
      .then(function (response) {
        expect(response.status).toEqual(200);
      });
    });

    it('it should make a delete request', async () => {
      await apiCore.delete('/delete', params)
      .then(function (response) {
        expect(response.status).toEqual(200);
      });
    });
  });

  describe('Authenticated Api requests', () => {
    let params = {
      name: 'Harvest',
      email: 'harvest@harvestprofit.com'
    };
    let apiCore = new ApiCore('harvestprofit.com', 'abc123');
    beforeEach(() => {
      moxios.wait(function () {
        let request = moxios.requests.mostRecent()
        request.respondWith({
          status: apiCore.token == 'abc123' ? 202 : 401,
        });
      });
    });

    it('it should make an authenticated get request', async () => {
      apiCore.token = 'abc123';
      await apiCore.getAuthenticated('/secureEndpoint', params)
      .then(function (response) {
        expect(response.status).toEqual(202);
      })
    });

    it('it should fail to make an authenticated get request', async () => {
      apiCore.token = 'wrongtoken';
      await apiCore.getAuthenticated('/secureEndpoint', params)
      .then(function (response) {
        expect(response.status).toEqual(202);
      })
      .catch(function (error) {
        expect(error.response.status).toEqual(401);
      });
    });

    it('it should make an authenticated post request', async () => {
      apiCore.token = 'abc123';
      await apiCore.postAuthenticated('/secureEndpoint', params)
      .then(function (response) {
        expect(response.status).toEqual(202);
      });
    });

    it('it should fail to make an authenticated post request', async () => {
      apiCore.token = 'wrongtoken';
      await apiCore.postAuthenticated('/secureEndpoint', params)
      .then(function (response) {
        expect(response.status).toEqual(202);
      })
      .catch(function (error) {
        expect(error.response.status).toEqual(401);
      });
    });

    it('it should make an authenticated put request', async () => {
      apiCore.token = 'abc123';
      await apiCore.putAuthenticated('/secureEndpoint', params)
      .then(function (response) {
        expect(response.status).toEqual(202);
      });
    });

    it('it should fail to make an authenticated put request', async () => {
      apiCore.token = 'wrongtoken';
      await apiCore.putAuthenticated('/secureEndpoint', params)
      .then(function (response) {
        expect(response.status).toEqual(202);
      })
      .catch(function (error) {
        expect(error.response.status).toEqual(401);
      });
    });

    it('it should make an authenticated delete request', async () => {
      apiCore.token = 'abc123';
      await apiCore.deleteAuthenticated('/secureEndpoint', params)
      .then(function (response) {
        expect(response.status).toEqual(202);
      });
    });

    it('it should fail to make an authenticated delete request', async () => {
      apiCore.token = 'wrongtoken';
      await apiCore.deleteAuthenticated('/secureEndpoint', params)
      .then(function (response) {
        expect(response.status).toEqual(202);
      })
      .catch(function (error) {
        expect(error.response.status).toEqual(401);
      });
    });
  });

  describe('Interceptor refresh test', () => {
    let apiCore = new ApiCore('harvestprofit.com', 'abc123');
    let params = {
      name: 'Harvest',
      email: 'harvest@harvestprofit.com'
    };
    beforeEach(() => {
      moxios.wait(function () {
        let request = moxios.requests.at(0);
        request.respondWith({
          status: 403,
        });
        moxios.wait(function () {
          let request = moxios.requests.at(1);
          request.respondWith({
            status: 200,
            response: {
              auth_token: 'abc123',
            }
          });
          moxios.wait(function () {
            let request = moxios.requests.at(2);
            request.respondWith({
              status: 200,
              response: {
                value: true
              }
            });
          });
        });
      });
    });

    it('token should be refreshed', async () => {
      apiCore.token = 'wrongtoken';
      await apiCore.get('/anything', params)
      .then((response) => {
        expect(response.data.value).toEqual(true);
      })
    });
  });

  describe('Interceptor failed refresh test', () => {
    let apiCore = new ApiCore('harvestprofit.com', 'abc123');
    let params = {
      name: 'Harvest',
      email: 'harvest@harvestprofit.com'
    };
    beforeEach(() => {
      moxios.wait(function () {
        let request = moxios.requests.at(0);
        request.respondWith({
          status: 403,
        });
        moxios.wait(function () {
          let request = moxios.requests.at(1);
          request.respondWith({
            status: 405,
          });
        });
      });
    });

    it('expired token', async () => {
      apiCore.token = 'wrongtoken';
      await apiCore.get('/anything', params)
      .then((response) => {
      })
      .catch((error) => {
        expect(error.response.status).toEqual(405);
      })
    });
  });
});
