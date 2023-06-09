from flask import Flask, request
from flask_login import LoginManager, UserMixin, login_user
from lxml import etree
import os

app = Flask(__name__)
login_manager = LoginManager()
login_manager.init_app(app)
app.config['SECRET_KEY'] = 'some-secret-key'

users = {}

class User(UserMixin):
    pass

@login_manager.user_loader
def user_loader(username):
    if username not in users:
        return

    user = User()
    user.id = username
    return user

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        # Aquí deberías verificar tus credenciales de alguna manera. 
        # Esto es solo un ejemplo y no es seguro.
        if username in users and users[username] == password:
            user = User()
            user.id = username
            login_user(user)
            return 'Logged in'
        
        return 'Bad login'

        # Guardamos el usuario en el XML.
        root = etree.Element('users')
        user_elem = etree.SubElement(root, 'user')
        user_elem.text = username
        tree = etree.ElementTree(root)
        with open('users.xml', 'wb') as f:
            tree.write(f)

    return 'Login page'

if __name__ == "__main__":
    app.run(port=5000)