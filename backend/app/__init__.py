from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.extensions import openai_client
from app.extensions import groq_client

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Register Blueprints
    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    from app.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api/v1')
    
    from app.scrape import bp as scrape_bp
    app.register_blueprint(scrape_bp, url_prefix='/api/v1/scrape')

    from app.rag import bp as rag_bp
    app.register_blueprint(rag_bp, url_prefix='/api/v1/retrieval-augmented-generations')

    # Add CORS
    CORS(app)

    return app

