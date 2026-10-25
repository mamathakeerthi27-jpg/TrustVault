
import os
from pathlib import Path

from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect

db = SQLAlchemy()
login_manager = LoginManager()
csrf = CSRFProtect()


def create_app():
    base_dir = Path(__file__).resolve().parent.parent
    instance_dir = base_dir / "instance"
    frontend_dist = base_dir / "trustvault" / "dist"

    instance_dir.mkdir(exist_ok=True)

    app = Flask(
        __name__,
        static_folder=str(frontend_dist / "assets"),
        static_url_path="/assets",
    )

    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
    if not app.config["SECRET_KEY"]:
        app.config["SECRET_KEY"] = "dev-only-change-this-key"

    app.config["SQLALCHEMY_DATABASE_URI"] = (
        os.environ.get("DATABASE_URL")
        or f"sqlite:///{instance_dir / 'trustvault.db'}"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["UPLOAD_FOLDER"] = str(base_dir / "uploads")
    app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024

    if os.environ.get("RENDER"):
        app.config["SESSION_COOKIE_SECURE"] = True
    app.config["SESSION_COOKIE_HTTPONLY"] = True
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

    db.init_app(app)
    login_manager.init_app(app)
    csrf.init_app(app)

    login_manager.login_view = "auth.login"

    with app.app_context():
        from trustvault import models
        db.create_all()

    from trustvault.auth import auth
    app.register_blueprint(auth)

    @app.route("/")
    def home():
        return send_from_directory(frontend_dist, "index.html")

    @app.route("/<path:path>")
    def frontend_routes(path):
        requested_file = frontend_dist / path

        if requested_file.is_file():
            return send_from_directory(frontend_dist, path)

        # Allow React to handle frontend routes.
        if not path.startswith("api/"):
            return send_from_directory(frontend_dist, "index.html")

        return {"error": "Not found"}, 404

    return app
