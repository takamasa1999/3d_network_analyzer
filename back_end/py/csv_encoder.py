#! C:/Programming_Languages/Python/Python_3.10.5/python.exe

import io
import sys
import csv
import cgi
import chardet
import pandas as pd
import json
#
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8') #print出力の文字コード指定。
print('Content-Type: text/html; charset=UTF-8\n')
server_dir = "C:/Server/Apache/Apache24/cgi-bin/3d_network_analyzer_server/"
#
form_data = cgi.FieldStorage()
csv_data = form_data["file_select"]
page_id = form_data.getvalue("page_id")

csv_byte = form_data.getvalue("file_select")
csv_type = chardet.detect(csv_byte)
csv_type = csv_type['encoding']

csv_read = pd.read_csv(csv_data.file, encoding=csv_type)
csv_json = csv_read.to_json(orient = "split")
#
file_name = page_id + '_array.json'
file_dir = server_dir + 'cashe/' + file_name
file = open(file_dir, "w")
file.write(csv_json)
file.close()
