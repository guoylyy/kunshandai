var Contract = AV.Object.extend('Contract');
var File = AV.Object.extend('_File');
var util = require('util');
var mlog = require('cloud/mlog.js');
var mutil = require('cloud/mutil.js');


function createContract(reqBody){
    var contract = new AV.Object('Contract');
    contract.set('name',reqBody.name);
    contract.set('certificateType', reqBody.certificateType);
    contract.set('certificateNum', reqBody.certificateNum);
    contract.set('email', reqBody.email);
    contract.set('qq', reqBody.qq);
    contract.set('address', reqBody.address);
    contract.set('wechat', reqBody.wechat);
    return contract;
};

function bindContractFiles(contract, attachmentIds){
    var attachments = contract.relation("attachments");
    var query =  new AV.Query(File);
    if(attachmentIds){
        for (var i = attachmentIds.length - 1; i >= 0; i--) {
            var id = attachmentIds[i];
            query.get(id, {
                success: function(file){
                    attachments.add(file);
                    contract.save();
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

function bindContractFile(contract, fileId){
    var query =  new AV.Query(File);
    query.get(fileId, {
        success: function(file){
            return file;
        },
        error: function(object, error){
            console.log(error);
        }
    });
}


function searchContract(certificateNum){

}


exports.createContract = createContract;
exports.bindContractFiles = bindContractFiles;