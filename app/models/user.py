from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    
    account = db.Column(db.String)
    
    password = db.Column(db.String)
    
    name = db.Column(db.String)
    
    is_active = db.Column(db.Boolean)
    
    token = db.Column(db.String)
    

    def to_dict(self):
        return dict(
            account = self.account,
            password = self.password,
            name = self.name,
            is_active = self.is_active,
            token = self.token,
            id = self.id
        )

    def __repr__(self):
        return '<User %r>' % (self.id)
