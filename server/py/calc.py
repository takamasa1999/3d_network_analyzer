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

def DataPreparation(data):
    col_name = data[0]
    act_data = data[1:]
    act_data_rev = AppendColumnName(data[0], data[1:])
    dict = {"col_name":col_name, "act_data":act_data_rev}
    return(dict)

def AppendColumnName(col_list, data_list):
    arr1 =[]
    for row in data_list:
        arr2 = []
        i = 0
        try:
            for elem in row:
                elem = "colmun: " + col_list[i] + "<br>element: " + elem
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
        G.add_edge(data[n1], data[n2], weight = data[e_w])
    k = 1/(len(G.nodes)**(1/coef))
    layout = nx.spring_layout(G, dim = 3, k = k)
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
# オリジナルRGB変換関数。分母のゼロを避けるために+1
def ValueToRGB(X, max, min, Ra=0, Ga=255, Ba=255, Aa =0,
                            Rb=255, Gb=0, Bb=255, Ab = 1):
    R = (Rb-Ra)*((X-min+1)/(max-min+1)) + Ra
    G = (Gb-Ga)*((X-min+1)/(max-min+1)) + Ga
    B = (Bb-Ba)*((X-min+1)/(max-min+1)) + Ba
    a = (Ab-Aa)*((X-min+1)/(max-min+1)) + Ab
    return('rgba'+str((R, G, B, a)))

def RemoveBetween(data, st, end):
    st_pos = data.find(st)
    end_pos = data.find(end) + len(end)
    data_rev1 = data[:st_pos]
    data_rev2 = data[end_pos:]
    result = data_rev1 + data_rev2
    return(result)

server_dir = "C:/Server/Apache/Apache24/cgi-bin/3d_co_occurense_network/server/"

#jsonファイルの受け取り, ajax本番
user_ip = sys.argv[1]
lowest_occure = float(sys.argv[2])
lowest_simpson = float(sys.argv[3])
#pyテスト用引数
# user_ip = "2a02a44aa4f81c53fdd86f27b397e"
# lowest_occure = 0
# lowest_simpson = 0

scatter_coef  = math.e #アルゴリズム完成次第、引数化する予定、、
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
node_pos = GetSpringLayout(master_tbl, 0, 1, 2, 3, 5, scatter_coef)
master_tbl = ReferDictAddColumn(master_tbl, 0, node_pos)
master_tbl = ReferDictAddColumn(master_tbl, 2, node_pos)
master_tbl.insert(0, master_tbl_colname)

#以下、plotlyへのデータ受け渡しと描画処理
plt_data = []

#ノードデータ処理
node_data = GetNodeTable(master_tbl[1:], 0, 1, 2, 3)
node_data = ReferDictAddColumn(node_data, 0, node_pos)
node_pos = GetColumn(node_data, 2)
node_val = np.array(GetColumn(node_data, 1))
node_size = [math.log(elem) for elem in node_val]
node_size = np.array(node_size)*math.e
node_size_max = max(node_size)
node_size_min = min(node_size)
node_color = [ValueToRGB(data, node_size_max , node_size_min,
                         Ra = 255, Ga = 215, Ba = 215, Aa = 1,
                         Rb = 255, Gb = 0, Bb = 0, Ab = 1,) for data in node_size]
node_txt_elem = [str(data[0]) for data in node_data]
node_txt_val = ["<br><Value><br>occure = " + str(data[1]) for data in node_data]

#ノードデータ受け渡し
i = 0
for pos in node_pos:
    node = go.Scatter3d(
        x = np.array(pos[0]),
        y = np.array(pos[1]),
        z = np.array(pos[2]),
        mode = 'markers+text', #+textでマーカー上にラベル表示
        name = "<Node><br>" + node_txt_elem[i] + node_txt_val[i],
        text = RemoveBetween(node_txt_elem[i], "colmun:", "element:"),
        hovertext = "<Node><br>" + node_txt_elem[i] + node_txt_val[i],
        hoverinfo = "text",
        marker = dict(
                      size = node_size[i],
                      color = node_color[i],
                      # colorscale='peach',
                      opacity=1
        )
    )
    plt_data.append(node)
    i = i + 1

#エッジデータ処理
edge_pos_st = GetColumn(master_tbl[1:], 7)
edge_pos_fin = GetColumn(master_tbl[1:], 8)
edge_pos = GetMidPoint(edge_pos_st, edge_pos_fin)
edge_txt_elem = []
edge_txt_val = []
for data in master_tbl[1:]:
    txt_elem = str(data[4])
    txt_val = ("<br><Value><br>co-occure = " + str(data[5])
                + "<br>simpson = " + str(round(data[6], 4))
                )
    edge_txt_elem.append(txt_elem)
    edge_txt_val.append(txt_val)
edge_jec = GetColumn(master_tbl[1:], 6)
edge_jec_max = max(edge_jec)
edge_jec_min = min(edge_jec)
edge_color = [ValueToRGB(data[6], edge_jec_max , edge_jec_min,
                         Ra = 0, Ga = 215, Ba = 255, Aa = 1,
                         Rb = 0, Gb = 0, Bb = 255, Ab = 1,) for data in master_tbl[1:]]
#エッジデータ受け渡し。
i=0
for pos in edge_pos:
    edge = go.Scatter3d(
        x = [pos[0][0], pos[1][0], pos[2][0]],
        y = [pos[0][1], pos[1][1], pos[2][1]],
        z = [pos[0][2], pos[1][2], pos[2][2]],
        mode = 'lines', #lines+textでラベルを表示できる。
        name = "<Edge><br>" + edge_txt_elem[i] + edge_txt_val[i],
        text = [None, "<Edge><br>" + edge_txt_elem[i] + edge_txt_val[i], None],
        hoverinfo = 'text',
        marker = dict(
            color = edge_color[i],
            opacity = 1
        )
    )
    plt_data.append(edge)
    i = i+1

#グラフタイトルの作成。
plt_title = ""
i = 0
for num in checked_column:
    if i != 0:
        plt_title = plt_title + " & " + col_name[int(num)]
    else:
        plt_title = plt_title + col_name[int(num)]
    i = i + 1
plt_title = "Column:" + plt_title + "<br>Lowest occur:" + str(lowest_occure) + "<br>Lowest simpson:" + str(lowest_simpson)

#レイアウト設定。
axis_lo = dict(showbackground = False,
            showline = False,
            zeroline = False,
            showgrid = False,
            showticklabels = False,
            title='',
            )
#レイアウト作成
plt_layout = go.Layout(
                        title = dict(
                            text = plt_title,
                        ),
                        scene = dict(xaxis = dict(axis_lo),
                                    yaxis = dict(axis_lo),
                                    zaxis = dict(axis_lo),
                                    ),
                        showlegend = True, #ノードやエッジの表示設定
                        hovermode = "closest" ,
                        legend = dict(
                                     bordercolor="Black",
                                     borderwidth=1,
                                     orientation="h",
                                    ),
                        autosize = True,
                        height = 1200,
                        margin=dict(t=0, b=0, l=0, r=0),
                    )
fig = go.Figure(data = plt_data, layout = plt_layout)

html__out_dir = server_dir + "/cashe/" + user_ip + ".html"
fig.write_html(html__out_dir, include_plotlyjs = False, full_html = False)

print("success!")
#処理時間の表示
# py_end = time.perf_counter() - py_start
# print("Process time:" + str(py_end))