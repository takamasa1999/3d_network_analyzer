import time
# py_start = time.perf_counter()
import pprint
import os
import sys
import copy
import json
import math
import numpy as np
import itertools
from collections import Counter
import pandas as pd
import networkx as nx
import plotly.graph_objects as go
import plotly.offline as po

def GetCombination(list_data, comb_num):
    list_comb = itertools.combinations(list_data, comb_num)
    list_comb = list(list_comb)
    return(list_comb)
def AddBr(str, width):
    str_rev = ""
    for i in range(0, len(str)):
        if i % width == 0 and i!=0:
            str_rev+= "<br>"
        str_rev+= str[i]
    return(str_rev)
def DataPreparation(data):
    data_rev = []
    for row in data:
        row_rev = []
        for elem in row:
            elem_rev = AddBr(elem, 12)
            row_rev.append(elem_rev)
        data_rev.append(row_rev)
    print(data_rev)
    col_name = data_rev[0]
    act_data = data_rev[1:]
    act_data_rev = AppendColumnName(col_name, act_data)
    dict = {"col_name":col_name, "act_data":act_data_rev}
    return(dict)
def AppendColumnName(col_list, data_list):
    arr1 =[]
    for row in data_list:
        arr2 = []
        i = 0
        try:
            for elem in row:
                elem = col_list[i] + "<br>⇒" + elem
                arr2.append(elem)
                i = i + 1
        except Exception as e:
            i = i + 1
            pass
        arr1.append(arr2)
    return(arr1)
def GetColumn(list_data, col_num):
    arr = []
    for row in list_data:
        arr.append(row[col_num])
    return(arr)
def ListCombine(list_1, list_2):
    arr = []
    i = 0
    for data in list_1:
        data_combine = data + "<br>&<br>" + list_2[i]
        arr.append(data_combine)
        i = i + 1
    return(arr) #同じ行の列同士を足し合わせ
def ElementCount(list_data):
    arr = []
    for data in list_data:
        data_count = list_data.count(data)
        arr.append(data_count)
    return(arr)
def GetSimpsonTable(list_data, col_num_1, col_num_2):
    col1 = GetColumn(list_data, col_num_1)
    col2 = GetColumn(list_data, col_num_2)
    col1_and_col2 = ListCombine(col1, col2)
    col1_count = ElementCount(col1)
    col2_count = ElementCount(col2)
    col1_and_col2_count = ElementCount(col1_and_col2)
    data_table = []
    dup_chk = []
    i = 0
    for elem in col1_and_col2:
        judge = elem in dup_chk
        if judge == False:
            dup_chk.append(elem)
            simpson = CalcSimpson(col1_count[i], col2_count[i], col1_and_col2_count[i])
            data_table.append([col1[i], col1_count[i], col2[i], col2_count[i], col1_and_col2[i], col1_and_col2_count[i], simpson])
        i = i + 1
    return(data_table)
def CalcSimpson(a_qty, b_qty, a_and_b_qty):
    Simpson = a_and_b_qty/min(a_qty, b_qty)
    return(Simpson)
def ApplyLowerLimit(list_data, col_num, th):
    arr = []
    for elem in list_data:
        if elem[col_num] > th:
            arr.append(elem)
    return(arr)
def GetNodeTable(list_data, n1, n1_q, n2, n2_q): #2組4列から1組2列へ。そして重複削除。2組間の重なり防止。
    arr = []
    for elem in list_data:
        arr.append([elem[n1], elem[n1_q]])
        arr.append([elem[n2], elem[n2_q]])
    arr2 = []
    for elem in arr:
        judge = elem in arr2
        if judge == False:
            arr2.append(elem)
    return(arr2)
def GetSpringLayout(list_data, n1, n1_w, n2, n2_w, e_w, coef):
    G = nx.Graph()
    node_data = GetNodeTable(master_tbl, n1, n1_w, n2, n2_w)
    for data in node_data:
        G.add_node(data[0], weight = data[1])
    for data in list_data:
        G.add_edge(data[n1], data[n2], weight = data[e_w]/1000)
    layout = nx.spring_layout(G, dim = 3)
    return(layout)
def ReferDictAddColumn(list_data, col_num, ref_dict):
    col_list = GetColumn(list_data, col_num)
    i = 0
    for elem in col_list:
        try:
            elem_pos = ref_dict[elem]
            list_data[i].append(elem_pos)
            i = i + 1
        except Exception as e:
            i = i + 1
            pass
    return(list_data)
def GetMidPoint(st_pos, fin_pos):
    arr = []
    for st_pt, fin_pt in zip(st_pos, fin_pos):
        mid_pt = st_pt + ((fin_pt - st_pt) / 2)
        arr.append([st_pt, mid_pt, fin_pt])
    return(arr)
def ValueToRGB(X, max, min, Ra, Ga, Ba, Aa,
                            Rb, Gb, Bb, Ab):
    if not max == min:
        R = (Rb-Ra)*((X-min)/(max-min)) + Ra
        G = (Gb-Ga)*((X-min)/(max-min)) + Ga
        B = (Bb-Ba)*((X-min)/(max-min)) + Ba
        A = (Ab-Aa)*((X-min)/(max-min)) + Ab
        return('rgba'+str((R, G, B, A)))
    else:
        return('rgba'+str((Rb, Gb, Bb, Ab)))
def RemoveBetween(data, st, end):
    st_pos = data.find(st)
    end_pos = data.find(end) + len(end)
    data_rev1 = data[:st_pos]
    data_rev2 = data[end_pos:]
    result = data_rev1 + data_rev2
    return(result)

server_dir = "C:/Server/Apache/Apache24/cgi-bin/3d_co_occurense_network/server/"

# jsonファイルの受け取り, ajax本番
user_ip = sys.argv[1]
lowest_occure = float(sys.argv[2])
lowest_simpson = float(sys.argv[3])
screen_size = float(sys.argv[4])
# pyテスト用引数
# user_ip = "2a02a44aa4f8199757ad764761452"
# lowest_occure = 20
# lowest_simpson = 0.3
# screen_size = float(16)

node_rel_size_coef = 2 # y=x^(-node_rel_size_coef), 数量差の大きいデータの幅を縮める
node_size_coef = 50
# node_dist_coef = 1000
edge_color_coef = node_rel_size_coef
occur_low_lim = lowest_occure #最低共起件数。
simpson_low_lim = lowest_simpson #シンプソン係数の下限値。

# jsonファイルをインポート（data type: list）
data_dir = server_dir + "cashe/" + user_ip + "_data.json"
data_open = open(data_dir, 'r', encoding="utf-8_sig")
data_load = json.load(data_open)
data_array = data_load["data_array"] #list内はstr型
req_dir = server_dir + "cashe/" + user_ip + "_req.json"
req_open = open(req_dir, 'r', encoding="utf-8_sig")
req_load = json.load(req_open)

#分析する列(index)の組み合わせを取得
checked_column = req_load["checked_column"] #list内はstr型
checked_column_comb = GetCombination(checked_column, 2)

#データの事前処理
prep_data = DataPreparation(data_array)
col_name = prep_data["col_name"]
act_data = prep_data["act_data"]
#欠損地の削除プログラムを実装予定

#グラフ描画のためのマスターテーブル作成
master_tbl = []
for col_num in checked_column_comb:
    col1 = int(col_num[0])
    col2 = int(col_num[1])
    act_data_rev = GetSimpsonTable(act_data, col1, col2)
    act_data_rev = ApplyLowerLimit(act_data_rev, 1, occur_low_lim)
    act_data_rev = ApplyLowerLimit(act_data_rev, 3, occur_low_lim)
    act_data_rev = ApplyLowerLimit(act_data_rev, 6, simpson_low_lim)
    for data in act_data_rev:
        master_tbl.append(data)
master_tbl_colname = ["elem1", "elem1_amount", "elem2", "elem2_amount",
                         "elem1&2", "elem1&2_amount", "simpson", "elem1_pos", "elem2_pos"]
node_layout = GetSpringLayout(master_tbl, 0, 1, 2, 3, 5, 100)
# node_layout_rev = {}
# for key, value in node_layout.items():
#     node_layout_rev[key] = np.array(value)*node_dist_coef
master_tbl = ReferDictAddColumn(master_tbl, 0, node_layout)
master_tbl = ReferDictAddColumn(master_tbl, 2, node_layout)
master_tbl.insert(0, master_tbl_colname)

plot_data = []

#ノードデータ処理
node_data = GetNodeTable(master_tbl[1:], 0, 1, 2, 3)
node_data = ReferDictAddColumn(node_data, 0, node_layout)
node_pos = GetColumn(node_data, 2)
node_val = np.array(GetColumn(node_data, 1))
node_size = [elem**(1/node_rel_size_coef) for elem in node_val]
node_size_max = max(node_size)
node_size_rel = [(num/node_size_max)*(screen_size/5) for num in node_size]
node_size_rel = np.array(node_size_rel)*node_size_coef
node_size_rel_max = max(node_size_rel)
node_size_rel_min = min(node_size_rel)
node_color = [ValueToRGB(num, node_size_rel_max , node_size_rel_min,
                         Ra = 255, Ga = 220, Ba = 220, Aa = 1,
                         Rb = 255, Gb = 0, Bb = 0, Ab = 1,) for num in node_size_rel]
node_txt_elem = [str(data[0]) for data in node_data]
node_txt_val = ["<br><br>occure = " + str(data[1]) for data in node_data]

#ノードデータ受け渡し
i = 0
for pos in node_pos:
    node_dict = {
        "hoverinfo":"text",
        "hovertext":node_txt_elem[i] + node_txt_val[i],
        "marker":{
            "color":node_color[i],
            "opacity":1,
            "size":node_size_rel[i],
            "line":{
                "width":100,
                "color":"rgb(0, 0, 0)",
                },
            },
        "mode":"markers+lines+text",
        "name":node_txt_elem[i] + node_txt_val[i],
        "text":node_txt_elem[i],
        "x":[pos[0]],
        "y":[pos[1]],
        "z":[pos[2]],
        "type":"scatter3d",
    }
    plot_data.append(node_dict)
    i = i + 1

#エッジデータ処理
edge_pos_st = GetColumn(master_tbl[1:], 7)
edge_pos_fin = GetColumn(master_tbl[1:], 8)
edge_pos = GetMidPoint(edge_pos_st, edge_pos_fin)
edge_txt_elem = []
edge_txt_val = []
for data in master_tbl[1:]:
    txt_elem = str(data[4])
    txt_val = ("<br><br>co-occure = " + str(data[5])
                + "<br>simpson = " + str(round(data[6], 4))
                )
    edge_txt_elem.append(txt_elem)
    edge_txt_val.append(txt_val)
edge_jec = GetColumn(master_tbl[1:], 6)
edge_jec_rev = [num**(1/edge_color_coef) for num in edge_jec]
edge_jec_max = max(edge_jec_rev)
edge_jec_min = min(edge_jec_rev)
edge_color = [ValueToRGB(data, edge_jec_max , edge_jec_min,
                         Ra = 0, Ga = 255, Ba = 255, Aa = 1,
                         Rb = 255, Gb = 0, Bb = 255, Ab = 1,) for data in edge_jec_rev]

#エッジデータ受け渡し。
i=0
for pos in edge_pos:
    edge_dict = {
        "hoverinfo":"text",
        "marker":{
            "color":edge_color[i],
            "opacity":1
            },
        "mode":"lines",
        "name":edge_txt_elem[i] + edge_txt_val[i],
        "text":[None, edge_txt_elem[i] + edge_txt_val[i], None],
        "x":[pos[0][0], pos[1][0], pos[2][0]],
        "y":[pos[0][1], pos[1][1], pos[2][1]],
        "z":[pos[0][2], pos[1][2], pos[2][2]],
        "type":"scatter3d",
        "line": {
            "width": screen_size/3,
            },
    }
    plot_data.append(edge_dict)
    i = i + 1

fig_out_dir = server_dir + "/cashe/" + user_ip + "_res.json"
plot_data_json = json.dumps(plot_data)
f = open(fig_out_dir, 'w')
f.write(plot_data_json)
f.close()

print("success!")
#処理時間の表示
# py_end = time.perf_counter() - py_start
# print("Process time:" + str(py_end))
