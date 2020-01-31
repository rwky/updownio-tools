const https = require('https');
const ipv4 = []
const ipv6 = []
const getIPs = () => {
    return new Promise((resolve, reject) => {
        let response = '';
        console.log('Getting IPs')
        let req = https.request('https://updown.io/api/nodes', {}, (res) => {
            res.on('data', d => {
               response += d.toString('utf8') 
            });
            res.on('end', () => {
                console.log('Fetched ips')
                response = Object.values(JSON.parse(response))
                response.map((v) => {
                    if (v.ip) {
                        ipv4.push(v.ip)
                    }
                    if (v.ip6) {
                        ipv6.push(v.ip6)
                    }
                });
                resolve([ipv4, ipv6])
            })
        });
        req.on('error', (error) => {
            reject(error)
        }); 
        req.end();
    });
}

module.exports = getIPs;
