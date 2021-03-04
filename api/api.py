import time
import flask
import flask_sqlalchemy
import flask_praetorian

db = flask_sqlalchemy.SQLAlchemy()
guard = flask_praetorian.Praetorian()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True)
    hashed_password = db.Column(db.Text)
    roles = db.Column(db.Text)

    @property
    def identity(self):
        """
        *Required Attribute or Property*

        flask-praetorian requires that the user class has an ``identity`` instance
        attribute or property that provides the unique id of the user instance
        """
        return self.id

    @property
    def rolenames(self):
        """
        *Required Attribute or Property*

        flask-praetorian requires that the user class has a ``rolenames`` instance
        attribute or property that provides a list of strings that describe the roles
        attached to the user instance
        """
        try:
            return self.roles.split(",")
        except Exception:
            return []

    @property
    def password(self):
        """
        *Required Attribute or Property*

        flask-praetorian requires that the user class has a ``password`` instance
        attribute or property that provides the hashed password assigned to the user
        instance
        """
        return self.hashed_password

    @classmethod
    def lookup(cls, username):
        """
        *Required Method*

        flask-praetorian requires that the user class implements a ``lookup()``
        class method that takes a single ``username`` argument and returns a user
        instance if there is one that matches or ``None`` if there is not.
        """
        return cls.query.filter_by(username=username).one_or_none()

    @classmethod
    def identify(cls, id):
        """
        *Required Method*

        flask-praetorian requires that the user class implements an ``identify()``
        class method that takes a single ``id`` argument and returns user instance if
        there is one that matches or ``None`` if there is not.
        """
        return cls.query.get(id)


class DataPoint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    type = db.Column(db.Text)
    set_id = db.Column(db.Integer)
    value = db.Column(db.Numeric(asdecimal=False))

    def __repr__(self):
        return '<DataPoint %d>' % self.timestamp

    def to_dict(self):
        return {
            "id": self.id,
            "timestamp": self.timestamp,
            "user_id": self.user_id,
            "type": self.type,
            "set_id": self.set_id,
            "value": self.value
        }


# Initialize flask app
app = flask.Flask(__name__)
app.debug = True
app.config["SECRET_KEY"] = "top secret"
app.config["JWT_ACCESS_LIFESPAN"] = {"hours": 24}
app.config["JWT_REFRESH_LIFESPAN"] = {"days": 30}

# Initialize the flask-praetorian instance for the app
guard.init_app(app, User)

# Initialize a local database for the example
local_database = "test.db"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///{}".format(local_database)
db.init_app(app)

"""
# Add users for the example
with app.app_context():
    db.create_all()
    db.session.add(
        User(
            username="astewart",
            hashed_password=guard.hash_password("test"),
            roles="admin",
        )
    )
    db.session.add(
        User(
            username="random",
            hashed_password=guard.hash_password("hi"),
        )
    )
    db.session.commit()
"""

@app.route("/api/login", methods=["POST"])
def login():
    """
    Logs a user in by parsing a POST request containing user credentials and
    issuing a JWT token.
    .. example::
       $ curl http://localhost:5000/login -X POST \
         -d '{"username":"Walter","password":"calmerthanyouare"}'
    """
    req = flask.request.get_json(force=True)
    username = req.get("username", None)
    password = req.get("password", None)
    user = guard.authenticate(username, password)
    ret = {"access_token": guard.encode_jwt_token(user)}
    return flask.jsonify(ret), 200


@app.route("/protected")
@flask_praetorian.auth_required
def protected():
    """
    A protected endpoint. The auth_required decorator will require a header
    containing a valid JWT
    .. example::
       $ curl http://localhost:5000/protected -X GET \
         -H "Authorization: Bearer <your_token>"
    """
    return flask.jsonify(
        message="protected endpoint (allowed user {})".format(
            flask_praetorian.current_user().username,
        )
    )


@app.route("/protected_admin_required")
@flask_praetorian.roles_required("admin")
def protected_admin_required():
    """
    A protected endpoint that requires a role. The roles_required decorator
    will require that the supplied JWT includes the required roles
    .. example::
       $ curl http://localhost:5000/protected_admin_required -X GET \
          -H "Authorization: Bearer <your_token>"
    """
    return flask.jsonify(
        message="protected_admin_required endpoint (allowed user {})".format(
            flask_praetorian.current_user().username,
        )
    )


@app.route("/api/data/add", methods=['POST'])
@flask_praetorian.auth_required
def add_data():
    try:
        content = flask.request.get_json(force=True) # This grabs JSON object sent over
    except Exception:
        pass
    finally:
        return flask.jsonify("Success")


@app.route("/api/data/<type>", methods=['GET'])
@flask_praetorian.auth_required
def get_data(type):
    user = User.query.filter_by(username=flask_praetorian.current_user().username).first()
    print(user.id)
    print(type)
    results = [r.to_dict() for r in DataPoint.query.filter_by(user_id=user.id, type=type).all()]
    print(results)

    return flask.jsonify(results)


# Run the example
if __name__ == "__main__":
    app.run(host="localhost", port=5000)