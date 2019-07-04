# webauthn-playground
Used for testing the different flags for navigator.credentials.get and .create

# Getting Started
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

  