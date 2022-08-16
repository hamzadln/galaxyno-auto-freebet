const axios = require('axios');
const crypto = require('crypto');
const cheerio = require('cheerio');
var username = 'hamzadlnn'+Math.floor(Math.random() * 1000) + 1;
var mail = username+'@rcmails.com';
var pw = 'Password123!';
var data = null;
async function checkbalance(token){
  var config = {
    method: 'get',
    url: 'https://gateway.multbrand.com/gateway/online-player/1.30.00/player/5008/online/status',
    headers: { 
      'x-auth-token': token
    }
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data.total_balance));
  })
  .catch(function (error) {
    console.log(error);
  });
}
async function testlogin(user,password){
  var data = JSON.stringify({
    "user_name": username,
    "password": pw,
    "language": "en",
    "brand_id": "5008"
  });
  
  var config = {
    method: 'post',
    url: 'https://gateway.multbrand.com/gateway/login/1.30.00/5008/player',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
    console.log(username);
    checkbalance(response.data.token)
  })
  .catch(function (error) {
    console.log(error.response.data.result);
  });
}
async function registerstepone(){
  var data = JSON.stringify({
    "email": mail,
    "loginName": username,
    "password": pw,
    "rePassword": pw,
    "signTNC": true,
    "signOptOut": false,
    "over18": true,
    "language": "en",
    "currency": "IDR",
    "btag": "37058_472801|||AFF_37058_LP_EN_10FC_"
  });
  
  var config = {
    method: 'post',
    url: 'https://gateway.multbrand.com/gateway/reg-step-one/1.30.00/5008',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    var token = response.data.auth_token;
    console.log(JSON.stringify(token));
    registerstep2(token);
  })
  .catch(function (error) {
    console.log(error);
  });
}
async function registerstep2(token){
  var data = JSON.stringify({
    "auth_token": token,
    "firstName": "Hamzah",
    "lastName": 'pw',
    "birthDate":"03/08/2004",
    "gender":"M",
    "language":"en",
    "country":"ID",
    "city":"asdadsad",
    "address":"asdadas",
    "zipCode":"20131",
    "mobileNumber":"62-13132133123",
    "uuid":"sbvXI5WbOHlSPa8jONwGXkgUKTQ6xuVCbf5iBe63bJ7vYhCUvRq5KKMx1LEgAUOw"
  });
var config = {
  method: 'post',
  url: 'https://gateway.multbrand.com/gateway/reg-step-two/1.30.00/5008',
  headers: { 
    'Content-Type': 'text/plain'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
  checkmail();
})
.catch(function (error) {
  console.log(error);
});
}
async function checkmail(){
  console.log(mail);
  let hash = crypto.createHash('md5').update(mail).digest("hex");
    console.log('Sleeping 30 Second to wait the mail arrives..');
    let limit = Date.now()+(1000*1); 
          while (Date.now() < limit){
            Date.now();
          };
    const options = {
        method: 'GET',
        url: 'https://privatix-temp-mail-v1.p.rapidapi.com/request/mail/id/'+hash+'/',
        headers: {
          'X-RapidAPI-Key': 'cb478e4aeamsh4275e9f1643f3dap13779djsnf074196861ab',
          'X-RapidAPI-Host': 'privatix-temp-mail-v1.p.rapidapi.com'
        }
      };
      axios.request(options).then(function (response) {
        if(response.data.error != undefined){
          console.log(response.data.error);
          console.log('Something happen with the email. Please try again');
          process.exit();
        }
        extractLinks(response.data[0].mail_html);
    }).catch(function (error) {
        console.log(error);
        process.exit();
    });
}
const extractLinks = async (data) => {
  try {
    // Fetching HTML
    const html = data;
    // Using cheerio to extract <a> tags
    const $ = cheerio.load(html);

    const linkObjects = $('a');
    // this is a mass object, not an array

    // Collect the "href" and "title" of each link and add them to an array
    const links = [];
    linkObjects.each((index, element) => {
      links.push({
        text: $(element).text(), // get the text
        href: $(element).attr('href'), // get the href attribute
      });
    });

    console.log(links[2].href);
    const options = {
      method: 'GET',
      url:links[2].href ,
      headers: {
      }
    };
    axios.request(options).then(function (response) {
      try{
        console.log('Email Verified Status: ',response.statusText); 
        testlogin(username,pw); 
      }catch(e){
        console.log(e);
      }
      
    }).catch(function (error) {
      console.error(error);
    });
    // do something else here with these links, such as writing to a file or saving them to your database
  } catch (error) {
    console.log(error);
  }
};
registerstepone();
