const https = require('https');
const fs = require('fs');
const getIPs = require('./get-ips.js')
async function run() {
    let [ipv4, ipv6] = await getIPs()
    let str = ''
    for(ip of ipv4) {
        str += 'allow ' + ip +'; # updownio\n'
    }
    for(ip of ipv6) {
        str += 'allow ' + ip +'; # updownio\n'
    }
    fs.writeFileSync('nginx-whitelist', str)
    console.log('Done')
}

run()
