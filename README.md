# selective-proxy

This module helps users to use specific HTTP(S) and SOCKS5 proxies, for specific destination hosts. The module intercepts all outgoing HTTP(S) requests and uses the proxies only for the initalized hosts.

## Install

```bash
npm install --save selective-proxy
```

## Usage

Example:
```
require('selective-proxy')([{
    hosts:["maps.googleapis.com"],
    proxy: 'socks5://192.168.1.43:9999'
    }, {
    hosts:["www.hotmail.com"],
    proxy: 'http://192.168.1.99:8023'
}]);
```

The argument to the module can be either a single host-proxy combination, or an array of multiple combinations. The 'hosts' parameter too can be either a single host or an array of hosts to be used with the mentioned proxy. Proxies need to have protocols mentioned in the string, and need to be either HTTP(S) or SOCKS.

## TODO

Add support for PAC file proxy.
Add ability to use custom http Agents.