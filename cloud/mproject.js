var util = require('util');
var mlog=require('cloud/mlog.js');

/**
 * 分阶段创建项目
 * 1. 创建项目信息
 * 2. 创建联系人
 * 3. 根据以上的两个信息来确定一个项目，生成主项目
 */
function createBasicProject(res, token, data){
	var project = new AV.object('Project');
	project.set('name',name);
	return project;
}

function createProjectUser(res, token, data){

}

function generateProject(res, token, data){

}


/*
	创建项目对象定义
 */
function createTicket(res, token, client, attachment, title, type, content, secret, then) {
    mticket.incTicketNReturnOrigin().then(function (n) {
        var ticket = new AV.Object('Ticket');
        if (attachment) {
            ticket.set('attachment', attachment);
        }
        mlog.log('secret=' + secret);
        if (secret) {
            ticket.set('open', secret_content);
        } else {
            ticket.set('open', open_content);
        }
        ticket.set('cid', client.id);
        ticket.set('client_email', client.email);
        ticket.set('type', type);
        ticket.set('client_token', token);
        ticket.set('status', todo_status);
        ticket.set('title', title);
        ticket.set('content', content);
        ticket.set('tid', n);
        ticket.save().then(function (ticket) {
            var text = '<p>Client:    ' + client.username + '</p><p> Type:    ' + type + '</p><p> Title:    <pre>' + title + '</pre></p><p>Content:    <pre>' + content + '</pre></p>';
            text += generateAdminReplyLink(ticket);
            sendEmail(ticket, 'New ticket', text);
            var info = '新的工单！';
            notifyTicketToChat(ticket, content, info);
            then(ticket);
        }, renderErrorFn(res));
    });
}

exports.createBasicProject=createBasicProject;