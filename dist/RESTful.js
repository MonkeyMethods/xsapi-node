"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESTful = void 0;
class RESTful {
    defaultOptions;
    constructor(defaultOptions) {
        this.defaultOptions = defaultOptions;
    }
    post(url, data = {}) {
        return RESTful.post(url, { ...this.defaultOptions, ...data });
    }
    get(url, data = {}) {
        return RESTful.get(url, { ...this.defaultOptions, ...data });
    }
    delete(url, data = {}) {
        return RESTful.delete(url, { ...this.defaultOptions, ...data });
    }
    options(url, data = {}) {
        return RESTful.options(url, { ...this.defaultOptions, ...data });
    }
    put(url, data = {}) {
        return RESTful.put(url, { ...this.defaultOptions, ...data });
    }
    static post(url, data) {
        return fetch(url, {
            ...data,
            method: 'POST',
        });
    }
    static get(url, data) {
        return fetch(url, {
            ...data,
            method: 'GET',
        });
    }
    static delete(url, data) {
        return fetch(url, {
            ...data,
            method: 'DELETE',
        });
    }
    static options(url, data) {
        return fetch(url, {
            ...data,
            method: 'OPTIONS',
        });
    }
    static put(url, data) {
        return fetch(url, {
            ...data,
            method: 'PUT',
        });
    }
}
exports.RESTful = RESTful;
