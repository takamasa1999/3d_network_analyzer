import os
import glob

temp_dir = "C:/Server/Apache/Apache24/htdocs/3D_Analytics/data_check/temp_stor/"
htmls = glob.glob(temp_dir+"/*.html")
all_files = glob.glob(temp_dir+"/*")

def get_oldest(files):
    oldest_time = 1000000000000000000000000
    for file  in files:
        file_time = os.path.getmtime(file)
        if file_time < oldest_time:
            oldest_time = file_time
            oldest_file = file
    return(oldest_file, oldest_file[:-5]+".csv")

if len(all_files) > 10:
    for dir in get_oldest(htmls):
        try:
            os.remove(dir)
        except Exception:
            pass
