from app import app, db
from app.models import post
from flask import abort, jsonify, request
import datetime
import json

@app.route('/mylife/posts', methods = ['GET'])
def get_all_posts():
    entities = post.Post.query.all()
    return json.dumps([entity.to_dict() for entity in entities])

@app.route('/mylife/posts/<int:id>', methods = ['GET'])
def get_post(id):
    entity = post.Post.query.get(id)
    if not entity:
        abort(404)
    return jsonify(entity.to_dict())

@app.route('/mylife/posts', methods = ['POST'])
def create_post():
    entity = post.Post(
        content = request.json['content']
        , create_time = datetime.datetime.strptime(request.json['create_time'], "%Y-%m-%d").date()
        , update_time = datetime.datetime.strptime(request.json['update_time'], "%Y-%m-%d").date()
        , title = request.json['title']
    )
    db.session.add(entity)
    db.session.commit()
    return jsonify(entity.to_dict()), 201

@app.route('/mylife/posts/<int:id>', methods = ['PUT'])
def update_post(id):
    entity = post.Post.query.get(id)
    if not entity:
        abort(404)
    entity = post.Post(
        content = request.json['content'],
        create_time = datetime.datetime.strptime(request.json['create_time'], "%Y-%m-%d").date(),
        update_time = datetime.datetime.strptime(request.json['update_time'], "%Y-%m-%d").date(),
        title = request.json['title'],
        id = id
    )
    db.session.merge(entity)
    db.session.commit()
    return jsonify(entity.to_dict()), 200

@app.route('/mylife/posts/<int:id>', methods = ['DELETE'])
def delete_post(id):
    entity = post.Post.query.get(id)
    if not entity:
        abort(404)
    db.session.delete(entity)
    db.session.commit()
    return '', 204
