//Modules
import express from 'express';
import bunyan from 'bunyan';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

//Load values from .env file
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';

const app = express();
app.use(cors({
    origin: '*'
}));

const log = bunyan.createLogger({ name: 'Authorization Code Flow' });

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

//Set 1: Ask the authorization code
app.get('/get/the/code', (req, res) => {

    const Authorization_Endpoint = process.env.AUTH_ENDPOINT;
    const Response_Type = 'code';
    const Client_Id = process.env.CLIENT_ID;
    const Redirect_Uri = encodeURIComponent(process.env.REDIRECT_URI);
    const Scope = encodeURIComponent(process.env.SCOPE);
    const State = 'ThisIsMyStateValue';

    let url = `${Authorization_Endpoint}?response_type=${Response_Type}&client_id=${Client_Id}&redirect_uri=${Redirect_Uri}&scope=${Scope}&state=${State}`;

    log.info(url);

    res.redirect(url);

});

//Step 2: Get the code from the URL
app.get('/give/me/the/code', cors(), (req, res) => {
    //before continue, you should check that req.query.state is the same that the state you sent
    res.render('exchange-code', { code: req.query.code, state: req.query.state });
});

//Step 3: Exchange the code for a token
app.post('/exchange/the/code/for/a/token', cors({origin: '*'}), (req, res) => {

    const Token_Endpoint = process.env.TOKEN_ENDPOINT;
    const Grant_Type = 'authorization_code';
    const Code = req.body.code;
    const Redirect_Uri = process.env.REDIRECT_URI;
    const Client_Id = process.env.CLIENT_ID;
    const Client_Secret = process.env.CLIENT_SECRET;

    let body = {
        grant_type: Grant_Type,
        code: Code,
        redirect_uri: Redirect_Uri,
        client_id: Client_Id,
        secret: Client_Secret,
    }

    log.info(`Body: ${body}`);

    fetch(Token_Endpoint, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async response => {

        let json = await response.json();
        res.render('access-token', { token: JSON.stringify(json, undefined, 2) }); //you shouldn't share the access token with the client-side

    }).catch(error => {
        log.error(error.message);
    });
});

//Step 4: Call the protected API
app.post('/call/get_files', (req, res) => {

    let access_token = JSON.parse(req.body.token).access_token;

    const test_endpoint = process.env.TEST_ENDPOINT;
    const test_action = process.env.TEST_ACTION;
    const body = {
        workspace:"<workspace-id>",
        files:["recent"],
        bin:"",
        type:"all",
        tags:"all",
        timezone:180,
        status:"",
        sortBy:"name",
        sortOrder:"asc",
        page:0
    }
    //Call Microsoft Graph with your access token
    fetch(`${test_endpoint}${test_action}`, {
        method: "post",
        body: JSON.stringify(body),
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        }
    }).then(async response => {

        let json = await response.json();
        res.render('calling-test-api', { response: JSON.stringify(json, undefined, 2) });
    });
});

app.listen(8000);
