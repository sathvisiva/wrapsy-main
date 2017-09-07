'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.sendmail = sendmail;
var nodemailer = require('nodemailer'),
    transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: 'admin@wrapsytest.com',
    pass: 'SS@thTinku'
  }
}),
    EmailTemplate = require('email-templates').EmailTemplate,
    path = require('path'),
    Promise = require('bluebird');

// Thank you!

function sendEmail(obj) {
  return transporter.sendMail(obj);
}

function loadTemplate(templateName, contexts) {
  var template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
  return Promise.all(contexts.map(function (context) {
    return new Promise(function (resolve, reject) {
      template.render(context, function (err, result) {
        if (err) reject(err);else resolve({
          email: result,
          context: context
        });
      });
    });
  }));
}

function sendmail(templ, data) {
  console.log(data);

  loadTemplate(templ, data).then(function (results) {
    return Promise.all(results.map(function (result) {
      sendEmail({
        to: result.context.email,
        from: '"Wrapsy" <admin@wrapsytest.com>',
        subject: result.email.subject,
        html: result.email.html,
        text: result.email.text
      });
    }));
  }).then(function () {
    console.log('Message Sent');
  });
}
//# sourceMappingURL=sendmail.js.map
