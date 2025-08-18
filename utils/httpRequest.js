class HttpRequest {
    constructor() {
        this.baseUrl = 'https://spotify.f8team.dev/api/';
    }

    async _send(path, method, data, options = {}) {
        try {
            const _options = {
                ...options,
                method: method,
                headers: {
                    ...options.headers,
                    'Content-Type': 'application/json',
                },
            };
            if (data) {
                _options.body = JSON.stringify(data);
            }
            const res = await fetch(`${this.baseUrl}${path}`, _options);

            // Xử lý response rỗng (status 204)
            if (res.status === 204) {
                return {};
            }

            // Kiểm tra Content-Type của response
            const contentType = res.headers.get('Content-Type') || '';
            if (!res.ok) {
                const error = new Error(`HTTP error! status: ${res.status} ${res.statusText}`);
                error.response = contentType.includes('text/plain')
                    ? { message: await res.text() }
                    : await res.json().catch(() => ({}));
                error.status = res.status;
                throw error;
            }

            // Xử lý response dựa trên Content-Type
            if (contentType.includes('text/plain')) {
                const text = await res.text();
                return { message: text };
            }

            const response = await res.json().catch(() => ({}));
            return response;
        } catch (error) {
            console.log('Error in HTTP request:', error);
            throw error;
        }
    }


    async get(path, options = {}) {
        return await this._send(path, 'GET', null, options);
    }

    async post(path, data, options = {}) {
        return await this._send(path, 'POST', data, options);
    }

    async put(path, data, options = {}) {
        return await this._send(path, 'PUT', data, options);
    }

    async patch(path, data, options = {}) {
        return await this._send(path, 'PATCH', data, options);
    }

    async del(path, options = {}) {
        return await this._send(path, 'DELETE', null, options);
    }
}

const httpRequest = new HttpRequest();
export default httpRequest;