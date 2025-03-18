from flask import Blueprint

bp = Blueprint('rag', __name__)

from app.rag import routes