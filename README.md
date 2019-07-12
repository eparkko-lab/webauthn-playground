# webauthn-playground
You can use the tool to help you build and then manipulate FIDO2 WebAuthn requests.  It will perform both get and create commands against roaming and platform authenticators (ie, security keys and TPMs).  All the work is being done in your local browser and does not communicate with any backend systems.  

## Features
1. The tool helps you building a legitimate request.  Once you build a request with the builder you can then manipulate it even further before you call the webauthn api with a create or get. 
1. You can save off requests since the tool will update the url with the webauthn request that you last submitted.  This will allow you to save off and replay requests in different browsers to see how each performs.  
1. The tool will save off the previously generated credentialId in the browser local storage.  This will allow you to save off a previous get request that isn't dependant on an existing credentialId but just generates a request using a credentialId that is in your browser's local storage. 
1. The history of commands is saved off in a history window.   As of now the history does not work across multiple tabs in a browser or after refreshing the page.


## Cautions
1. If you are using a security key that has legitimate credentials on it beware of generating residentKeys on your device. Resident Keys can be generated using the "Require Resident Key" in the request builder.  If you generate too many residentKeys on any given security key you may need to reset the device and lose legitimate credentials on the device. 
1. Not all browsers and platforms have the same level of support for webauthn.  You may notice that residentKeys are not supported on some browsers or other aspects with attestation behave differently. This tool actually makes it easy to see how one browser behaves relative to another browser.

# Installing and using locally
This tool can be used to help understand how the different parameters on webauthn API requests behave.
To install and run this locally.

1.  install node
1.  clone this git repo
1.  `cd webauthn-playground`
1.  `npm install express --save`
1.  create x509 certs and keys to support https
  1. `mkdir resources && cd resources`
  1. `openssl req -x509 -newkey rsa:2048 -keyout server.key -out server.cert -days 90 -nodes -subj '/C=US/ST=Anywhere/L=Anywhere/O=Anywhere/OU=Anywhere/CN=localhost'`
1.  `cd ..`
1.  `node app.js`
1.  open your browser and go to https://localhost:3000.
  * note limited supported may exist for platforms & browsers on with specific webauthn capabilities.  At the time of this writing Windows 1903+ using Edge 44 or Firefox 67 for full set of webauthn capabilities.  Full support for webauthn is expected in Chrome 76. 

  