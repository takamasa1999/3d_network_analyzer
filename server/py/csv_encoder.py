#! C:/Programming_Languages/Python/Python_3.10.5/python.exe
import io
import sys
import csv
import cgi
import chardet

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8') #print出力の文字コード指定。

form_data = cgi.FieldStorage()
csv_byte = form_data.getvalue("file_select")
csv_type = chardet.detect(csv_byte)
csv_type = csv_type['encoding']

csv_decode = csv_byte.decode(encoding = csv_type)

print('Content-Type: text/plain; charset=UTF-8\n')
print(csv_decode)
