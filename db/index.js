import modelUrl from './setup.js';

const generateShortUrl = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  return new Array(6)
    .fill()
    .map(() => chars.charAt(~~(Math.random() * 62)))
    .join('');
}

const validateUrl = (value) => {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}

export default async function setup () {
  const Url = await modelUrl();

  return {
    createUrl: async (longUrl) => {
      try {
        const url = await Url.findAll({ where: { longUrl } });

        if (url && url.length === 1 && url[0].longUrl === longUrl)
          return url[0];

        if (!validateUrl(longUrl))
          throw new Error('Invalid url');

        const shortUrl = generateShortUrl();
        const newUrl = await Url.create({ longUrl, shortUrl });

        return newUrl;
      } catch (err) {
        return err;
      }
    },

    findUrl: async (shortUrl) => {
      try {
        const url = await Url.findAll({ where: { shortUrl } });

        if (url && url.length === 1 && url[0].longUrl) {
          return url[0].longUrl;
        } else {
          throw new Error('Url not founded');
        }
      } catch (err) {
        return err;
      }
    }
  };
}
