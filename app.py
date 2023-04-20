import requests
from flask import Flask, render_template, request, redirect, flash, url_for, session
import psycopg2.extras
import re
from werkzeug.security import generate_password_hash, check_password_hash
from geopy.geocoders import Nominatim

app = Flask(__name__)
app.secret_key = "adminkey"

DB_HOST = "localhost"
DB_NAME = "Doctor"
DB_USER = "postgres"
DB_PASS = "Admin"

# Connecting the database
conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER,
                        password=DB_PASS, host=DB_HOST)

# patient home page
@app.route('/')
def home():
    # Check if user is loggedin
    if 'loggedin' in session:
        # User is loggedin show them the home page
        return render_template('home.html', patientname=session['patient_name'])
    # User is not loggedin redirect to login page
    return redirect(url_for('login'))


# search doctor name route
@app.route('/search_doctor', methods=['GET', 'POST'])
def search_doctor():
    # Get the search query from the form
    if request.method == 'POST' and 'doctor_name' in request.form:
        query = request.form['doctor_name']

        if query:
            cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
            s = "SELECT * FROM doctors WHERE doctor_name LIKE %s"
            cur.execute(s, ['%' + query + '%'])

            results = cur.fetchall()
            print(results)

            if results:
                # Display results in table format
                return render_template('home.html', doctor_found=results)
            else:
                # No results found, display error message
                return render_template('home.html', error_message="Doctor Not Found")

    # render the search results page with the matching doctors
    return render_template('home.html')


# Doctor Map Location
@app.route('/map', methods=['GET', 'POST'])
def map():
    # return render_template('gmaps.html')
    if request.method == 'POST':
        doctor_location = request.form['doctor_location']
        bing_maps_api_key = "AoOruZG9yQNqu7fz6oTERwqYNzFDTMGiqUsqowL7XFgNhx2KOcwWBoqmkkvGaUZd"

        url = f"https://dev.virtualearth.net/REST/v1/Locations?q={doctor_location}&key={bing_maps_api_key}"
        response = requests.get(url).json()
        coordinates = response["resourceSets"][0]["resources"][0]["point"]["coordinates"]

        latitude = coordinates[0]
        longitude = coordinates[1]

        lat = latitude
        log = longitude

        print("latitude", lat)
        print("latitude", log)
        print("latitude", doctor_location)

        return render_template('map.html', doctor_location=doctor_location, lat=lat, log=log)
    return render_template('map.html')


# patient register page
@app.route('/register', methods=['GET', 'POST'])
def register():
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    # Check if "username", "password" and "email" POST requests exist (user submitted form)
    if request.method == 'POST' and 'patient_name' in request.form and 'patient_email' in request.form and 'patient_password' in request.form:
        # Create variables for easy access
        patient_name = request.form['patient_name']
        patient_email = request.form['patient_email']
        patient_password = request.form['patient_password']
        patient_disease = request.form['patient_disease']
        patient_city = request.form['patient_city']

        _hashed_password = generate_password_hash(patient_password)

        # Check if account exists using MySQL
        cursor.execute('SELECT * FROM patient WHERE patient_name = %s', (patient_name,))
        account = cursor.fetchone()
        print(account)
        # If account exists show error and validation checks
        if account:
            flash('Account already exists!')
        elif not patient_name or not patient_password or not patient_email or not patient_disease or not patient_city:
            flash('Please fill out all the fields of the form!')
        # elif not re.match(r'[A-Za-z0-9]+', patient_name):
        elif not patient_name.isalnum():
            flash('Username must contain only characters and numbers!')
        elif not re.match(r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', patient_password):
            flash('Password Should match this criteria, It should contain atleast 1 small letter ,'
                  '1 capital letter, 1 special letter and password length should be atleast 8')
        elif not re.match(r'[^@]+@[^@]+\.[^@]+', patient_email):
            flash('Invalid email address!\n Please Enter the email in proper format')
        else:
            # Account doesn't exist and the form data is valid, now insert new account into users table
            cursor.execute(
                "INSERT INTO patient(patient_name, patient_password, patient_email, patient_disease, patient_city) VALUES (%s,%s,%s,%s,%s)",
                (patient_name, _hashed_password, patient_email, patient_disease, patient_city))
            conn.commit()
            flash('You have successfully registered!')
    elif request.method == 'POST':
        # Form is empty... (no POST data)
        flash('Please fill out the form!')
    # Show registration form with message (if any)
    return render_template('register.html')


# patient Login page
@app.route('/login/', methods=['GET', 'POST'])
def login():
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    # Check if "username" and "password" POST requests exist (user submitted form)
    if request.method == 'POST' and 'patient_name' in request.form and 'patient_password' in request.form:
        patient_name = request.form['patient_name']
        patient_password = request.form['patient_password']
        print(patient_password)

        # Check if account exists using MySQL
        cursor.execute('SELECT * FROM patient WHERE patient_name = %s', (patient_name,))
        # Fetch one record and return result
        account = cursor.fetchone()

        if account:

            password_rs = account['patient_password']
            print(password_rs)

            if account['patient_name'] is None and account['patient_password'] is None:
                flash('Please fill out all the fields of the form!')

            # If account exists in users table in out database
            elif check_password_hash(password_rs, patient_password):
                # Create session data, we can access this data in other routes
                session['loggedin'] = True
                session['patient_id'] = account['patient_id']
                session['patient_name'] = account['patient_name']
                # Redirect to home page
                return redirect(url_for('home'))
            else:
                # Account doesn't exist or username/password incorrect
                flash('Incorrect username/password')

        else:
            # Account doesn't exist or username/password incorrect
            flash('Incorrect username/password')

    return render_template('login.html')


# patient logout page
@app.route('/logout')
def logout():
    # Remove session data, this will log the user out
    session.pop('loggedin', None)
    session.pop('patient_id', None)
    session.pop('patient_name', None)
    # Redirect to login page
    return redirect(url_for('login'))


# patient profile page
@app.route('/profile')
def profile():
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    # Check if user is loggedin
    if 'loggedin' in session:
        cursor.execute('SELECT * FROM patient WHERE patient_id = %s', [session['patient_id']])
        account = cursor.fetchone()
        # Show the profile page with account info
        return render_template('profile.html', account=account)
    # User is not loggedin redirect to login page
    return redirect(url_for('login'))


# admin register page
@app.route('/admin_register', methods=['GET', 'POST'])
def admin_register():
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    # Check if "username", "password" and "email" POST requests exist (user submitted form)
    if request.method == 'POST' and 'admin_name' in request.form and 'admin_email' in request.form and 'admin_password' in request.form:
        # Create variables for easy access
        admin_name = request.form['admin_name']
        admin_email = request.form['admin_email']
        admin_password = request.form['admin_password']

        _hashed_password = generate_password_hash(admin_password)

        # Check if account exists using MySQL
        cursor.execute('SELECT * FROM admin WHERE admin_name = %s', (admin_name,))
        account = cursor.fetchone()
        print(account)
        # If account exists show error and validation checks
        if account:
            flash('Account already exists!')
        elif not admin_name or not admin_password or not admin_email:
            flash('Please fill out the form!')
        # elif not re.match(r'[A-Za-z0-9]+', admin_name):
        elif not admin_name.isalnum():
            flash('Username must contain only characters and numbers!')
        elif not re.match(r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', admin_password):
            flash('Password Should match this criteria, It should contain at least 1 small letter ,'
                  '1 capital letter, 1 special letter and password length should be at least 8')
        elif not re.match(r'[^@]+@[^@]+\.[^@]+', admin_email):
            flash('Invalid email address!')
        else:
            # Account doesn't exist and the form data is valid, now insert new account into users table
            cursor.execute(
                "INSERT INTO admin(admin_name, admin_email, admin_password) VALUES (%s,%s,%s)",
                (admin_name, admin_email, _hashed_password))
            conn.commit()
            flash('You have successfully registered!')
    elif request.method == 'POST':
        # Form is empty... (no POST data)
        flash('Please fill out the form!')
    # Show registration form with message (if any)
    return render_template('admin_register.html')


# admin Login page
@app.route('/admin_login', methods=['GET', 'POST'])
def admin_login():
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    # Check if "username" and "password" POST requests exist (user submitted form)
    if request.method == 'POST' and 'admin_name' in request.form and 'admin_password' in request.form:
        admin_name = request.form['admin_name']
        admin_password = request.form['admin_password']
        print(admin_password)

        # Check if account exists using MySQL
        cursor.execute('SELECT * FROM admin WHERE admin_name = %s', (admin_name,))
        # Fetch one record and return result
        account = cursor.fetchone()

        if account:
            password_rs = account['admin_password']
            print(password_rs)
            # If account exists in users table in out database
            if check_password_hash(password_rs, admin_password):
                # Create session data, we can access this data in other routes
                session['admin_loggedin'] = True
                session['admin_id'] = account['admin_id']
                session['admin_name'] = account['admin_name']
                # Redirect to home page
                return redirect(url_for('index'))
            else:
                # Account doesnt exist or username/password incorrect
                flash('Incorrect username/password')
        else:
            # Account doesnt exist or username/password incorrect
            flash('Incorrect username/password')

    return render_template('admin_login.html')


# admin_index_page
@app.route('/index')
def index():
    # Check if user is admin_loggedin
    if 'admin_loggedin' in session:
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        s = "SELECT * FROM doctors"
        cur.execute(s)
        list_doctor = cur.fetchall()
        return render_template("index.html", list_doctor=list_doctor, admin_name=session['admin_name'])
        # Admin is loggedin show them the home page

    # Admin is not loggedin redirect to login page
    return redirect(url_for('admin_login'))


# admin profile page
@app.route('/admin_profile')
def admin_profile():
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    # Check if user is loggedin
    if 'admin_loggedin' in session:
        cursor.execute('SELECT * FROM admin WHERE admin_id = %s', [session['admin_id']])
        admin_account = cursor.fetchone()
        print(admin_account)
        # Show the profile page with account info
        return render_template('admin_profile.html', admin_account=admin_account)
    # User is not admin_loggedin redirect to login page
    return redirect(url_for('admin_login'))


# patient logout page
@app.route('/admin_logout')
def admin_logout():
    # Remove session data, this will log the admin out
    session.pop('admin_loggedin', None)
    session.pop('admin_id', None)
    session.pop('admin_name', None)
    # Redirect to admin login page
    return redirect(url_for('admin_login'))


# add doctor info
@app.route("/add_doctor", methods=['POST'])
def add_doctor():
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    doctor_name = request.form['doctor_name']
    doctor_specification = request.form['doctor_specification']
    building_name = request.form['building_name']
    building_floor = request.form['building_floor']
    doctor_location = request.form['doctor_location']
    doctor_mobile = request.form['doctor_mobile']
    cur.execute(
        "INSERT INTO doctors(doctor_name, doctor_specification, building_name, building_floor, "
        "doctor_location, doctor_mobile) VALUES (%s,%s,%s,%s,%s,%s)",
        (doctor_name, doctor_specification, building_name, building_floor, doctor_location, doctor_mobile))
    conn.commit()
    flash("Doctor Added Successfully")
    return redirect(url_for("index"))


# get doctor info
@app.route('/edit/<id>', methods=["POST", 'GET'])
def get_doctor(id):
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    s = "SELECT * FROM doctors WHERE id = %s"
    cur.execute(s, (id))
    data = cur.fetchall()
    cur.close()
    print(data[0])
    return render_template("edit.html", doctor=data[0])


# update doctor
@app.route('/update/<id>', methods=['POST'])
def update_doctor(id):
    if request.method == "POST":
        doctor_name = request.form['doctor_name']
        doctor_specification = request.form['doctor_specification']
        building_name = request.form['building_name']
        building_floor = request.form['building_floor']
        doctor_location = request.form['doctor_location']
        doctor_mobile = request.form['doctor_mobile']

        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute("""
            UPDATE doctors 
            SET doctor_name = %s,
                doctor_specification = %s,
                building_name = %s,
                building_floor = %s,
                doctor_location = %s,
                doctor_mobile = %s
            WHERE id = %s
            """, (doctor_name, doctor_specification, building_name, building_floor, doctor_location, doctor_mobile, id))
        flash("Doctor Updated Successfully")
        conn.commit()
        return redirect(url_for('index'))


# Delete doctor
@app.route("/delete/<string:id>", methods=['POST', 'GET'])
def delete_doctor(id):
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("DELETE FROM doctors WHERE id = {0}".format(id))
    conn.commit()
    flash("Doctor Removed Successfully")
    return redirect(url_for("index"))


# Map box map
@app.route("/mapbox_map",  methods=['POST', 'GET'])
def mapbox_map():
    if request.method == 'POST':
        doc_loc = request.form['doc_loc'];
        bing_maps_api_key = "AoOruZG9yQNqu7fz6oTERwqYNzFDTMGiqUsqowL7XFgNhx2KOcwWBoqmkkvGaUZd"

        url = f"https://dev.virtualearth.net/REST/v1/Locations?q={doc_loc}&key={bing_maps_api_key}"
        response = requests.get(url).json()
        coordinates = response["resourceSets"][0]["resources"][0]["point"]["coordinates"]

        latitude = coordinates[0]
        longitude = coordinates[1]

        lat = latitude
        log = longitude

        print("Latitude : ", lat)
        print("Longitude : ", log)
        print("Doctor Location : ", doc_loc)

        return render_template('mapbox_map.html', doc_loc=doc_loc, lat=lat, log=log)
    return render_template('mapbox_map.html')


# mapbox iframe page
@app.route('/mapbox_iframe')
def mapbox_iframe():
    lat = request.args.get('lat')
    log = request.args.get('log')
    
    print("Latitude of iframe", lat)
    print("Longitude of iframe", log)

    return render_template('mapbox_iframe.html', lat=lat, log=log)

# mapbox iframe page
@app.route('/indoor')
def indoor():
    return render_template('indoor.html')


if __name__ == "__main__":
    app.run(debug=True)
