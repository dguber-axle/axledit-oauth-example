# axledit-oauth-example
This is an example of a generic OAuth tester for axledit.
It is intended only for demonstration purposes and not for production use, as it doesn't have any security verifications.

To use this example, modify the provided ".env.sample" file with your credentials and the data of the corresponding axledit instance.
You can erase the ".sample" extension of that file and fill in the credentials.
The Client ID, Client Secret and scopes will be provided from the OAuth client created from the axledit instance.
The Redirect URI is the third party app's endpoint which will receive the generated authorization code created by axledit to then be exchanged for the user's access and refresh tokens.
The Auth Endpoint is axledit's endpoint used the generate the before mentioned authorization code.
The Token Endpoint is axledit's endpoint used to exchange the authorization code for the access and refresh tokens. This endpoint should be only used server sided, as it also requires the Client Secret.
The Test Endpoint is axledit's entry path for the API. Together with the Test Action, you get the URL to test axledit's API. (ex. https://app.axledit.com/api/1.0/files/get_files)

An example of these credentials could be: 

CLIENT_ID="abcdefghijklMNOPQrst1234" # Randomly generated alphanumeric upper and lower case string
CLIENT_SECRET="abcdefghijklMNOPQrstuvwxyz123456abcdefghijklmnopqrstuvwxyz123456" # Randomly generated alphanumeric upper and lower case string
SCOPE="full_access,access_1" # Scopes of the axledit OAuth client
REDIRECT_URI="https://atomos.cloud/oauth/code"
AUTH_ENDPOINT="https://app.axledit.com/oauth/auth"
TOKEN_ENDPOINT="https://app.axledit.com/oauth/token"
TEST_ENDPOINT="https://app.axledit.com/api/1.0/"
TEST_ACTION="files/get_files"

You will also need to modify the workspace-id in the "server.js" to test the axledit API with the generated access token.

Original source code of this example:
https://github.com/0GiS0/oauth2-authZ-code-flow
