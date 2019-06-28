function getRegisterRequest() {
  var Request = document.getElementById("createBuilderArea").value;
  console.log(Request);
  return JSON.parse(Request);
}

function getAuthenticateRequest() {
  var Request = document.getElementById("getBuilderArea").value;
  console.log(Request);
  return JSON.parse(Request);
}

function authenticate() {
  webAuthnRequest = getAuthenticateRequest();
  console.log('authenticate', webAuthnRequest)
  historyArea = document.getElementById("historyArea")
  //document.getElementById("historyArea").innerHTML = JSON.stringify(webAuthnRequest) + "\n----\n" + document.getElementById("historyArea").value;

  getAssertion(webAuthnRequest)
    .then(function (getAssertionResponse) {
      console.log(getAssertionResponse);
      var webAuthnResponseDiv = document.getElementById("webauthGetResponse");
      webAuthnResponseDiv.innerHTML = JSON.stringify(responseToObject(getAssertionResponse),null,2);
      historyArea.innerHTML = "\n------Get Request------\n\n" + JSON.stringify(webAuthnRequest) + "\n\n---Get Response---\n\n" + JSON.stringify(responseToObject(getAssertionResponse)) + "\n------\n" + document.getElementById("historyArea").value;;
    })
    .catch(error => {
      historyArea.innerHTML = "\n------Get Request------\n\n" + JSON.stringify(webAuthnRequest) + "\n***Get Error***\n" + error + "\n------\n" + document.getElementById("historyArea").value
      throw error;
    })
}

function getAssertion(webAuthnRequest) {
  console.log('Get assertion', webAuthnRequest);
  return navigator.credentials.get({
    publicKey: decodePublicKeyCredentialRequestOptions(webAuthnRequest),
  });
}


function decodePublicKeyCredentialRequestOptions(webAuthnRequest) {
  //allowCredentials = webAuthnRequest.allowCredentials;
  const allowCredentials = webAuthnRequest.allowCredentials && webAuthnRequest.allowCredentials.map(credential => extend(
    credential, {
      id: toByteArray(credential.id),
    }));

  const publicKeyCredentialRequestOptions = extend(
    webAuthnRequest, {
      allowCredentials,
      challenge: toByteArray(webAuthnRequest.challenge),
    });
  console.log(publicKeyCredentialRequestOptions);
  var webAuthnRequestDiv = document.getElementById("webauthGetRequest");

  webAuthnRequestDiv.innerHTML = JSON.stringify(publicKeyCredentialRequestOptions);


  return publicKeyCredentialRequestOptions;
}

//-------------------------------------------------------------------
//-------------------------------------------------------------------
function register() {
  webAuthnRequest = getRegisterRequest();
  console.log('register', webAuthnRequest)

  historyArea = document.getElementById("historyArea")
  //historyArea.innerHTML = "\n----Register Request---\n" + JSON.stringify(webAuthnRequest) + "------" + document.getElementById("historyArea").value;

  createCredential(webAuthnRequest)
    .then(function (createCredentialResponse) {
      console.log("createCredential:" + createCredentialResponse);
      var webAuthnResponseDiv = document.getElementById("webauthCreateResponse");
      webAuthnResponseDiv.innerHTML = JSON.stringify(responseToObject(createCredentialResponse),null,2);
      historyArea.innerHTML = "\n-------Create Request------\n\n" + JSON.stringify(webAuthnRequest) + "\n\n---Create Response---\n\n" + JSON.stringify(responseToObject(createCredentialResponse)) + "\n------\n" + document.getElementById("historyArea").value;;
    })
    .catch(error => {
      console.log("error:" + error);
      historyArea.innerHTML = "\n------Create Request------\n\n" + JSON.stringify(webAuthnRequest) + "\n***Create Error***\n" + error + "\n------\n" + document.getElementById("historyArea").value
      throw error;
    })
}

function createCredential(request) {
  return navigator.credentials.create({
    publicKey: decodePublicKeyCredentialCreationOptions(request)
  });
}

function decodePublicKeyCredentialCreationOptions(request) {
  const excludeCredentials = request.excludeCredentials && request.excludeCredentials.map(credential => extend(
    credential, {
      id: toByteArray(credential.id),
    }));

  const publicKeyCredentialCreationOptions = extend(
    request, {
      attestation: request.attestation,
      user: extend(
        request.user, {
          id: toByteArray(request.user.id),
        }),
      challenge: toByteArray(request.challenge),
      excludeCredentials
    });
    
  var webAuthnRequestDiv = document.getElementById("webauthCreateRequest");

  webAuthnRequestDiv.innerHTML = JSON.stringify(publicKeyCredentialCreationOptions);

  return publicKeyCredentialCreationOptions;
}





//--------------------------------------------------------------
function extend(obj, more) {
  return Object.assign({}, obj, more);
}

function toByteArray(code) {
  return base64js.toByteArray(base64UrlToMime(code));
}

function base64UrlToMime(code) {
  return code.replace(/-/g, '+').replace(/_/g, '/') + '===='.substring(0, (4 - (code.length % 4)) % 4);
}

function responseToObject(response) {
  if (response.u2fResponse) {
    return response;
  } else {
    let clientExtensionResults = {};

    try {
      clientExtensionResults = response.getClientExtensionResults();
    } catch (e) {
      console.error('getClientExtensionResults failed', e);
    }

    if (response.response.attestationObject) {
      return {
        type: response.type,
        id: response.id,
        response: {
          attestationObject: fromByteArray(response.response.attestationObject),
          clientDataJSON: fromByteArray(response.response.clientDataJSON),
        },
        clientExtensionResults,
      };
    } else {
      return {
        type: response.type,
        id: response.id,
        response: {
          authenticatorData: fromByteArray(response.response.authenticatorData),
          clientDataJSON: fromByteArray(response.response.clientDataJSON),
          signature: fromByteArray(response.response.signature),
          userHandle: response.response.userHandle && fromByteArray(response.response.userHandle),
        },
        clientExtensionResults,
      };
    }
  }
}

function mimeBase64ToUrl(code) {
  return code.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function fromByteArray(bytes) {
  return mimeBase64ToUrl(base64js.fromByteArray(ensureUint8Array(bytes)));
}

function ensureUint8Array(arg) {
  if (arg instanceof ArrayBuffer) {
    return new Uint8Array(arg);
  } else {
    return arg;
  }
}