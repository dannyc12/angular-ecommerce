export default {
    oidc: {
        clientId: '0oabdfyl7uxFA1zyi5d7', // from okta application 
        issuer: 'https://dev-83827748.okta.com/oauth2/default', // issuer of tokens. dev-83827748.okta.com from okta profile 
        redirectUri: 'http://localhost:4200/login/callback', // url when authorizing with okta authorization server
        scopes: ['openid', 'profile', 'email']

    }
}
