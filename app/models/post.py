from app import db

class Post(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    
    content = db.Column(db.String)
    
    create_time = db.Column(db.Date)
    
    update_time = db.Column(db.Date)
    
    title = db.Column(db.String)
    

    def to_dict(self):
        return dict(
            content = self.content,
            create_time = self.create_time.isoformat(),
            update_time = self.update_time.isoformat(),
            title = self.title,
            id = self.id
        )

    def __repr__(self):
        return '<Post %r>' % (self.id)
