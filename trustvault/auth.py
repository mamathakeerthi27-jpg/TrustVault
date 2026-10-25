import os
import uuid
from pathlib import Path
from flask import jsonify
from flask_wtf.csrf import generate_csrf

from flask import (
    Blueprint,
    abort,
    current_app,
    flash,
    redirect,
    render_template,
    request,
    send_from_directory,
    url_for,
)
from flask_login import (
    current_user,
    login_required,
    login_user,
    logout_user,
)
from sqlalchemy.exc import IntegrityError
from werkzeug.utils import secure_filename

from trustvault import db
from trustvault.models import User, Document, DocumentShare

auth = Blueprint("auth", __name__)

ALLOWED_EXTENSIONS = {"pdf", "docx", "txt", "png", "jpg", "jpeg"}


@auth.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for("auth.dashboard"))

    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        confirm = request.form.get("confirm_password", "")

        if not name or not email or not password:
            flash("Please fill in all fields.", "error")
        elif len(password) < 8:
            flash("Password must be at least 8 characters.", "error")
        elif password != confirm:
            flash("Passwords do not match.", "error")
        elif User.query.filter_by(email=email).first():
            flash("An account with this email already exists.", "error")
        else:
            user = User(name=name, email=email, role="owner")
            user.set_password(password)
            db.session.add(user)

            try:
                db.session.commit()
                flash("Account created. Please log in.", "success")
                return redirect(url_for("auth.login"))
            except IntegrityError:
                db.session.rollback()
                flash("Could not create the account. Please try again.", "error")

    return render_template("register.html")


@auth.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("auth.dashboard"))

    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        user = User.query.filter_by(email=email).first()

        if user and user.check_password(password):
            login_user(user)
            flash("Welcome back!", "success")
            return redirect(url_for("auth.dashboard"))

        flash("Invalid email or password.", "error")

    return render_template("login.html")


@auth.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    flash("You have been logged out.", "success")
    return redirect(url_for("home"))
    
@auth.route("/api/logout", methods=["POST"])
def api_logout():
    if not current_user.is_authenticated:
        return jsonify({
            "success": True,
            "message": "Already logged out"
        }), 200

    logout_user()

    return jsonify({
        "success": True,
        "message": "Logged out successfully"
    }), 200

@auth.route("/api/signup", methods=["POST"])
def api_signup():
    data = request.get_json(silent=True) or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    role = data.get("role", "")

    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "Name, email and password are required"
        }), 400

    if len(password) < 8:
        return jsonify({
            "success": False,
            "message": "Password must contain at least 8 characters"
        }), 400

    if role not in ("owner", "viewer"):
        return jsonify({
            "success": False,
            "message": "Invalid account role"
        }), 400

    if User.query.filter_by(email=email).first():
        return jsonify({
            "success": False,
            "message": "An account with this email already exists"
        }), 409

    user = User(
        name=name,
        email=email,
        role=role,
        status="pending" if role == "owner" else "active"
    )
    user.set_password(password)

    try:
        db.session.add(user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": "An account with this email already exists"
        }), 409

    # Only active viewer accounts receive a login session.
    if role == "viewer":
        login_user(user)

    is_pending = role == "owner"

    return jsonify({
        "success": True,
        "isPending": is_pending,
        "message": (
            "Registration submitted for approval"
            if is_pending else "Registration successful"
        ),
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "status": user.status
        }
    }), 201



@auth.route("/dashboard")
@login_required
def dashboard():
    return render_template("dashboard.html", user=current_user)


@auth.route("/upload", methods=["GET", "POST"])
@login_required
def upload_document():
    if request.method == "POST":
        file = request.files.get("document")
        title = request.form.get("title", "").strip()
        category = request.form.get("category", "General").strip()

        if not file or not file.filename:
            flash("Please select a file.", "error")
            return redirect(url_for("auth.upload_document"))

        original_name = secure_filename(file.filename)
        extension = Path(original_name).suffix.lower().lstrip(".")

        if not original_name or extension not in ALLOWED_EXTENSIONS:
            flash("File type not allowed.", "error")
            return redirect(url_for("auth.upload_document"))

        if not title:
            title = Path(original_name).stem

        if len(title) > 200 or len(category) > 100:
            flash("Title or category is too long.", "error")
            return redirect(url_for("auth.upload_document"))

        stored_name = f"{uuid.uuid4().hex}.{extension}"
        upload_folder = current_app.config["UPLOAD_FOLDER"]
        os.makedirs(upload_folder, exist_ok=True)
        saved_path = os.path.join(upload_folder, stored_name)

        try:
            file.save(saved_path)
            document = Document(
                title=title,
                filename=stored_name,
                category=category or "General",
                owner_id=current_user.id,
            )
            db.session.add(document)
            db.session.commit()
            flash("Document uploaded successfully!", "success")
            return redirect(url_for("auth.my_documents"))

        except Exception:
            db.session.rollback()
            if os.path.exists(saved_path):
                os.remove(saved_path)
            current_app.logger.exception("Document upload failed")
            flash("Upload failed. Please try again.", "error")

    return render_template("upload.html")


@auth.route("/my-documents")
@login_required
def my_documents():
    documents = (
        Document.query
        .filter_by(owner_id=current_user.id)
        .order_by(Document.uploaded_at.desc())
        .all()
    )

    shared_documents = (
        Document.query
        .join(DocumentShare, DocumentShare.document_id == Document.id)
        .filter(DocumentShare.user_id == current_user.id)
        .order_by(Document.uploaded_at.desc())
        .all()
    )

    return render_template(
        "my_documents.html",
        documents=documents,
        shared_documents=shared_documents,
    )


@auth.route("/document/<int:document_id>/download")
@login_required
def download_document(document_id):
    document = Document.query.get_or_404(document_id)

    is_owner = document.owner_id == current_user.id
    has_access = (
        DocumentShare.query.filter_by(
            document_id=document.id,
            user_id=current_user.id,
            permission="viewer",
        ).first()
        is not None
    )

    if not is_owner and not has_access:
        abort(403)

    return send_from_directory(
        current_app.config["UPLOAD_FOLDER"],
        document.filename,
        as_attachment=True,
        download_name=document.filename,
    )


@auth.route("/document/<int:document_id>/delete", methods=["POST"])
@login_required
def delete_document(document_id):
    document = Document.query.get_or_404(document_id)

    if document.owner_id != current_user.id:
        abort(403)

    file_path = os.path.join(
        current_app.config["UPLOAD_FOLDER"],
        document.filename,
    )

    try:
        # Remove share records first so foreign-key constraints do not block deletion.
        DocumentShare.query.filter_by(document_id=document.id).delete(
            synchronize_session=False
        )

        if os.path.exists(file_path):
            os.remove(file_path)

        db.session.delete(document)
        db.session.commit()
        flash("Document deleted successfully.", "success")

    except Exception:
        db.session.rollback()
        current_app.logger.exception("Document deletion failed")
        flash("Could not delete the document.", "error")

    return redirect(url_for("auth.my_documents"))


@auth.route("/document/<int:document_id>/share", methods=["POST"])
@login_required
def share_document(document_id):
    document = Document.query.get_or_404(document_id)

    if document.owner_id != current_user.id:
        abort(403)

    email = request.form.get("email", "").strip().lower()
    recipient = User.query.filter_by(email=email).first()

    if not recipient:
        flash("No registered user found with that email.", "error")
        return redirect(url_for("auth.my_documents"))

    if recipient.id == current_user.id:
        flash("You already own this document.", "error")
        return redirect(url_for("auth.my_documents"))

    existing = DocumentShare.query.filter_by(
        document_id=document.id,
        user_id=recipient.id,
    ).first()

    if existing:
        flash("This document is already shared with that user.", "error")
    else:
        share = DocumentShare(
            document_id=document.id,
            user_id=recipient.id,
            granted_by=current_user.id,
            permission="viewer",
        )

        db.session.add(share)
        try:
            db.session.commit()
            flash("Document access granted successfully.", "success")
        except IntegrityError:
            db.session.rollback()
            flash("Could not share this document. Please try again.", "error")

    return redirect(url_for("auth.my_documents"))


@auth.route("/document/share/<int:share_id>/revoke", methods=["POST"])
@login_required
def revoke_document_share(share_id):
    share = DocumentShare.query.get_or_404(share_id)

    # Only the document owner can revoke the share.
    if share.document.owner_id != current_user.id:
        abort(403)

    
    db.session.delete(share)
    db.session.commit()
    flash("Document access revoked successfully.", "success")
    return redirect(url_for("auth.my_documents"))




@auth.route("/api/me", methods=["GET"])
def api_me():
    if not current_user.is_authenticated:
        return jsonify({
            "authenticated": False,
            "user": None
        }), 200

    # Block stale sessions for accounts that are not active.
    if current_user.status != "active":
        logout_user()
        return jsonify({
            "authenticated": False,
            "user": None
        }), 200

    return jsonify({
        "authenticated": True,
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "role": current_user.role,
            "status": current_user.status
        }
    }), 200



@auth.route("/api/login", methods=["POST"])
def api_login():
    data = request.get_json(silent=True) or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required"
        }), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({
            "success": False,
            "message": "Invalid email or password"
        }), 401

    # Block accounts that are not active.
    if user.status != "active":
        return jsonify({
            "success": False,
            "message": "Your account is pending approval."
        }), 403

    login_user(user)

    return jsonify({
        "success": True,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "status": user.status
        }
    }), 200

@auth.route("/api/csrf-token", methods=["GET"])
def api_csrf_token():
    return jsonify({
        "csrf_token": generate_csrf()
    }), 200
