var currentHostName

function buildGetRequest() {

    var webAuthnRequestType = document.getElementsByName("webAuthnRequestTypeMenu")[0].value;
    var doGenerateChallenge = document.getElementsByName("doGenerateRandomChallengeGetMenu")[0].value;
    var relyingPartyId = document.getElementsByName("rpIdGetMenu")[0].value;
    var userVerification = document.getElementsByName("userVerificationGetMenu")[0].value;
    var timeout = document.getElementsByName("timeoutGetMenu")[0].value;
    var allowTransports = document.getElementsByName("allowCredentialsTransportsGetMenu")[0];
    var allowCredentialsId = document.getElementsByName("allowCredentialsIdGetMenu")[0].value;

    if (doGenerateChallenge.valueOf() == "true") {
        //This is probably not crypotgraphically secure but just for demo purposes.  
        theChallenge = btoa(Math.random()).substr(0, 21) + btoa(Math.random()).substr(0, 21)
    } else {
        //Just use a recognizable static string
        theChallenge = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    }
    requestBuilder = {
        challenge: theChallenge,
        rpId: relyingPartyId,
    }

    if (userVerification.valueOf() != "null (default)") {
        requestBuilder.userVerification = userVerification;
    }

    if (timeout.valueOf() != "null (default)") {
        requestBuilder.timeout = parseInt(timeout);
    }

    transports = [];

    if (allowCredentialsId.valueOf() != "") {


        requestBuilder.allowCredentials = []
        requestBuilder.allowCredentials[0] = {}
        requestBuilder.allowCredentials[0].type = 'public-key'
        requestBuilder.allowCredentials[0].id = allowCredentialsId;

        for (i = 0; i < allowTransports.length; i++) {
            option = allowTransports[i];
            if (option.selected == true && option.value != "null (default)") {
                transports.push(option.value)
            }

            if (transports.length > 0) {
                requestBuilder.allowCredentials[0].transports = transports
            }
        }
    }

    //Encode the request and put it in the query param.
    updatedUrl=buildURL(requestBuilder, "get")
    resetURL(updatedUrl)

    //Pretty print it and put it in the text area. 
    document.getElementById("getBuilderArea").value = JSON.stringify(requestBuilder, null, 2)
}

function buildCreateRequest() {

    var webAuthnRequestType = document.getElementsByName("webAuthnRequestTypeMenu")[0].value;
    var doGenerateChallenge = document.getElementsByName("doGenerateRandomChallengeCreateMenu")[0].value;
    var relyingPartyId = document.getElementsByName("rpIdCreateMenu")[0].value;
    var userVerification = document.getElementsByName("userVerificationCreateMenu")[0].value;
    var authenticatorAttachment = document.getElementsByName("authenticatorAttachmentCreateMenu")[0].value;
    var requireResidentKey = document.getElementsByName("requireResidentKeyCreateMenu")[0].value;
    var timeout = document.getElementsByName("timeoutCreateMenu")[0].value;
    var algorithm = document.getElementsByName("algorithmCreateMenu")[0].value;
    var attestation = document.getElementsByName("attestationCreateMenu")[0].value;
    var excludeCredentials = document.getElementsByName("excludeCredentialsCreateMenu")[0].value;

    var userId = document.getElementsByName("userIdCreateMenu")[0].value;
    var userName = document.getElementsByName("userNameCreateMenu")[0].value;
    var userDisplayName = document.getElementsByName("userDisplayNameCreateMenu")[0].value;

    if (doGenerateChallenge.valueOf() == "true") {
        theChallenge = btoa(Math.random()).substr(0, 21) + btoa(Math.random()).substr(0, 21)
    } else {
        //Just use a recognizable static string
        theChallenge = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    }

    requestBuilder = {
        challenge: theChallenge,
        rp: {
            id: relyingPartyId,
            name: relyingPartyId
        }
    }

    if (userVerification.valueOf() != "null (default)") {
        requestBuilder.authenticatorSelection = {}
        requestBuilder.authenticatorSelection.userVerification = userVerification;
    }

    if (authenticatorAttachment.valueOf() != "null (default)") {
        if (!requestBuilder.authenticatorSelection) {
            requestBuilder.authenticatorSelection = {}
        }
        requestBuilder.authenticatorSelection.authenticatorAttachment = authenticatorAttachment;
    }


    if (requireResidentKey.valueOf() != "null (default)") {
        if (!requestBuilder.authenticatorSelection) {
            requestBuilder.authenticatorSelection = {}
        }
        requestBuilder.authenticatorSelection.requireResidentKey = JSON.parse(requireResidentKey);
    }

    if (timeout.valueOf() != "null (default)") {
        requestBuilder.timeout = parseInt(timeout);
    }

    if (attestation.valueOf() != "null (default)") {
        requestBuilder.attestation = attestation;
    }
    requestBuilder.pubKeyCredParams = [];
    requestBuilder.pubKeyCredParams[0] = {}
    requestBuilder.pubKeyCredParams[0].type = "public-key";
    requestBuilder.pubKeyCredParams[0].alg = parseInt(algorithm);

    requestBuilder.user = {}
    requestBuilder.user.id = userId;
    requestBuilder.user.name = userName;
    requestBuilder.user.displayName = userDisplayName;

    if (excludeCredentials.valueOf() != "null") {
        requestBuilder.excludeCredentials = []
        requestBuilder.excludeCredentials[0] = {}
        requestBuilder.excludeCredentials[0].type = "public-key"
        requestBuilder.excludeCredentials[0].id = requestBuilder.user.id
        requestBuilder.excludeCredentials[0].transports = [];
        requestBuilder.excludeCredentials[0].transports[0] = "usb";
    }
    //Encode the request and set the query param in the url.
    updatedUrl=buildURL(requestBuilder, "create")
    resetURL(updatedUrl)

    //Also pretty print the request and display it in the text area.
    document.getElementById("createBuilderArea").value = JSON.stringify(requestBuilder, null, 2)

}

function setFromQueryParams() {
    var url_string = window.location.href
    var url = new URL(url_string);
    requestTypeParam = url.searchParams.get("requestType");
    webauthnRequestP = url.searchParams.get("webauthnRequest");
    currentHostName = window.location.hostname
    setInitialValues();
}

function setInitialValues() {
    //Override the rpid to wherever the site is hosted.
    document.getElementsByName("rpIdGetMenu")[0].value = currentHostName;
    document.getElementsByName("rpIdCreateMenu")[0].value = currentHostName;

    if (requestTypeParam == "get") {
        hide("getOptions")
        decodedwebauthnRequest = atob(webauthnRequestP);
        document.getElementById("getBuilderArea").value = JSON.stringify(JSON.parse(decodedwebauthnRequest), null, 2)        
        document.getElementsByName("webAuthnRequestTypeMenu")[0].value = "get"
    } else if (requestTypeParam == "create") {
        hide("createOptions")
        decodedwebauthnRequest = atob(webauthnRequestP);
        document.getElementById("createBuilderArea").value = JSON.stringify(JSON.parse(decodedwebauthnRequest), null, 2)
        document.getElementsByName("webAuthnRequestTypeMenu")[0].value = "create"
    } else {
        //don't do anything with the input params
    }

}

function resetURL(url) {
    window.history.replaceState({}, "   ", url);
}

function buildURL(requestJSON, requestType){
    encodedRequestP = btoa(JSON.stringify(requestJSON))
    var url_string = window.location.href
    var url = new URL(url_string);
    url.searchParams.set("requestType", requestType);
    url.searchParams.set("webauthnRequest", encodedRequestP);
    return url;
}