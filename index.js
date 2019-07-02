/* selective-proxy */
var http = require('http');
var https = require('https');
var SocksProxyAgent = require('socks-proxy-agent');
var agent = require('agent-base');
var HttpProxyAgent = require('http-proxy-agent');
var HttpsProxyAgent = require('https-proxy-agent');
var URL = require('url').URL;

// The custom agents to be used for each proxy protocol
var proxyAgents = {
    "socks": require('socks-proxy-agent'),
    "https": require('https-proxy-agent'),
    "http": require('http-proxy-agent')
};

// The Original Global Agents used by node.js
var originalAgents = {
    "http:": http.globalAgent,
    "https:": https.globalAgent
};
var protocols = Object.keys(proxyAgents);

module.exports = function (options) {

    options = options.length ? options : [options];

    var newOptions = restructureOptions(options);

    https.globalAgent = agent(agentCallback); // assigning custom agent passthrough to HTTP requests
    http.globalAgent = agent(agentCallback); // assigning custom agent passthrough to HTTPS requests

    // All-encompassing passthrough function
    function agentCallback(req, opts) {

        try {
            if (toBeProxied(opts.host.toLowerCase(), newOptions)) {
                // if host of the request is in the array of hosts, pass request on to the proxy, and use that agent
                return newOptions.proxies[newOptions.hosts[opts.host.toLowerCase()]][opts.uri.protocol];
            } else {
                // No more proxy. Use original HTTP agent
                throw "Host doesn't need to be proxied. Defaulting to no proxy. ";
            }
        } catch (e) {
            if (opts.uri) return originalAgents[opts.uri.protocol];
            return originalAgents["http:"];

        }
    }

}

function toBeProxied(host, options) {
    return !(!(options.hosts[host]));
}

function restructureOptions(options) {
    return {
        hosts: assembleHosts(options),
        proxies: assembleProxies(options)
    };
}

function assembleHosts(options) {
    var ret = {};
    options.forEach(function (collection, proxyIndex) {
        collection.hosts = collection.hosts.length ? collection.hosts : [collection.hosts];

        collection.hosts.forEach(function (host) {
            ret[host] = 'i' + proxyIndex;
        });
    });
    return ret;
}

function assembleProxies(options) {
    var ret = {};
    options.forEach(function (element, ind) {
        var elementURL = new URL(element.proxy);
        ret['i' + ind] = {
            "http:": elementURL.protocol.includes("http") ? new HttpProxyAgent(element.proxy) : new SocksProxyAgent(element.proxy),
            "https:": elementURL.protocol.includes("http") ? new HttpsProxyAgent(element.proxy) : new SocksProxyAgent(element.proxy),
        };
    });
    return ret;
}