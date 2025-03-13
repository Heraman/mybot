const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

class SnapInst {
    static async app(url) {
        try {
            const { data } = await axios.get('https://snapinst.app/');
            const $ = cheerio.load(data);
            const form = new FormData();

            form.append('url', url);
            form.append('action', 'post');
            form.append('lang', '');
            form.append('cf-turnstile-response', '');
            form.append('token', $('input[name=token]').attr('value'));

            const headers = {
                ...form.getHeaders(),
                'accept': '*/*',
                'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
                'sec-ch-ua-mobile': '?1',
                'sec-ch-ua-platform': '"Android"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'Referer': 'https://snapinst.app/',
                'Referrer-Policy': 'strict-origin-when-cross-origin'
            };

            const response = await axios.post('https://snapinst.app/action2.php', form, { headers });
            const scriptExecutor = new Function('callback', response.data.replace('eval', 'callback'));

            const html = await new Promise((resolve) => {
                scriptExecutor(result => {
                    const code = result.split(".innerHTML = ")[1].split("; document.")[0];
                    resolve(eval(code));
                });
            });

            const _ = cheerio.load(html);
            const result = {
                avatar: _('.row img:eq(0)').attr('src'),
                username: _('.row div.left:eq(0)').text().trim(),
                urls: []
            };

            _('.row .download-item').each((i, e) => {
                result.urls.push(_(e).find('.download-bottom a').attr('href'));
            });

            return result;
        } catch (error) {
            throw new Error('Failed to fetch data: ' + error.message);
        }
    }
}

module.exports = SnapInst;
