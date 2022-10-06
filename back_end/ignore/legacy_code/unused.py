plot_data_for_html = []

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
                      size = node_size_rel[i],
                      color = node_color[i],
                      # colorscale='peach',
                      opacity=1
        )
    )
    plot_data_for_html.append(node)
    i = i + 1

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
            opacity = 1,
        )
    )
    plot_data_for_html.append(edge)
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
plt_title = "Analysing column: " + plt_title + "<br>Lowest occur: " + str(lowest_occure) + "<br>Lowest simpson: " + str(lowest_simpson)

レイアウト設定。
axis_lo = dict(showbackground = True,
            showline = True,
            zeroline = True,
            showgrid = True,
            showticklabels = False,
            title='',
            backgroundcolor = "rgb(220, 220, 220)",
            )
plt_layout = go.Layout(
                        title = dict(
                            text = plt_title,
                            font = dict(
                                size = 18,
                                color = "rgb(0, 0, 0)",
                                family = "Arial",
                            ),
                            x = 0,
                            xref = "paper",
                            xanchor = "left",
                            y = 1,
                            yref = "paper",
                            yanchor = "top",
                            pad = dict(
                                b = 10,
                                l = 10,
                                r = 10,
                                t = 30,
                            ),
                        ),
                        font = dict(
                            size = 16,
                            color = "rgb(0, 0, 0)",
                            family = "Arial",
                        ),
                        margin=dict(t=0, b=0, l=0, r=0),
                        scene = dict(xaxis = dict(axis_lo),
                                    yaxis = dict(axis_lo),
                                    zaxis = dict(axis_lo),
                                    ),
                        showlegend = False,
                        hovermode = "closest" ,
                        legend = dict(
                                     bordercolor="Black",
                                     borderwidth=1,
                                     # orientation="h",
                                    ),
                        autosize = True,
                        hoverlabel = dict(
                            font = dict(
                                size = 16,
                                color = "rgb(0, 0, 0)",
                                family = "Arial",
                            ),
                            bgcolor = "rgb(255, 255, 255)",
                        ),
                    )

fig = go.Figure(plot_data_for_html)
fig_out_dir_sub = server_dir + "/cashe/" + user_ip + "_sub_res.json"
fig.write_html(fig_out_dir_sub, include_plotlyjs = True, full_html = True)
fig.write_json(fig_out_dir_sub)