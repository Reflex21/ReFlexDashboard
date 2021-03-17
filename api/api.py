import time
import flask
import flask_sqlalchemy
import flask_praetorian
import flask_cors
import random
import string
import constants
from sqlalchemy import func

db = flask_sqlalchemy.SQLAlchemy()
guard = flask_praetorian.Praetorian()
cors = flask_cors.CORS()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text)
    hashed_password = db.Column(db.Text)
    roles = db.Column(db.Text)
    api_key = db.Column(db.Text)

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
    game = db.Column(db.Text)
    type = db.Column(db.Text)
    set_id = db.Column(db.Integer)
    value = db.Column(db.Float)

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
app.config["SQLALCHEMY_DATABASE_URI"] = constants.mysql_db_uri
db.init_app(app)

# Initializes CORS so that the api_tool can talk to the app
cors.init_app(app)

# Only uncomment to initialize DB
# with app.app_context():
#     db.create_all()
#     db.session.commit()


@app.route("/api/login", methods=["POST"])
def login():
    """
    Logs a user in by parsing a POST request containing user credentials and
    issuing a JWT token.
    .. example::
       $ curl http://localhost:5000/login -X POST \
         -d '{"username":"Walter","password":"calmerthanyouare"}'
    """
    try:
        req = flask.request.get_json(force=True)
        username = req.get("username", None)
        password = req.get("password", None)
        user = guard.authenticate(username, password)
        ret = {"access_token": guard.encode_jwt_token(user), "api_key":user.api_key}
        return flask.jsonify(ret), 200

    except Exception as e:
        return flask.jsonify(message=str(e))


@app.route("/api/signup", methods=["POST"])
def signup():
    """
    Creates a user by parsing a POST request containing user credentials and
    issuing a JWT token.
    .. example::
       $ curl http://localhost:5000/login -X POST \
         -d '{"username":"Walter","password":"calmerthanyouare"}'
    """
    try:
        req = flask.request.get_json(force=True)
        username = req.get("username", None)
        password = req.get("password", None)
        chars = string.ascii_letters + string.digits
        key = ''.join(random.choice(chars) for i in range(255))

        if User.query.filter_by(username=username).first() is None:
            with app.app_context():
                db.session.add(
                    User(
                        username=username,
                        hashed_password=guard.hash_password(password),
                        roles="user",
                        api_key=key,
                    )
                )
                db.session.commit()
            user = guard.authenticate(username, password)
            ret = {"access_token": guard.encode_jwt_token(user), "api_key":user.api_key}
            return flask.jsonify(ret), 200
        else:
            return flask.jsonify(message="User already exists.")

    except Exception as e:
        return flask.jsonify(message=str(e))


# @app.route("/protected")
# @flask_praetorian.auth_required
# def protected():
#     """
#     A protected endpoint. The auth_required decorator will require a header
#     containing a valid JWT
#     .. example::
#        $ curl http://localhost:5000/protected -X GET \
#          -H "Authorization: Bearer <your_token>"
#     """
#     return flask.jsonify(
#         message="protected endpoint (allowed user {})".format(
#             flask_praetorian.current_user().username,
#         )
#     )


# @app.route("/protected_admin_required")
# @flask_praetorian.roles_required("admin")
# def protected_admin_required():
#     """
#     A protected endpoint that requires a role. The roles_required decorator
#     will require that the supplied JWT includes the required roles
#     .. example::
#        $ curl http://localhost:5000/protected_admin_required -X GET \
#           -H "Authorization: Bearer <your_token>"
#     """
#     return flask.jsonify(
#         message="protected_admin_required endpoint (allowed user {})".format(
#             flask_praetorian.current_user().username,
#         )
#     )


@app.route("/api/data/add", methods=['POST'])
@flask_praetorian.auth_required
def add_data_dashboard():
    try:
        user = User.query.filter_by(username=flask_praetorian.current_user().username).first()
        content = flask.request.get_json(force=True)  # This grabs JSON object sent over

        # Get the current set_id so we know what to insert into the db
        set_id = 0
        max_set_id = db.session.query(func.max(DataPoint.set_id)).scalar()
        if max_set_id is None:
            set_id = 0
        else:
            set_id = max_set_id + 1

        data_list = []

        for data_entry in content['data']:
            data_type = data_entry['type']
            game_type = data_entry['game']
            datapoints = data_entry['datapoints']
            timestamp = int(time.time())

            for d in datapoints:
                data_list.append(DataPoint(
                    timestamp=timestamp,
                    user_id=user.id,
                    type=data_type,
                    game=game_type,
                    set_id=set_id,
                    value=d
                ))

        with app.app_context():
            for obj in data_list:
                db.session.add(obj)

            db.session.commit()

        return flask.jsonify(message="Success")

    except Exception as e:
        return flask.jsonify(message=str(e))


@app.route("/api/data/unity", methods=['POST'])
def add_data_unity():
    try:
        content = flask.request.get_json(force=True)  # This grabs JSON object sent over
        user = User.query.filter_by(api_key=content['api_key']).first()

        if user:
            # Get the current set_id so we know what to insert into the db
            set_id = 0
            max_set_id = db.session.query(func.max(DataPoint.set_id)).scalar()
            if max_set_id is None:
                set_id = 0
            else:
                set_id = max_set_id + 1

            data_list = []

            for data_entry in content['data']:
                data_type = data_entry['type']
                game_type = data_entry['game']
                datapoints = data_entry['datapoints']
                timestamp = int(time.time())

                for d in datapoints:
                    data_list.append(DataPoint(
                        timestamp=timestamp,
                        user_id=user.id,
                        type=data_type,
                        game=game_type,
                        set_id=set_id,
                        value=d
                    ))

            with app.app_context():
                for obj in data_list:
                    db.session.add(obj)

                db.session.commit()

            return flask.jsonify(message="Success")
        else:
            return flask.jsonify(message="Invalid API Key")

    except Exception as e:
        return flask.jsonify(message=str(e))


@app.route("/api/validate", methods=['POST'])
def validate_api_key():
    try:
        content = flask.request.get_json(force=True)  # This grabs JSON object sent over
        user = User.query.filter_by(api_key=content['api_key']).first()
        if user:
            return flask.jsonify(message="Success")
        else:
            return flask.jsonify(message="Invalid API Key")

    except Exception as e:
        return flask.jsonify(message=str(e))


@app.route("/api/data/<type>", methods=['GET'])
@flask_praetorian.auth_required
def get_data(type):
    try:
        user = User.query.filter_by(username=flask_praetorian.current_user().username).first()
        results = [r.to_dict() for r in DataPoint.query.filter_by(user_id=user.id, type=type).all()]
        return flask.jsonify(results)

    except Exception as e:
        return flask.jsonify(message=str(e))


@app.route("/api/userinfo", methods=['GET'])
@flask_praetorian.auth_required
def get_userinfo():
    try:
        user = User.query.filter_by(username=flask_praetorian.current_user().username).first()
        return flask.jsonify({"username": user.username, "api_key":user.api_key})

    except Exception as e:
        return flask.jsonify(message=str(e))


# Run the app
if __name__ == "__main__":

    app.run(host="0.0.0.0", port=5000)



