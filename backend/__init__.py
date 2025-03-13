from flask import Flask
from flask_cors import CORS
from backend.config import Config
from backend import extensions

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Register Blueprints
    from backend.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api/v1')
    

    from backend.scrape import bp as scrape_bp
    app.register_blueprint(scrape_bp, url_prefix='/api/v1/scrape')

    from backend.rag import bp as rag_bp
    app.register_blueprint(rag_bp, url_prefix='/api/v1/retrieval-augmented-generations')

    # Add CORS
    CORS(app)

    return app

