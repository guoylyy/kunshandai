from app import app, db
from app.models import user
from flask import abort, jsonify, request
import datetime
import json

@app.route('/mylife/users', methods = ['GET'])
def get_all_users():
    entities = user.User.query.all()
    return json.dumps([entity.to_dict() for entity in entities])

@app.route('/mylife/users/<int:id>', methods = ['GET'])
def get_user(id):
    entity = user.User.query.get(id)
    if not entity:
        abort(404)
    return jsonify(entity.to_dict())

@app.route('/mylife/users', methods = ['POST'])
def create_user():
    entity = user.User(
        account = request.json['account']
        , password = request.json['password']
        , name = request.json['name']
        , is_active = request.json['is_active']
        , token = request.json['token']
    )
    db.session.add(entity)
    db.session.commit()
    return jsonify(entity.to_dict()), 201

@app.route('/mylife/users/<int:id>', methods = ['PUT'])
def update_user(id):
    entity = user.User.query.get(id)
    if not entity:
        abort(404)
    entity = user.User(
        account = request.json['account'],
        password = request.json['password'],
        name = request.json['name'],
        is_active = request.json['is_active'],
        token = request.json['token'],
        id = id
    )
    db.session.merge(entity)
    db.session.commit()
    return jsonify(entity.to_dict()), 200

@app.route('/mylife/users/<int:id>', methods = ['DELETE'])
def delete_user(id):
    entity = user.User.query.get(id)
    if not entity:
        abort(404)
    db.session.delete(entity)
    db.session.commit()
    return '', 204
