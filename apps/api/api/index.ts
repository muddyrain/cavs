import 'dotenv/config';
import express from 'express';
import md5 from './md5';
import axios from 'axios';
const app = express();

app.get('/api/translate/baidu', function (req: express.Request, res: express.Response) {
    const appid = '20250717002409267';
    const key = 'y7QjclxelfvqW0XUX6KW';
    var salt = (new Date).getTime();
    const { q, from = 'en', to = 'zh' } = req.query;
    if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: 'Invalid query parameter "q". It must be a non-empty string.' });
    }
    const str1 = appid + q + salt + key;
    const sign = md5(str1);
    axios.get(`https://fanyi-api.baidu.com/api/trans/vip/translate`, {
        params: {
            q: q,
            from: from,
            to: to,
            appid: appid,
            salt: salt,
            sign: sign
        }
    }).then(response => {
        console.log(`Response: ${JSON.stringify(response.data)}`);
        res.json(response.data);
    }).catch(error => {
        console.error(`Error: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    });

});
app.get('/', function (req: express.Request, res: express.Response) {
    res.send('Hello World!');
});

app.listen(3000, () => console.log('Server ready on http://localhost:3000.'));

export default app;