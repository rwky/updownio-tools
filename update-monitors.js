const https = require('https');
const fs = require('fs');
const monitors = JSON.parse(fs.readFileSync('monitors.json'));
const baseUrl = 'https://updown.io/api/'
const defaultOptions = {
    headers: {
        'X-API-Key': process.env.APIKEY,
    }
}
const clone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
}

const addMonitor = (monitor) => {
    return new Promise((resolve, reject) => {
        let options = clone(defaultOptions)
        let data = '';
        let response = '';
        let url = baseUrl + 'checks';
        if (monitor.token) {
            options.method = 'PUT';
            url += '/' + monitor.token
        } else {
            options.method = 'POST';
        }
        Object.keys(monitor).map((key) => {
            data += key + '=' + encodeURIComponent(monitor[key]) + '&';
        });
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        options.headers['Content-Length'] = data.length
        console.log('Processing ' + monitor.url)
        let req = https.request(url, options, (res) => {
            res.on('data', d => {
               response += d.toString('utf8') 
            });
            res.on('end', () => {
                console.log('Processed ' + monitor.url)
                response = JSON.parse(response)
                if(response.error) {
                    reject(response.error)
                } else {
                    resolve(response)
                }
            })
        });
        req.on('error', (error) => {
            reject(error)
        }); 
        req.write(data)
        req.end();
    });
}

async function loadMonitors() {
        for(let monitor of monitors) {
            monitorClone = clone(monitor)
            if(!monitor.alias) {
                monitorClone.alias = monitorClone.url;
            }
            await addMonitor(monitorClone).then(data => {
                if (data.token) {
                    monitor.token = data.token
                }
            }).catch(err => console.error(err));
        }
        console.log('Saving')
        fs.writeFileSync('monitors-new.json', JSON.stringify(monitors, null, 4));
        console.log('Saved')
}

loadMonitors()
