/// <reference types= "cypress" />
import { SigninPage } from "../PageObject/PageAction/SigninPage";
import { collection } from "../PageObject/PageAction/collection";

const signin = new SigninPage
const collect = new collection
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
describe('Automate POST API with WSSE Header', () => {
    let userName = 'UAT_Col_UK@gmail.com'
    let password = 'testTest1'
    beforeEach(() => {
        cy.visit('https://webapp4.volopa.com/')
        signin.Login(userName, password)
        cy.viewport(2048,1280)
    })
    const baseUrl = 'https://devapi.volopa.com/VolopaApi';
    const endpoint = '/tcc/demo/funding/create';
    const eea = 0;
    const currency = 'GBP';
    //const min = 1000;
    //const max = 2000;
    //const amount = getRandomNumber(min, max);
    const amount = 2000;
    const sender= 'Test sender'
    const onBehalfOf = '33a1046e-a1a6-4b8f-b2b6-0164c598cbf8';
    const receiverAccountNumber = 'GB85TCCL12345649351996';
  
    const wsseUser = 'devApiUser';
    const wsseSecret = '87SDKhf!n@$#T@4gA1fg34s';
  
    // Generate WSSE Header
    function generateWsseHeader(username, password) {
      const hexcase = 0;
      const b64pad = "=";
      const chrsz = 8;
  
      function hex_sha1(s) {
        return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
      }
      function b64_sha1(s) {
        return binb2b64(core_sha1(str2binb(s), s.length * chrsz));
      }
      function str2binb(str) {
        const bin = Array();
        const mask = (1 << chrsz) - 1;
        for (let i = 0; i < str.length * chrsz; i += chrsz)
          bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i % 32);
        return bin;
      }
      function binb2hex(binarray) {
        const hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        let str = "";
        for (let i = 0; i < binarray.length * 4; i++) {
          str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
            hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
        }
        return str;
      }
      function binb2b64(binarray) {
        const tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        let str = "";
        for (let i = 0; i < binarray.length * 4; i += 3) {
          const triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16)
            | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8)
            | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
          for (let j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
            else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
          }
        }
        return str;
      }
      function core_sha1(x, len) {
        x[len >> 5] |= 0x80 << (24 - len % 32);
        x[((len + 64 >> 9) << 4) + 15] = len;
        const w = Array(80);
        let a = 1732584193;
        let b = -271733879;
        let c = -1732584194;
        let d = 271733878;
        let e = -1009589776;
        for (let i = 0; i < x.length; i += 16) {
          const olda = a;
          const oldb = b;
          const oldc = c;
          const oldd = d;
          const olde = e;
          for (let j = 0; j < 80; j++) {
            if (j < 16) w[j] = x[i + j];
            else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            const t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
              safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = rol(b, 30);
            b = a;
            a = t;
          }
          a = safe_add(a, olda);
          b = safe_add(b, oldb);
          c = safe_add(c, oldc);
          d = safe_add(d, oldd);
          e = safe_add(e, olde);
        }
        return Array(a, b, c, d, e);
      }
      function sha1_ft(t, b, c, d) {
        if (t < 20) return (b & c) | ((~b) & d);
        if (t < 40) return b ^ c ^ d;
        if (t < 60) return (b & c) | (b & d) | (c & d);
        return b ^ c ^ d;
      }
      function sha1_kt(t) {
        return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
          (t < 60) ? -1894007588 : -899497514;
      }
      function safe_add(x, y) {
        const lsw = (x & 0xFFFF) + (y & 0xFFFF);
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
      }
      function rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
      }
      function isodatetime() {
        const today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        let hour = today.getHours();
        let hourUTC = today.getUTCHours();
        let diff = hour - hourUTC;
        if (diff > 12) diff -= 24;
        if (diff <= -12) diff += 24;
        let hourdifference = Math.abs(diff);
        let minute = today.getMinutes();
        let minuteUTC = today.getUTCMinutes();
        let minutedifference;
        if (minute !== minuteUTC && minuteUTC < 30 && diff < 0) { hourdifference--; }
        if (minute !== minuteUTC && minuteUTC > 30 && diff > 0) { hourdifference--; }
        if (minute !== minuteUTC) {
          minutedifference = ":30";
        }
        else {
          minutedifference = ":00";
        }
        let timezone;
        if (hourdifference < 10) {
          timezone = "0" + hourdifference + minutedifference;
        }
        else {
          timezone = "" + hourdifference + minutedifference;
        }
        if (diff < 0) {
          timezone = "-" + timezone;
        }
        else {
          timezone = "+" + timezone;
        }
        if (month <= 9) month = "0" + month;
        if (day <= 9) day = "0" + day;
        if (hour <= 9) hour = "0" + hour;
        if (minute <= 9) minute = "0" + minute;
        if (today.getSeconds() <= 9) today.setSeconds("0" + today.getSeconds());
        const time = year + "-" + month + "-" + day + "T"
          + hour + ":" + minute + ":" + today.getSeconds() + timezone;
        return time;
      }
      function encode64(input) {
        const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        let output = "";
        let chr1, chr2, chr3 = "";
        let enc1, enc2, enc3, enc4 = "";
        let i = 0;
        do {
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);
          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;
          if (isNaN(chr2)) {
            enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
            enc4 = 64;
          }
          output = output +
            keyStr.charAt(enc1) +
            keyStr.charAt(enc2) +
            keyStr.charAt(enc3) +
            keyStr.charAt(enc4);
          chr1 = chr2 = chr3 = "";
          enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);
        return output;
      }
      function wsse(Password) {
        const Nonce = hex_sha1(isodatetime() + String(Math.random()) + 'There is more than words');
        const nonceEncoded = encode64(Nonce);
        const Created = isodatetime();
        const PasswordDigest = b64_sha1(Nonce + Created + Password);
        return [nonceEncoded, Created, PasswordDigest];
      }
      const w = wsse(password);
      return `UsernameToken Username="${username}", PasswordDigest="${w[2]}", Nonce="${w[0]}", Created="${w[1]}"`;
    }
  
    it('should return 200 for the POST API call', () => {
        collect.goToCollection()
        cy.get('.ant-tabs-nav-list > :nth-child(2)').should('be.visible').click()
        collect.getCurrencyBalance(currency).then(previousBalance=>{
          cy.wrap(previousBalance).as('previousBalance')
        })
            
        
        
      // Generate the WSSE header
      const wsseHeaderValue = generateWsseHeader(wsseUser, wsseSecret);
  
      // Make the POST request
      cy.request({
        method: 'POST',
        url: `${baseUrl}${endpoint}`,
        headers: {
          'x-wsse': wsseHeaderValue,
          'Content-Type': 'application/json'
        },
        body: {
          eea: eea,
          currency: currency,
          amount: amount,
          on_behalf_of: onBehalfOf,
          receiver_account_number: receiverAccountNumber
        }
      }).then((response) => {
        // Check if the response status is 200
        cy.log(response)
        expect(response.status).to.eq(200);
  
        // Validate JSON response
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.have.property('funding');
        expect(response.body.data.funding).to.have.property('success', true);
  
        // Validate result object
        const result = response.body.data.funding.result;
        //expect(result).to.have.property('id', '196CCB2C-F7E6-A40B-24FF-8BC3D25FE9B6');
        //expect(result).to.have.property('account_id', 'd58e62a6-568c-4391-84ea-35df6616b692');
        expect(result).to.have.property('state', 'pending');
        expect(result).to.have.property('sender_name', sender);
        expect(result).to.have.property('sender_address', null);
        expect(result).to.have.property('sender_country', null);
        expect(result).to.have.property('sender_reference', null);
        expect(result).to.have.property('sender_account_number', null);
        expect(result).to.have.property('sender_routing_code', null);
        expect(result).to.have.property('receiver_account_number', receiverAccountNumber);
        expect(result).to.have.property('receiver_routing_code', null);
        expect(result).to.have.property('amount', (amount.toFixed(2)));
        expect(result).to.have.property('currency',currency);
        expect(result).to.have.property('action', 'approve');
        //expect(result).to.have.property('short_reference', 'IF-20240807-R5V8CC');
        //expect(result).to.have.property('created_at', '2024-08-07T07:51:50+00:00');
        //expect(result).to.have.property('updated_at', '2024-08-07T07:51:50+00:00');
  
        // Validate response object
        const responseObj = response.body.data.funding.response;
        //expect(responseObj).to.have.property('id', '196CCB2C-F7E6-A40B-24FF-8BC3D25FE9B6');
        //expect(responseObj).to.have.property('account_id', 'd58e62a6-568c-4391-84ea-35df6616b692');
        expect(responseObj).to.have.property('state', 'pending');
        expect(responseObj).to.have.property('sender_name', sender);
        expect(responseObj).to.have.property('sender_address', null);
        expect(responseObj).to.have.property('sender_country', null);
        expect(responseObj).to.have.property('sender_reference', null);
        expect(responseObj).to.have.property('sender_account_number', null);
        expect(responseObj).to.have.property('sender_routing_code', null);
        expect(responseObj).to.have.property('receiver_account_number', receiverAccountNumber);
        expect(responseObj).to.have.property('receiver_routing_code', null);
        expect(responseObj).to.contain.property('amount', (amount.toFixed(2)));
        expect(responseObj).to.have.property('currency', currency);
        expect(responseObj).to.have.property('action', 'approve');
        //expect(responseObj).to.have.property('short_reference', 'IF-20240807-R5V8CC');
        //expect(responseObj).to.have.property('created_at', '2024-08-07T07:51:50+00:00');
        //expect(responseObj).to.have.property('updated_at', '2024-08-07T07:51:50+00:00');
  
        // Optionally log the response for debugging
        cy.log('Response:', response);
      });
      

      cy.reload()
      collect.getCurrencyBalance(currency).then(newBalance => {
        cy.log('New Balance:', newBalance);
        cy.get('@previousBalance').then(previousBalance => {
            cy.log('Retrieved Previous Balance:', previousBalance)
            cy.log('Retrieved New Balance:', newBalance)
            expect(parseFloat(newBalance.replace(/,/g, ''))).to.be.eq(parseFloat(previousBalance.replace(/,/g, ''))+parseFloat(amount))
        });
    }); 
  })
  
})