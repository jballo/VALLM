from flask import Blueprint

bp = Blueprint('websocket', __name__)

from app.websocket import routes