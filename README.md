# A set of tools for automating with https://updown.io

## Installation

Just clone the repo, there are no dependencies outside the standard nodejs libs.

## Usage

### update-monitors.js

Configure your monitors in `monitors.json` details of the options can be found at https://updown.io/api

An example file is in `monitors-example.json`

After completion a new file `monitors-new.json` will be created which contains the contents of `monitors.json` 
with the tokens added to each monitor. You can copy this to `monitors.json` to update your monitors in the future.

#### Example

```sh
APIKEY=abcdef node update-monitors.js
```
Set the `APIKEY` environment variable to your updown.io API Key

### whitelist-cloudflare.js

This uses the cloudflare API to whitelist all updown.io servers. It will delete any existing rules with the
notes `updownio` then add new rules.

#### Example

```sh
EMAIL=youremail@test.com KEY=abcdef ZONE=gfhijk node whitelist-cloudflare.js
```
Set `EMAIL` to your cloudflare login email `KEY` to your cloudflare API Key `ZONE` to the id of the zone you wish to add the whitelist to.

### whitelist-nginx.js

This generates a valid nginx config file with allow statements for all updown.io ips the file will be `nginx-whitelist`.

#### Example
```sh
node whitelist-nginx.js
```

*Note: this isn't the cleanest code but it's functional, this was hacked together to satisify automation needs, feel free to fork/update/clean it up*

