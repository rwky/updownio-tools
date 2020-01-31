const https = require('https');
const defaultOptions = {
    headers: {
        'X-Auth-Email': process.env.EMAIL,
        'X-Auth-Key': process.env.KEY,
        'Content-Type': 'application/json'
    }
}
const clone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
}
const getIPs = require('./get-ips.js')

const getExistingRules = () => {
    return new Promise((resolve, reject) => {
        let options = clone(defaultOptions)
        let response = '';
        options.method = 'GET'
        console.log('Getting existing rules')

        let req = https.request('https://api.cloudflare.com/client/v4/zones/' + process.env.ZONE + '/firewall/access_rules/rules?per_page=1000&notes=updownio', options, (res) => {
            res.on('data', d => {
               response += d.toString('utf8') 
            });
            res.on('end', () => {
                console.log('Fetched rules')
                resolve(JSON.parse(response))
            })
        });
        req.on('error', (error) => {
            reject(error)
        }); 
        req.end();
    });
}

const deleteExistingRule = (rule) => {
    return new Promise((resolve, reject) => {
        let options = clone(defaultOptions)
        let data = '';
        let response = '';
        options.method = 'DELETE'
        console.log('Deleting ' + rule.id)
        let req = https.request('https://api.cloudflare.com/client/v4/zones/' + process.env.ZONE + '/firewall/access_rules/rules/' + rule.id, options, (res) => {
            res.on('data', d => {
               response += d.toString('utf8') 
            });
            res.on('end', () => {
                console.log('Deleted ' + rule.id)
                resolve(response)
            })
        });
        req.on('error', (error) => {
            reject(error)
        }); 
        req.write(data)
        req.end();
    });
}

const addRule = (ip, ipv6 = false) => {
    return new Promise((resolve, reject) => {
        let options = clone(defaultOptions)
        let data = {
            mode: "whitelist",
            configuration: {
                target: (ipv6 ? "ip6" : "ip"),
                value: ip
            },
            notes: "updownio"
        };
        let response = '';
        options.method = 'POST'
        console.log('Adding ' + ip)
        let req = https.request('https://api.cloudflare.com/client/v4/zones/' + process.env.ZONE + '/firewall/access_rules/rules', options, (res) => {
            res.on('data', d => {
               response += d.toString('utf8') 
            });
            res.on('end', () => {
                console.log('Added ' + ip)
                resolve(response)
            })
        });
        req.on('error', (error) => {
            reject(error)
        }); 
        req.write(JSON.stringify(data))
        req.end();
    });
}


async function run() {
    let [ipv4, ipv6] = await getIPs()
    let rules = await getExistingRules()
    for(let rule of rules.result) {
        await deleteExistingRule(rule);
    }
    for(ip of ipv4) {
        await addRule(ip)
    }
    for(ip of ipv6) {
        await addRule(ip, true)
    }
    console.log('Done')
}

run()
