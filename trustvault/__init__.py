

from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect
from pathlib import Path

db = SQLAlchemy()
login_manager = LoginManager()
csrf = CSRFProtect()


def create_app():
    app = Flask(__name__)

    base_dir = Path(__file__).resolve().parent.parent
    instance_dir = base_dir / "instance"
    instance_dir.mkdir(exist_ok=True)

    app.config["SECRET_KEY"] = "dev-key-change-before-deployment"
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        f"sqlite:///{instance_dir / 'trustvault.db'}"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["UPLOAD_FOLDER"] = str(base_dir / "uploads")
    app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024

    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    csrf.init_app(app)

    login_manager.login_view = "auth.login"

    # Home page
    @app.route("/")
    def home():
        return render_template("index.html")

    # Register database models and create tables
    with app.app_context():
        from trustvault import models
        db.create_all()

    # Register authentication routes once
    from trustvault.auth import auth
    app.register_blueprint(auth)

    return app



