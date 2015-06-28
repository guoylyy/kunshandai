var Contact = AV.Object.extend('Contact');
var File = AV.Object.extend('_File');
var util = require('util');
var mlog = require('cloud/mlog.js');
var mutil = require('cloud/mutil.js');


function createContact(reqBody, u){
    var contact = new AV.Object('Contact');
    contact.set('owner', u);
    return updateContact(contact, reqBody);
};

function updateContact(contact, reqBody){
    contact.set('name',reqBody.name);
    contact.set('certificateType', reqBody.certificateType);
    contact.set('certificateNum', reqBody.certificateNum);
    contact.set('bankCardNumber', reqBody.bankCardNumber);
    contact.set('bankCardName', reqBody.bankCardName);
    contact.set('email', reqBody.email);
    contact.set('qq', reqBody.qq);
    contact.set('address', reqBody.address);
    contact.set('wechat', reqBody.wechat);
    contact.set('mobilePhoneNumber', reqBody.mobilePhoneNumber);
    contact.set('sendSmsOrNot', reqBody.sendSmsOrNot);
    return contact;
};

function bindContactFiles(contact, attachmentIds){
    var attachments = contact.relation("attachments");
    var query =  new AV.Query(File);
    if(attachmentIds){
        for (var i = attachmentIds.length - 1; i >= 0; i--) {
            var id = attachmentIds[i];
            query.get(id, {
                success: function(file){
                    attachments.add(file);
                    contact.save();
                },
                error: function(object, error){
                    console.log(error);
                }
            });
        };
    }else{
        return;
    }
};

function bindContactFile(contact, fileId){
    var query =  new AV.Query(File);
    query.get(fileId, {
        success: function(file){
            return file;
        },
        error: function(object, error){
            console.log(error);
        }
    });
};


exports.updateContact = updateContact;
exports.createContact = createContact;
exports.bindContactFiles = bindContactFiles;