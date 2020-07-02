from flask import Flask, jsonify, render_template, request, redirect
import json
import os
import urllib.parse
from datetime import datetime

app = Flask(__name__,
            static_url_path='', 
            static_folder='static',
            template_folder='templates')

@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r

@app.route('/',methods=[ "GET",'POST'])
def index():
    return redirect("./index.html", code=302)

@app.route('/upload',methods=[ "GET",'POST'])
def upload():
    isthisFile=request.files.get('file')
    #print(isthisFile)
    #print(isthisFile.filename)
    isthisFile.save("static/data/"+isthisFile.filename)
    resp = jsonify(success=True)
    return resp

@app.route('/getposid',methods=[ "GET",'POST'])
def getposid():
    with open('static/data/count.txt', 'r') as file:
         count = file.read().replace('\n', '')
    return count , 200, {'Content-Type': 'text/plain; charset=utf-8'}

@app.route('/getconfig',methods=[ "GET",'POST'])
def getconfig():
    with open('static/data/config.csv', 'r') as file:
         text= file.read()
    return text , 200, {'Content-Type': 'text/plain; charset=utf-8'}

@app.route('/gettimestamp',methods=[ "GET",'POST'])
def gettimestamp():
    dateTimeObj = datetime.now()
    time = dateTimeObj.year + '/'+ dateTimeObj.month+ '/'+ dateTimeObj.day + ' '+ dateTimeObj.hour + ':' + dateTimeObj.minute+ ':'+ dateTimeObj.second # '.', dateTimeObj.microsecond
    return time , 200, {'Content-Type': 'text/plain; charset=utf-8'}

@app.route('/addposcsv',methods=[ "GET",'POST'])
def addposcsv():
    postext = urllib.parse.unquote(request.form["CSV"])
    lines = postext.split("|||")
    with open('static/data/pos.csv','a') as f:
         for item in lines:
             f.write("%s\n" % item)
         f.close()
    with open('static/data/count.txt', 'r') as file:
         count = file.read().replace('\n', '')
         file.close()
    with open('static/data/count.txt', 'w') as file:
         file.write(str(int(count) + 1))
         file.close()
    resp = jsonify(success=True)
    return resp


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
