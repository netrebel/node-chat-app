const expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate the correct message object', () => {
        let username = 'miguel';
        let text = 'hello'
        let message = generateMessage(username, text);

        expect(message.username).toBe(username);
        expect(message.text).toBe(text);
        expect(message).toMatchObject({username, text});
        expect(typeof message.createdAt).toBe('number');

    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        let username = 'miguel';
        let latitude = 1;
        let longitude = 1;
        let url = 'https://www.google.com/maps?q=1,1';
        let message = generateLocationMessage(username, latitude, longitude);

        expect(message).toMatchObject({username, url});
        expect(typeof message.createdAt).toBe('number');
    });
});