const express = require("express");
const router = express.Router();
var request = require("request");

const dotenv = require("dotenv");
dotenv.config();

const USER = process.env.RPC_USER;
const PASS = process.env.RPC_PASSWORD;

const headers = {
  "content-type": "text/plain;"
};

router.get("/test", (req, res) => res.json({ msg: "backend works" }));

const generalRequest = function(requestPath, reqParams, res) {
  var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"${requestPath}","params":[${reqParams}]}`;
  var options = {
    url: `http://${USER}:${PASS}@127.0.0.1:8332/`,
    method: "POST",
    headers: headers,
    body: dataString
  };

  callback = (error, response, body) => {
    // console.log(`GET /${requestPath} ${reqParams}`)
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body)
      res.send(data)
      // console.log(data)
    }
    else {
      console.log('Error: ', body)
      res.send({ 'error': body })
    }
  };
  request(options, callback);
}

const basicRoute = function (rpc) {
  router.get(`/${rpc}`, (req, res) => {
    generalRequest(rpc, '', res)
  })
}

basicRoute('getblockcount')
basicRoute('getbestblockhash')
basicRoute('getconnectioncount')
basicRoute('getdifficulty')
basicRoute('getblockchaininfo')
basicRoute('getmininginfo')
basicRoute('getpeerinfo')
basicRoute('getrawmempool')

router.get("/getblock/:hash", (req, res) => {
  generalRequest('getblock', `"${req.params.hash}"`, res)
});

router.get('/getblockhash/:index', (req, res) => {
  generalRequest('getblockhash', req.params.index, res)
});

router.get("/getrawtransaction/:blockhash/:id", (req, res) => {
  generalRequest('getrawtransaction', `"${req.params.id}", true, "${req.params.blockhash}"`, res)
});

router.get("/getrawtransaction/:id", (req, res) => {
  generalRequest('getrawtransaction', `"${req.params.id}", true`, res)
});

router.get("/decoderawtransaction/:hex", (req, res) => {
  generalRequest('decoderawtransaction', `"${req.params.hex}"`, res)
})

router.get("/getblockheader/:hash", (req, res) => {
  generalRequest('getblockheader', `"${req.params.hash}", true`, res)
})


module.exports = router;
