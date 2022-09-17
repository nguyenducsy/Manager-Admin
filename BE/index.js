'use strict';

const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const Joi = require('joi');

const pattern = /^[a-zA-Z0-9!@#$%&*]{6,}$/;
const equalsIgnoringCase = (string1, string2) => {
    if (!string1 || !string2) {
        return false;
    }
    return string1.toLowerCase() === string2.toLowerCase();
};

const users = [{
    username: 'admin',
    password: 'P@ssw0rd',
    email: 'a@b.c',
    firstName: 'John',
    lastName: 'Doe'
}];

const init = async() => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: { cors: true }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return 'Hello World!';
        }
    });

    server.route({
        method: 'POST',
        path: '/login',
        handler: (request, h) => {

            const { username, password } = request.payload;

            const user = users.find(user => equalsIgnoringCase(user.username, username) && user.password === password);

            if (!user) {
                throw Boom.unauthorized('The username or password is incorrect');
            }

            const { password: pass, ...profile } = user;
            return profile;
        },
        options: {
            validate: {
                payload: Joi.object({
                    username: Joi.string().alphanum().required(),
                    password: Joi.string().pattern(pattern).required()
                })
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/signup',
        handler: (request, h) => {

            const { username, password, email } = request.payload;

            if (users.some(user => equalsIgnoringCase(user.username, username))) {
                throw Boom.badRequest('Username already exists');
            }
            if (email && users.some(user => equalsIgnoringCase(user.email, email))) {
                throw Boom.badRequest('Email already exists');
            }

            users.push({ username, password, email });

            return { username, email };
        },
        options: {
            validate: {
                payload: Joi.object({
                    username: Joi.string().alphanum().required(),
                    password: Joi.string().pattern(pattern).required(),
                    email: Joi.string().email()
                })
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/profile/{username}',
        handler: (request, h) => {

            const { username } = request.params;

            const user = users.find(user => equalsIgnoringCase(user.username, username));
            if (!user) {
                throw Boom.unauthorized('User not found');
            }

            const { password: pass, ...profile } = user;
            return profile;
        },
        options: {
            validate: {
                params: Joi.object({
                    username: Joi.string().alphanum().required()
                })
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/profile/{username}',
        handler: (request, h) => {

            const { username } = request.params;

            const user = users.find(user => equalsIgnoringCase(user.username, username));
            if (!user) {
                throw Boom.unauthorized('User not found');
            }

            const { password, firstName, lastName } = request.payload;
            if (password) {
                const { error, value } = Joi.string().pattern(pattern).validate(password);
                if (error) {
                    throw Boom.badRequest('Invalid password format');
                }
            }

            Object.assign(user, { firstName, lastName }, password ? { password } : {});

            const { password: pass, ...profile } = user;
            return profile;
        },
        options: {
            validate: {
                params: Joi.object({
                    username: Joi.string().alphanum().required()
                })
            }
        }
    });

    server.route({
        method: '*',
        path: '/{any*}',
        handler: (request, h) => {

            return '404 Error! Page Not Found!';
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);

    server.route({
        method: 'GET',
        path: '/getall',
        handler: (request, h) => {

            return users;
        }
    });
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();