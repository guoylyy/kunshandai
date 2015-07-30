# -*- coding: UTF-8 -*-
import smtplib  
from email.mime.text import MIMEText
mailto_list=['yiliangg@foxmail.com','541702358@qq.com'] 
mail_host="smtp.qq.com"  #设置服务器
mail_user="327272993"    #用户名
mail_pass="9011238cy"   #口令 
mail_postfix="qq.com"  #发件箱的后缀
  
def send_mail(to_list,sub,content):  
    me="hello"+"<"+mail_user+"@"+mail_postfix+">"  
    msg = MIMEText(content,_subtype='plain',_charset='utf-8')  
    msg['Subject'] = sub  
    msg['From'] = me  
    msg['To'] = ";".join(to_list)  
    try:  
        server = smtplib.SMTP()  
        server.connect(mail_host)  
        server.login(mail_user,mail_pass)  
        server.sendmail(me, to_list, msg.as_string())  
        server.close()  
        return True  
    except Exception, e:  
        print str(e)  
        return False  
if __name__ == '__main__':  
    if send_mail(mailto_list,"昆山贷款网","张先生，您好，您的贷款项目张传庚10432还有3天就要还款了,本次还款金额 10432.00 元，请做好还款准备，以免造成不必要的损失。"):  
        print "发送成功"  
    else:  
        print "发送失败"