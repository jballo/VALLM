from flask import Blueprint

bp = Blueprint('scrape', __name__)

from backend.scrape import routes