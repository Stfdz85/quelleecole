import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import L from "leaflet";

const D = [{"id":"0595286A","n":"Centre scolaire Saint-Paul (Collège)","c":"Lille","a":"92 rue Solferino","la":50.63367,"lo":3.04996,"t":"c","s":"v","i":154.8,"f":["CANT"],"ie":23.1,"ev":{"fr_s":"301","fr_ef":"214","fr_w":3.7,"fr_st":71.5,"ma_s":"294","ma_ef":"214","ma_w":7,"ma_st":62.2},"ev_y":"2024","iv":{"brevet":100,"va_brevet":1,"note_ecrit":15.2,"va_note":0.7,"acces_6_3":92,"tb":119,"b":58,"ab":19,"cand":201,"men":98,"session":"2024"},"q_ips":105.5,"q_n":4,"px":2280,"ef":849},{"id":"0594865T","n":"Collège Anatole France","c":"Ronchin","a":"126 rue Anatole France","la":50.61182,"lo":3.08053,"t":"c","s":"u","i":95.3,"f":["ULIS","REP","CANT"],"ie":37.6,"ev":{"ma_s":"246","ma_ef":"96","ma_w":34.3,"ma_st":28.1,"fr_s":"254","fr_ef":"93","fr_w":28,"fr_st":33.3},"ev_y":"2024","iv":{"brevet":85,"va_brevet":3,"note_ecrit":9.8,"va_note":-0.3,"acces_6_3":91,"tb":26,"b":8,"ab":15,"cand":71,"men":69,"session":"2024"},"ef":377},{"id":"0593226L","n":"Collège Anne Frank","c":"Lambersart","a":"23 avenue du Maréchal Foch","la":50.64851,"lo":3.028,"t":"c","s":"u","i":123.2,"f":["ULIS","CANT"],"ie":44.3,"ev":{"ma_s":"275","ma_ef":"123","ma_w":17.9,"ma_st":48,"fr_s":"276","fr_ef":"122","fr_w":14.8,"fr_st":51.7},"ev_y":"2024","iv":{"brevet":88,"va_brevet":-4,"note_ecrit":12.2,"va_note":0.2,"acces_6_3":89,"tb":47,"b":27,"ab":22,"cand":128,"men":75,"session":"2024"},"q_ips":133.8,"q_n":3,"ef":482},{"id":"0593235W","n":"Collège Boris Vian","c":"Lille","a":"260 bis rue Pierre Legrand","la":50.63132,"lo":3.09463,"t":"c","s":"u","i":90.9,"f":["REP+","CANT"],"ie":39.8,"ev":{"ma_s":"243","ma_ef":"121","ma_w":47.1,"ma_st":27.3,"fr_s":"250","fr_ef":"118","fr_w":36.5,"fr_st":28.8},"ev_y":"2024","q_ips":93.1,"q_n":3,"iv":{"brevet":78,"va_brevet":0,"note_ecrit":9.9,"va_note":0.3,"acces_6_3":91,"tb":19,"b":17,"ab":22,"cand":91,"men":64,"session":"2024"},"ef":535},{"id":"0593168Y","n":"Collège Carnot","c":"Lille","a":"43 boulevard Carnot","la":50.63975,"lo":3.0667,"t":"c","s":"u","i":125.9,"f":["CANT"],"ie":44.7,"ev":{"fr_s":"279","fr_ef":"164","fr_w":13.4,"fr_st":53.1,"ma_s":"275","ma_ef":"164","ma_w":20.1,"ma_st":43.3},"ev_y":"2024","q_ips":115.2,"q_n":3,"sp":["CHAM","Intl"],"iv":{"brevet":93,"va_brevet":-1,"note_ecrit":13,"va_note":0.1,"acces_6_3":92,"tb":92,"b":29,"ab":23,"cand":176,"men":82,"session":"2024"},"ef":649},{"id":"0593179K","n":"Collège Claude Lévi-Strauss","c":"Lille","a":"1 place Leroux de Fauquemont","la":50.63147,"lo":3.03674,"t":"c","s":"u","i":86.7,"f":["ULIS","REP","CANT"],"ie":36.8,"ev":{"fr_s":"240","fr_ef":"100","fr_w":43,"fr_st":24,"ma_s":"252","ma_ef":"101","ma_w":32.6,"ma_st":30.7},"ev_y":"2024","iv":{"brevet":83,"va_brevet":7,"note_ecrit":11.1,"va_note":1.4,"acces_6_3":88,"tb":31,"b":17,"ab":17,"cand":103,"men":63,"session":"2024"},"q_ips":123.2,"q_n":3,"ef":462},{"id":"0590155Y","n":"Collège Descartes","c":"Mons-en-Baroeul","a":"2 rue Lavoisier","la":50.63567,"lo":3.10708,"t":"c","s":"u","i":101.6,"f":["ULIS","CANT"],"ev":{"fr_s":"251","fr_ef":"101","fr_w":33.6,"fr_st":31.7,"ma_s":"249","ma_ef":"103","ma_w":35.9,"ma_st":30.1},"ev_y":"2024","i_proxy":true,"i_source":"quartier (2)","iv":{"brevet":83,"va_brevet":-1,"note_ecrit":10.8,"va_note":0,"acces_6_3":94,"tb":27,"b":28,"ab":15,"cand":96,"men":73,"session":"2024"},"ef":407},{"id":"0593134L","n":"Collège Dominique Savio","c":"Lambersart","a":"47 rue du Bourg","la":50.65256,"lo":3.02309,"t":"c","s":"v","i":133.9,"f":["CANT"],"ie":27.4,"ev":{"fr_s":"287","fr_ef":"193","fr_w":8.3,"fr_st":52.9,"ma_s":"285","ma_ef":"193","ma_w":10.8,"ma_st":56.5},"ev_y":"2024","q_ips":132.6,"q_n":2,"px":2400,"iv":{"brevet":100,"va_brevet":2,"note_ecrit":14.4,"va_note":0.9,"acces_6_3":91,"tb":73,"b":60,"ab":26,"cand":166,"men":96,"session":"2024"},"ef":798},{"id":"0590115E","n":"Collège Franklin","c":"Lille","a":"5 bis boulevard Louis XIV","la":50.62911,"lo":3.07041,"t":"c","s":"u","i":104.8,"f":["ULIS","CANT"],"ie":44.5,"ev":{"fr_s":"240","fr_ef":"109","fr_w":44.1,"fr_st":22,"ma_s":"248","ma_ef":"109","ma_w":38.5,"ma_st":25.7},"ev_y":"2024","iv":{"brevet":84,"va_brevet":1,"note_ecrit":9.7,"va_note":-0.7,"acces_6_3":80,"tb":49,"b":20,"ab":22,"cand":132,"men":69,"session":"2024"},"q_ips":108.4,"q_n":3,"ef":480},{"id":"0593178J","n":"Collège François Rabelais","c":"Mons-en-Baroeul","a":"Avenue du Chancelier Adenauer","la":50.64173,"lo":3.11752,"t":"c","s":"u","f":["REP+","CANT"],"ev":{"fr_s":"240","fr_ef":"102","fr_w":35.3,"fr_st":16.6,"ma_s":"236","ma_ef":"101","ma_w":40.6,"ma_st":18.8},"ev_y":"2024","i":72.9,"i_proxy":true,"i_source":"ville-data.com / DEPP","iv":{"brevet":84,"va_brevet":8,"note_ecrit":8.9,"va_note":0,"acces_6_3":90,"tb":16,"b":26,"ab":21,"cand":95,"men":66,"session":"2024"},"ef":465},{"id":"0593237Y","n":"Collège Gernez Rieux","c":"Ronchin","a":"Rue Charles Saint-Venant","la":50.59901,"lo":3.09146,"t":"c","s":"u","i":95.6,"f":["ULIS","CANT"],"ie":34.5,"ev":{"fr_s":"250","fr_ef":"116","fr_w":31.1,"fr_st":25.8,"ma_s":"248","ma_ef":"117","ma_w":34.2,"ma_st":24.7},"ev_y":"2024","iv":{"brevet":76,"va_brevet":-5,"note_ecrit":9.8,"va_note":0,"acces_6_3":82,"tb":26,"b":15,"ab":13,"cand":84,"men":64,"session":"2024"},"q_ips":97.5,"q_n":1,"ef":511},{"id":"0594523W","n":"Collège Guy Mollet","c":"Lille","a":"58 avenue Roger Salengro","la":50.64141,"lo":2.99032,"t":"c","s":"u","i":102.7,"f":["ULIS","CANT"],"ie":32,"ev":{"ma_s":"250","ma_ef":"75","ma_w":33.4,"ma_st":26.7,"fr_s":"256","fr_ef":"77","fr_w":26,"fr_st":29.9},"ev_y":"2024","iv":{"brevet":93,"va_brevet":2,"note_ecrit":11.9,"va_note":0.5,"acces_6_3":91,"tb":39,"b":28,"ab":15,"cand":96,"men":85,"session":"2024"},"q_ips":100,"q_n":2,"ef":340},{"id":"0590131X","n":"Collège Jean Jaurès","c":"Lille","a":"1 rue de la Paix du 8 Mai 1945","la":50.64124,"lo":3.0115,"t":"c","s":"u","i":82.6,"f":["ULIS","REP","CANT"],"ie":30.5,"ev":{"fr_s":"236","fr_ef":"119","fr_w":42,"fr_st":16.8,"ma_s":"231","ma_ef":"121","ma_w":52,"ma_st":20.6},"ev_y":"2024","iv":{"brevet":85,"va_brevet":5,"note_ecrit":9.6,"va_note":0.3,"acces_6_3":92,"tb":27,"b":26,"ab":28,"cand":110,"men":74,"session":"2024"},"ef":483},{"id":"0593476H","n":"Collège Jean Mermoz","c":"Faches-Thumesnil","a":"125 avenue de Paris","la":50.59611,"lo":3.07204,"t":"c","s":"u","i":112.8,"f":["CANT"],"ev":{"fr_s":"262","fr_ef":"110","fr_w":22.8,"fr_st":32.7,"ma_s":"262","ma_ef":"110","ma_w":28.2,"ma_st":35.4},"ev_y":"2024","iv":{"brevet":86,"va_brevet":-6,"note_ecrit":11.7,"va_note":0,"acces_6_3":91,"tb":36,"b":23,"ab":13,"cand":103,"men":70,"session":"2024"},"ef":459},{"id":"0592830F","n":"Collège Jean Zay","c":"Faches-Thumesnil","a":"22 rue Jean-Baptiste Clément","la":50.60722,"lo":3.0636,"t":"c","s":"u","i":86.9,"f":["CANT"],"ev":{"fr_s":"249","fr_ef":"104","fr_w":35.5,"fr_st":23.1,"ma_s":"238","ma_ef":"98","ma_w":47.9,"ma_st":18.4},"ev_y":"2024","q_ips":77,"q_n":1,"iv":{"brevet":77,"va_brevet":-4,"note_ecrit":9.4,"va_note":0,"acces_6_3":88,"tb":9,"b":10,"ab":21,"cand":78,"men":51,"session":"2024"},"ef":378},{"id":"0593177H","n":"Collège Jean Zay","c":"Lille","a":"31 rue Adolphe Defrenne","la":50.64775,"lo":2.9855,"t":"c","s":"u","i":89.9,"f":["REP","CANT"],"ie":32.2,"ev":{"fr_s":"234","fr_ef":"57","fr_w":50.9,"fr_st":14.1,"ma_s":"236","ma_ef":"57","ma_w":42.1,"ma_st":14},"ev_y":"2024","iv":{"brevet":88,"va_brevet":4,"note_ecrit":10.1,"va_note":-0.1,"acces_6_3":82,"tb":11,"b":8,"ab":8,"cand":41,"men":66,"session":"2024"},"q_ips":105.1,"q_n":3,"ef":213},{"id":"0595396V","n":"Collège La Salle","c":"Lille","a":"18 rue Saint-Jean-Baptiste de la Salle","la":50.62863,"lo":3.04081,"t":"c","s":"v","i":124.1,"f":["ULIS","CANT"],"ie":37.5,"ev":{"ma_s":"267","ma_ef":"132","ma_w":25,"ma_st":45.4,"fr_s":"286","fr_ef":"132","fr_w":12.9,"fr_st":63.7},"ev_y":"2024","iv":{"brevet":93,"va_brevet":0,"note_ecrit":11.6,"va_note":0.1,"acces_6_3":90,"tb":19,"b":35,"ab":22,"cand":95,"men":80,"session":"2024"},"q_ips":127.9,"q_n":8,"px":1980,"ef":460},{"id":"0593218C","n":"Collège Lacordaire","c":"Mons-en-Baroeul","a":"28 rue Émile Zola","la":50.64161,"lo":3.09587,"t":"c","s":"v","i":110.2,"f":["CANT"],"ev":{"ma_s":"264","ma_ef":"77","ma_w":24.7,"ma_st":44.2,"fr_s":"262","fr_ef":"65","fr_w":12.3,"fr_st":33.9},"ev_y":"2024","i_proxy":true,"i_source":"quartier (4)","px":1800,"iv":{"brevet":91,"va_brevet":2,"note_ecrit":12.6,"va_note":0,"acces_6_3":90,"tb":36,"b":39,"ab":13,"cand":111,"men":79,"session":"2024"},"ef":462},{"id":"0595163S","n":"Collège Lavoisier","c":"Lambersart","a":"Rue Édouard Vaillant","la":50.64257,"lo":3.02323,"t":"c","s":"u","i":101.3,"f":["CANT"],"ie":38.2,"ev":{"fr_s":"252","fr_ef":"64","fr_w":36,"fr_st":31.2,"ma_s":"245","ma_ef":"66","ma_w":37.9,"ma_st":30.3},"ev_y":"2024","iv":{"brevet":81,"va_brevet":-8,"note_ecrit":11.4,"va_note":0.6,"acces_6_3":78,"tb":16,"b":17,"ab":19,"cand":75,"men":69,"session":"2024"},"q_ips":128.1,"q_n":2,"ef":320},{"id":"0594288R","n":"Collège Louise Michel","c":"Lille","a":"14 rue de Cannes","la":50.60615,"lo":3.04626,"t":"c","s":"u","i":69.1,"f":["REP+","CANT"],"ie":20.7,"ev":{"fr_s":"219","fr_ef":"106","fr_w":57.6,"fr_st":9.4,"ma_s":"221","ma_ef":"106","ma_w":56.6,"ma_st":8.5},"ev_y":"2024","iv":{"brevet":70,"va_brevet":11,"note_ecrit":7.7,"va_note":0.4,"acces_6_3":80,"tb":9,"b":12,"ab":15,"cand":92,"men":39,"session":"2024"},"q_ips":74.4,"q_n":1,"ef":416},{"id":"0595398X","n":"Collège Marcq Institution","c":"Marcq-en-Baroeul","a":"170 rue du Collège","la":50.68036,"lo":3.10681,"t":"c","s":"v","f":["CANT"],"ev":{"fr_s":"299","fr_ef":"426","fr_w":2.8,"fr_st":69.7,"ma_s":"302","ma_ef":"425","ma_w":4.9,"ma_st":68.4},"ev_y":"2024","sp":["Intl"],"px":3200,"i":151.5,"i_proxy":true,"i_source":"ville-data.com / DEPP 2024","iv":{"brevet":100,"va_brevet":1,"note_ecrit":16.3,"va_note":0,"acces_6_3":88,"tb":307,"b":28,"ab":1,"cand":337,"men":100,"session":"2024"},"ef":1626},{"id":"0594881K","n":"Collège Martha Desrumaux","c":"Lille","a":"16 rue Vantroyen","la":50.63901,"lo":3.08484,"t":"c","s":"u","i":85,"f":["ULIS","CANT"],"ie":35.6,"ev":{"fr_s":"234","fr_ef":"78","fr_w":43.6,"fr_st":14.1,"ma_s":"238","ma_ef":"78","ma_w":35.9,"ma_st":20.5},"ev_y":"2024","iv":{"brevet":76,"va_brevet":-3,"note_ecrit":9.9,"va_note":-0.2,"acces_6_3":81,"tb":18,"b":7,"ab":10,"cand":72,"men":49,"session":"2024"},"q_ips":90.7,"q_n":4,"ef":377},{"id":"0597004T","n":"Collège Miriam Makeba","c":"Lille","a":"239 rue d'Arras","la":50.61836,"lo":3.06416,"t":"c","s":"u","i":77.5,"f":["REP+","CANT"],"ie":26.9,"ev":{"ma_s":"240","ma_ef":"122","ma_w":42.6,"ma_st":19.7,"fr_s":"233","fr_ef":"119","fr_w":47,"fr_st":19.4},"ev_y":"2024","q_ips":85.3,"q_n":3,"iv":{"brevet":94,"va_brevet":14,"note_ecrit":9.7,"va_note":0.3,"acces_6_3":76,"tb":40,"b":23,"ab":18,"cand":95,"men":85,"session":"2024"},"ef":454},{"id":"0596833G","n":"Collège Nina Simone","c":"Lille","a":"53 boulevard Montebello","la":50.62422,"lo":3.04439,"t":"c","s":"u","i":79.2,"f":["REP+","ULIS","CANT"],"ie":35.3,"ev":{"ma_s":"234","ma_ef":"115","ma_w":49.6,"ma_st":13.9,"fr_s":"227","fr_ef":"114","fr_w":51.8,"fr_st":12.3},"ev_y":"2024","q_ips":106,"q_n":7,"iv":{"brevet":82,"va_brevet":6,"note_ecrit":9,"va_note":-0.1,"acces_6_3":83,"tb":18,"b":22,"ab":28,"cand":110,"men":62,"session":"2024"},"ef":465},{"id":"0593660H","n":"Collège René Descartes","c":"Loos","a":"Rue Édouard Herriot","la":50.60889,"lo":3.00671,"t":"c","s":"u","i":77.6,"f":["REP+","ULIS","CANT"],"ie":23.1,"ev":{"ma_s":"243","ma_ef":"96","ma_w":38.5,"ma_st":25,"fr_s":"247","fr_ef":"96","fr_w":31.3,"fr_st":21.8},"ev_y":"2024","iv":{"brevet":73,"va_brevet":-3,"note_ecrit":8.7,"va_note":0,"acces_6_3":89,"tb":11,"b":7,"ab":18,"cand":67,"men":54,"session":"2024"},"q_ips":77.4,"q_n":2,"ef":324},{"id":"0594287P","n":"Collège Rouges Barres","c":"Marcq-en-Baroeul","a":"95 allée Gabriel","la":50.65707,"lo":3.09488,"t":"c","s":"u","i":85.5,"f":["ULIS","CANT"],"ev":{"fr_s":"263","fr_ef":"88","fr_w":19.3,"fr_st":31.8,"ma_s":"265","ma_ef":"89","ma_w":25.9,"ma_st":39.3},"ev_y":"2024","i_proxy":true,"i_source":"quartier (2)","iv":{"brevet":86,"va_brevet":-6,"note_ecrit":10.7,"va_note":0,"acces_6_3":88,"tb":21,"b":16,"ab":19,"cand":83,"men":67,"session":"2024"},"ef":419},{"id":"0593180L","n":"Collège Saint-Exupéry","c":"Lille","a":"23 rue du progrès","la":50.62873,"lo":3.11859,"t":"c","s":"u","i":101.5,"f":["ULIS","CANT"],"ie":40.7,"ev":{"fr_s":"253","fr_ef":"197","fr_w":34,"fr_st":32.5,"ma_s":"255","ma_ef":"197","ma_w":35.5,"ma_st":36},"ev_y":"2024","iv":{"brevet":92,"va_brevet":7,"note_ecrit":10.7,"va_note":0.4,"acces_6_3":86,"tb":63,"b":37,"ab":35,"cand":180,"men":75,"session":"2024"},"sp":["Sport"],"ef":872},{"id":"0592896C","n":"Collège Saint-Jean","c":"La Madeleine","a":"82 rue Pasteur","la":50.65515,"lo":3.07859,"t":"c","s":"v","i":138.3,"f":["CANT"],"ie":27.9,"ev":{"ma_s":"282","ma_ef":"149","ma_w":12.1,"ma_st":50.3,"fr_s":"283","fr_ef":"149","fr_w":9.4,"fr_st":48.3},"ev_y":"2024","q_ips":121.4,"q_n":2,"px":2100,"iv":{"brevet":100,"va_brevet":3,"note_ecrit":14.3,"va_note":1.1,"acces_6_3":92,"tb":54,"b":52,"ab":26,"cand":138,"men":96,"session":"2024"},"ef":587},{"id":"0593131H","n":"Collège Saint-Joseph","c":"Lille","a":"8 sentier du Curé","la":50.62929,"lo":3.10734,"t":"c","s":"v","i":104.3,"f":["CANT"],"ie":33.3,"ev":{"fr_s":"258","fr_ef":"99","fr_w":17.2,"fr_st":32.3,"ma_s":"245","ma_ef":"100","ma_w":38,"ma_st":28},"ev_y":"2024","iv":{"brevet":97,"va_brevet":8,"note_ecrit":11.6,"va_note":1.2,"acces_6_3":71,"tb":19,"b":31,"ab":33,"cand":94,"men":88,"session":"2024"},"px":1680,"ef":379},{"id":"0592890W","n":"Collège Saint-Joseph","c":"Lille","a":"6-8 rue Joris Karl Huysmans","la":50.61639,"lo":3.02568,"t":"c","s":"v","i":90.1,"f":["CANT"],"ie":33.7,"ev":{"fr_s":"255","fr_ef":"83","fr_w":22.9,"fr_st":29,"ma_s":"247","ma_ef":"83","ma_w":38.6,"ma_st":22.9},"ev_y":"2024","iv":{"brevet":93,"va_brevet":5,"note_ecrit":10.4,"va_note":0,"acces_6_3":85,"tb":16,"b":30,"ab":27,"cand":96,"men":76,"session":"2024"},"q_ips":98.6,"q_n":3,"px":1440,"ef":387},{"id":"0596177U","n":"Collège Sainte-Claire","c":"Lille","a":"8 rue des augustins","la":50.63446,"lo":3.06902,"t":"c","s":"v","i":109.5,"f":["CANT"],"ie":35.1,"ev":{"ma_s":"237","ma_ef":"73","ma_w":39.7,"ma_st":20.6,"fr_s":"246","fr_ef":"72","fr_w":33.3,"fr_st":25},"ev_y":"2024","iv":{"brevet":95,"va_brevet":5,"note_ecrit":12.3,"va_note":0.9,"acces_6_3":72,"tb":18,"b":30,"ab":21,"cand":82,"men":84,"session":"2024"},"q_ips":106.6,"q_n":4,"px":1800,"ef":325},{"id":"0595393S","n":"Collège Sainte-Odile","c":"Lambersart","a":"244 avenue de Dunkerque","la":50.63828,"lo":3.02752,"t":"c","s":"v","i":131.2,"f":["ULIS","CANT"],"ie":34.2,"ev":{"fr_s":"277","fr_ef":"162","fr_w":14.8,"fr_st":51.2,"ma_s":"271","ma_ef":"139","ma_w":16.6,"ma_st":41},"ev_y":"2024","iv":{"brevet":97,"va_brevet":2,"note_ecrit":12.7,"va_note":0.4,"acces_6_3":85,"tb":42,"b":55,"ab":32,"cand":143,"men":90,"session":"2024"},"q_ips":129.4,"q_n":3,"px":2620,"ef":682},{"id":"0595397W","n":"Collège Thérèse d'Avila","c":"Lille","a":"13 rue des Frères Vaillant","la":50.62854,"lo":3.04434,"t":"c","s":"v","i":140.8,"f":["CANT"],"ie":33,"ev":{"fr_s":"287","fr_ef":"145","fr_w":6.2,"fr_st":61.4,"ma_s":"282","ma_ef":"146","ma_w":17.8,"ma_st":51.3},"ev_y":"2024","iv":{"brevet":100,"va_brevet":1,"note_ecrit":15.3,"va_note":1.2,"acces_6_3":82,"tb":98,"b":46,"ab":11,"cand":157,"men":99,"session":"2024"},"q_ips":128,"q_n":8,"sp":["Intl","Cambridge"],"px":2400,"ef":677},{"id":"0590271Z","n":"Collège Verlaine","c":"Lille","a":"1 rue Berthelot","la":50.61076,"lo":3.07013,"t":"c","s":"u","i":83.2,"f":["REP+","ULIS","CANT"],"ie":30.7,"ev":{"ma_s":"229","ma_ef":"80","ma_w":53.7,"ma_st":20,"fr_s":"233","fr_ef":"81","fr_w":46.9,"fr_st":16},"ev_y":"2024","iv":{"brevet":69,"va_brevet":-10,"note_ecrit":11,"va_note":1.4,"acces_6_3":74,"tb":15,"b":12,"ab":12,"cand":65,"men":60,"session":"2024"},"q_ips":100.8,"q_n":1,"ef":352},{"id":"0593658F","n":"Collège Yvonne Abbas","c":"La Madeleine","a":"64 bis rue des Gantois","la":50.65266,"lo":3.06512,"t":"c","s":"u","i":95.6,"f":["ULIS","CANT"],"ie":37.9,"ev":{"ma_s":"249","ma_ef":"123","ma_w":36.6,"ma_st":30.1,"fr_s":"251","fr_ef":"123","fr_w":35,"fr_st":30.1},"ev_y":"2024","iv":{"brevet":68,"va_brevet":-16,"note_ecrit":9.5,"va_note":-0.6,"acces_6_3":86,"tb":22,"b":16,"ab":20,"cand":101,"men":57,"session":"2024"},"q_ips":109.6,"q_n":2,"ef":472},{"id":"0593227M","n":"Collège du Lazaro","c":"Marcq-en-Baroeul","a":"56 rue du Lazaro","la":50.67807,"lo":3.08594,"t":"c","s":"u","f":["ULIS","CANT"],"ev":{"fr_s":"255","fr_ef":"133","fr_w":28.5,"fr_st":31.5,"ma_s":"259","ma_ef":"138","ma_w":29.7,"ma_st":33.3},"ev_y":"2024","i":117.3,"i_proxy":true,"i_source":"ville-data.com / DEPP","iv":{"brevet":79,"va_brevet":-9,"note_ecrit":10.9,"va_note":0,"acces_6_3":93,"tb":37,"b":21,"ab":24,"cand":132,"men":62,"session":"2024"},"ef":631},{"id":"0593233U","n":"Collège professeur Albert Debeyre","c":"Loos","a":"1 rue Robert Schuman","la":50.61198,"lo":3.02123,"t":"c","s":"u","i":93.3,"f":["CANT"],"ie":33.5,"ev":{"fr_s":"252","fr_ef":"93","fr_w":33.4,"fr_st":33.4,"ma_s":"240","ma_ef":"94","ma_w":40.4,"ma_st":19.1},"ev_y":"2024","q_ips":101.1,"q_n":2,"iv":{"brevet":71,"va_brevet":-10,"note_ecrit":8.9,"va_note":-0.5,"acces_6_3":88,"tb":18,"b":12,"ab":25,"cand":100,"men":55,"session":"2024"},"ef":386},{"id":"0597233S","n":"Ecole secondaire privée hors contrat Arborescences de LILLE - niveau collège","c":"Lille","a":"6 rue Lamartine","la":50.62208,"lo":3.06401,"t":"c","s":"v","i":83.7,"q_ips":83.7,"q_n":5,"i_proxy":true,"i_source":"quartier (5 écoles)","sp":["HC"]},{"id":"0596939X","n":"Ecole secondaire privée hors contrat Averroès","c":"Lille","a":"65 rue de la Prévoyance","la":50.61363,"lo":3.05463,"t":"c","s":"v","i":82,"q_ips":82,"q_n":1,"i_proxy":true,"i_source":"quartier (1 écoles)","sp":["HC"]},{"id":"0597371S","n":"Ecole secondaire privée hors contrat CERENE - niveau Collège","c":"Lille","a":"52 rue de l'Alma","la":50.63665,"lo":3.08226,"t":"c","s":"v","i":88.5,"q_ips":88.5,"q_n":5,"i_proxy":true,"i_source":"quartier (5 écoles)"},{"id":"0593236X","n":"Section d'enseignement général et professionnel adapté du Collège Boris Vian","c":"Lille","a":"260 bis rue Pierre Legrand","la":50.63086,"lo":3.09423,"t":"c","s":"u","i":91.1,"f":["CANT"],"q_ips":91.1,"q_n":4,"i_proxy":true,"i_source":"quartier (4 écoles)"},{"id":"0594627J","n":"Section d'enseignement général et professionnel adapté du Collège François Rabelais","c":"Mons-en-Baroeul","a":"Avenue du Chancelier Adenauer","la":50.64125,"lo":3.11767,"t":"c","s":"u","f":["CANT"],"i":72.9,"i_proxy":true,"i_source":"Collège François Rabelais (parent)"},{"id":"0593238Z","n":"Section d'enseignement général et professionnel adapté du Collège Gernez Rieux","c":"Ronchin","a":"55 rue Charles Saint-Venant","la":50.59901,"lo":3.09146,"t":"c","s":"u","i":96.2,"f":["CANT"],"q_ips":96.2,"q_n":2,"i_proxy":true,"i_source":"quartier (2 écoles)"},{"id":"0592749T","n":"Section d'enseignement général et professionnel adapté du Collège Jean Zay","c":"Lille","a":"31 rue Adolphe Defrenne","la":50.64769,"lo":2.98629,"t":"c","s":"u","i":100.3,"f":["CANT"],"q_ips":100.3,"q_n":4,"i_proxy":true,"i_source":"quartier (4 écoles)"},{"id":"0595536X","n":"Section d'enseignement général et professionnel adapté du Collège Lavoisier","c":"Lambersart","a":"Rue Edouard Vaillant","la":50.64242,"lo":3.02284,"t":"c","s":"u","i":113.2,"f":["CANT"],"q_ips":113.2,"q_n":3,"i_proxy":true,"i_source":"quartier (3 écoles)"},{"id":"0594385W","n":"Section d'enseignement général et professionnel adapté du Collège Rouges Barres","c":"Marcq-en-Baroeul","a":"95 allée Gabriel","la":50.65732,"lo":3.09501,"t":"c","s":"u","i":84.5,"f":["CANT"],"i_proxy":true,"i_source":"quartier (1)"},{"id":"0595179J","n":"Section d'enseignement général et professionnel adapté du Collège Saint-Exupéry","c":"Lille","a":"23 rue du Progrès","la":50.62856,"lo":3.11821,"t":"c","s":"u","i":101.5,"f":["CANT"],"q_ips":101.5,"q_n":1,"i_proxy":true,"i_source":"quartier (1 écoles)"},{"id":"0594629L","n":"Section d'enseignement général et professionnel adapté du Collège Verlaine","c":"Lille","a":"1 rue Berthelot","la":50.61038,"lo":3.07015,"t":"c","s":"u","i":91.2,"f":["CANT"],"q_ips":91.2,"q_n":2,"i_proxy":true,"i_source":"quartier (2 écoles)"},{"id":"0593659G","n":"Section d'enseignement général et professionnel adapté du Collège Yvonne Abbas","c":"La Madeleine","a":"64 bis rue des Gantois","la":50.65266,"lo":3.06512,"t":"c","s":"u","i":99.9,"f":["CANT"],"q_ips":99.9,"q_n":3,"i_proxy":true,"i_source":"quartier (3 écoles)"},{"id":"0595993U","n":"École Jeannine Manuel - collège","c":"Marcq-en-Baroeul","a":"418 bis rue Albert Bailly","la":50.69055,"lo":3.12112,"t":"c","s":"v","f":["CANT"],"ev":{"fr_s":"290","fr_ef":"62","fr_w":11.3,"fr_st":62.9,"ma_s":"298","ma_ef":"62","ma_w":9.7,"ma_st":69.3},"ev_y":"2024","sp":["Intl"],"iv":{"brevet":100,"note_ecrit":14.5,"acces_6_3":75,"tb":47,"b":17,"ab":3,"cand":67,"men":100,"session":"2024"},"ef":295,"px":6632},{"id":"0591480N","n":"Ecole élémentaire Albert Samain niveau 2","c":"Lambersart","a":"28 place de la République","la":50.64848,"lo":3.03647,"t":"e","s":"u","i":143.6,"ef":206,"cl":8,"f":["CANT"],"q_ips":134.2,"q_n":2,"cs":{"n":"Collège Anne Frank","i":123.2,"va":-4,"br":88}},{"id":"0591382G","n":"Ecole élémentaire Berthelot - Sévigné","c":"Lille","a":"52 rue des Ecoles","la":50.62335,"lo":3.10065,"t":"e","s":"u","i":107.2,"ef":322,"cl":14,"f":["ULIS","CANT"],"q_ips":75.7,"q_n":1,"cs":{"n":"Collège Anne Frank (0594389A)","ext":true}},{"id":"0594697K","n":"Ecole élémentaire Bracke-Desrousseaux","c":"Lille","a":"11 rue Paul Bardou","la":50.60782,"lo":3.05632,"t":"e","s":"u","i":77,"ef":190,"cl":11,"f":["REP+","CANT"],"q_ips":71.4,"q_n":2,"cs":{"n":"Collège Louise Michel","i":69.1,"va":11,"br":70}},{"id":"0596505A","n":"Ecole élémentaire Chenier Severine","c":"Lille","a":"6 rue Léon Blum","la":50.6184,"lo":3.03615,"t":"e","s":"u","i":66.4,"ef":118,"cl":8,"f":["REP+","CANT"],"q_ips":80.9,"q_n":3,"cs":{"n":"Collège Nina Simone","i":79.2,"va":6,"br":82}},{"id":"0594939Y","n":"Ecole élémentaire Curie - Michelet","c":"Loos","a":"Place Jean Jaurès","la":50.60888,"lo":3.01637,"t":"e","s":"u","i":102.8,"ef":254,"cl":12,"f":["ULIS","CANT"],"q_ips":83.6,"q_n":2,"cs":{"n":"Collège Professeur Albert Debeyre","i":93.3,"va":-10,"br":71}},{"id":"0591599T","n":"Ecole élémentaire Desbordes Valmore","c":"Lille","a":"4 rue Guillaume Tell","la":50.63239,"lo":3.02818,"t":"e","s":"u","i":98.8,"ef":247,"cl":16,"f":["REP","CANT"],"q_ips":132,"q_n":1,"cs":{"n":"Collège Jean Zay","i":89.9,"va":3,"br":93}},{"id":"0591620R","n":"Ecole élémentaire Diderot","c":"Lille","a":"4 rue du Béguinage","la":50.64636,"lo":3.05807,"t":"e","s":"u","i":126.3,"ef":166,"cl":7,"f":["CANT"],"q_ips":101.4,"q_n":1,"cs":{"n":"Collège Carnot","i":125.9,"va":-1,"br":93}},{"id":"0591717W","n":"Ecole élémentaire Edmond Rostand","c":"La Madeleine","a":"Rue Victor Hugo","la":50.65481,"lo":3.06924,"t":"e","s":"u","i":104.5,"ef":233,"cl":10,"f":["CANT"],"q_ips":103.8,"q_n":3,"cs":{"n":"Collège Jean-Baptiste Lebas (0590190L)","ext":true}},{"id":"0596208C","n":"Ecole élémentaire François Launay","c":"Lille","a":"37 boulevard de Belfort","la":50.61817,"lo":3.075,"t":"e","s":"u","i":71.3,"ef":169,"cl":11,"f":["REP","CANT"],"cs":{"n":"Collège Rosa Parks (0593667R)","ext":true}},{"id":"0597392P","n":"Ecole élémentaire George Sand","c":"Lille","a":"Rue Porret","la":50.63088,"lo":3.09039,"t":"e","s":"u","i":95.4,"f":["REP+","CANT"],"q_ips":95.4,"q_n":6,"i_proxy":true,"i_source":"quartier (6 écoles)","cs":{"n":"Collège Boris Vian","i":90.9}},{"id":"0594605K","n":"Ecole élémentaire Guy Mollet","c":"Ronchin","a":"Rue Jules Ferry","la":50.60028,"lo":3.0874,"t":"e","s":"u","i":97.5,"ef":346,"cl":15,"f":["CANT"],"q_ips":95.6,"q_n":1,"cs":{"n":"Collège Gernez Rieux","i":95.6,"va":0,"br":87}},{"id":"0592682V","n":"Ecole élémentaire Hélène Boucher","c":"Mons-en-Baroeul","a":"41 rue Vincent de Paul","la":50.63828,"lo":3.11345,"t":"e","s":"u","ef":150,"cl":9,"f":["REP+","CANT"],"i":103.5,"i_source_2020":true,"i_proxy":true,"i_source":"IPS 2020","cs":{"n":"Collège François Rabelais","i":72.9,"va":8,"br":84}},{"id":"0594931P","n":"Ecole élémentaire Jean Jaurès","c":"Lille","a":"Rue Anatole France","la":50.6375,"lo":3.0664,"t":"e","s":"u","i":101,"ef":372,"cl":15,"f":["CANT"],"q_ips":123.1,"q_n":3,"cs":{"n":"Collège Jean Zay","i":86.9}},{"id":"0594937W","n":"Ecole élémentaire Jean Minet","c":"Lille","a":"57 rue Adolphe Defrenne","la":50.6499,"lo":2.98612,"t":"e","s":"u","i":84.4,"ef":103,"cl":6,"f":["REP","CANT"],"q_ips":106.9,"q_n":2,"cs":{"n":"Collège Jean Zay","i":89.9,"va":3,"br":93}},{"id":"0594202X","n":"Ecole élémentaire Jules Ferry","c":"Marcq-en-Baroeul","a":"19 rue Gabriel Péri","la":50.67561,"lo":3.08915,"t":"e","s":"u","ef":138,"cl":7,"f":["CANT"],"i":105.3,"i_source_2020":true,"i_proxy":true,"i_source":"IPS 2020","cs":{"n":"Collège Du Lazaro","i":117.3,"va":-9,"br":79}},{"id":"0594512J","n":"Ecole élémentaire Kleber","c":"Faches-Thumesnil","a":"Avenue de Roubaix","la":50.59682,"lo":3.06975,"t":"e","s":"u","i":114.8,"ef":172,"cl":7,"f":["CANT"],"cs":{"n":"Collège Jean Mermoz","i":112.8}},{"id":"0591716V","n":"Ecole élémentaire Kleber","c":"La Madeleine","a":"54 rue Kléber","la":50.65748,"lo":3.06959,"t":"e","s":"u","i":89.2,"ef":162,"cl":8,"f":["ULIS","CANT"],"q_ips":104.5,"q_n":1,"cs":{"n":"Collège Yvonne Abbas","i":95.6,"va":-16,"br":68}},{"id":"0594206B","n":"Ecole élémentaire La Paix","c":"Mons-en-Baroeul","a":"18 rue du Becquerel","la":50.63698,"lo":3.1057,"t":"e","s":"u","i":98.5,"ef":180,"cl":9,"f":["ULIS","CANT"],"i_proxy":true,"i_source":"quartier (1)","cs":{"n":"Collège Martha Desrumaux","i":85,"va":0,"br":78}},{"id":"0593541D","n":"Ecole élémentaire Lalo - Clement","c":"Lille","a":"3 rue des Déportés","la":50.63063,"lo":3.07295,"t":"e","s":"u","i":104.3,"ef":237,"cl":12,"f":["ULIS","CANT"],"q_ips":110.4,"q_n":4,"cs":{"n":"Collège Franklin","i":104.8,"va":1,"br":84}},{"id":"0594595Z","n":"Ecole élémentaire Lamartine","c":"Faches-Thumesnil","a":"5 rue de la Résistance","la":50.60681,"lo":3.06451,"t":"e","s":"u","i":87.2,"ef":207,"cl":9,"f":["CANT"],"q_ips":89.6,"q_n":3,"cs":{"n":"Collège Jean Zay","i":86.9,"va":-4,"br":77}},{"id":"0591614J","n":"Ecole élémentaire Littré","c":"Lille","a":"5 rue Fulton","la":50.62269,"lo":3.03756,"t":"e","s":"u","i":99,"ef":152,"cl":9,"f":["REP+","CANT"],"q_ips":93.6,"q_n":5,"cs":{"n":"Collège Nina Simone","i":79.2}},{"id":"0591128F","n":"Ecole élémentaire Louise de Bettignies","c":"Faches-Thumesnil","a":"176 rue Henri Dillies","la":50.59127,"lo":3.07552,"t":"e","s":"u","i":112.6,"ef":227,"cl":9,"f":["CANT"],"cs":{"n":"Collège Jean Mermoz","i":112.8}},{"id":"0591718X","n":"Ecole élémentaire Louise de Bettignies","c":"La Madeleine","a":"Rue de l'Abbé Lemire","la":50.65208,"lo":3.07294,"t":"e","s":"u","i":135.2,"ef":182,"cl":7,"f":["CANT"],"q_ips":118.9,"q_n":4,"cs":{"n":"Collège Yvonne Abbas","i":95.6,"va":-16,"br":68}},{"id":"0593614H","n":"Ecole élémentaire Léon Blum","c":"Lille","a":"Rue Marx Dormoy","la":50.64956,"lo":3.00429,"t":"e","s":"u","i":95.4,"ef":145,"cl":9,"f":["REP","CANT"],"cs":{"n":"Collège Gernez Rieux","i":95.6,"va":0,"br":87}},{"id":"0594575C","n":"Ecole élémentaire Léon Jouhaux","c":"Lille","a":"15 avenue Léon Jouhaux","la":50.63594,"lo":3.04245,"t":"e","s":"u","i":81.7,"ef":72,"cl":4,"f":["CANT"],"q_ips":93.5,"q_n":2,"cs":{"n":"Collège Claude Lévi-Strauss","i":86.7,"va":7,"br":83}},{"id":"0591581Y","n":"Ecole élémentaire Madame Roland","c":"Lille","a":"95 rue Saint Gabriel","la":50.64056,"lo":3.08643,"t":"e","s":"u","i":99.9,"ef":101,"cl":5,"f":["CANT"],"q_ips":87.6,"q_n":4,"cs":{"n":"Collège Martha Desrumaux","i":85,"va":0,"br":78}},{"id":"0591662L","n":"Ecole élémentaire Madame Roland-Lamartine","c":"Lille","a":"1 rue ELIE PETITPREZ","la":50.64503,"lo":2.99078,"t":"e","s":"u","i":98.3,"ef":129,"cl":6,"f":["CANT"],"q_ips":109,"q_n":4,"cs":{"n":"Collège Guy Mollet","i":102.7,"va":5,"br":98}},{"id":"0594705U","n":"Ecole élémentaire Marcel Pagnol","c":"Marcq-en-Baroeul","a":"Allée des Chênes","la":50.68153,"lo":3.09641,"t":"e","s":"u","ef":188,"cl":8,"f":["CANT"],"i":130.2,"i_source_2020":true,"i_proxy":true,"i_source":"IPS 2020","cs":{"n":"Collège Du Lazaro","i":117.3,"va":-9,"br":79}},{"id":"0595934E","n":"Ecole élémentaire Marie Curie-Louis Pasteur","c":"Lille","a":"34 avenue de la Délivrance","la":50.64059,"lo":2.99284,"t":"e","s":"u","i":100.9,"ef":169,"cl":7,"f":["CANT"],"q_ips":101.9,"q_n":2,"cs":{"n":"Collège Guy Mollet","i":102.7,"va":2,"br":93}},{"id":"0595094S","n":"Ecole élémentaire Montaigne","c":"Mons-en-Baroeul","a":"Rue du Général de Gaulle","la":50.64762,"lo":3.11377,"t":"e","s":"u","ef":165,"cl":11,"f":["REP+","ULIS","CANT"],"i":75.3,"i_source_2020":true,"i_proxy":true,"i_source":"IPS 2020","cs":{"n":"Collège Descartes","i":101.6,"va":-1,"br":83}},{"id":"0596376K","n":"Ecole élémentaire Painlevé","c":"Lille","a":"361 rue de la Prévoyance","la":50.61285,"lo":3.05691,"t":"e","s":"u","i":82,"ef":230,"cl":15,"f":["REP+","ULIS","CANT"],"q_ips":77,"q_n":1,"cs":{"n":"Collège Verlaine","i":83.2,"va":-10,"br":69}},{"id":"0591486V","n":"Ecole élémentaire Pasteur","c":"Lambersart","a":"7 rue Gustave Nadaud","la":50.65288,"lo":3.01278,"t":"e","s":"u","i":120.8,"ef":212,"cl":10,"f":["ULIS","CANT"],"cs":{"n":"Collège Lavoisier","i":101.3,"va":-8,"br":81}},{"id":"0591550P","n":"Ecole élémentaire Pasteur","c":"Lille","a":"246 rue Solférino","la":50.62722,"lo":3.0621,"t":"e","s":"u","i":123.8,"ef":151,"cl":6,"f":["CANT"],"q_ips":133.1,"q_n":1,"cs":{"n":"Collège Franklin","i":104.8,"va":1,"br":84}},{"id":"0590324G","n":"Ecole élémentaire Pasteur-Curie","c":"Faches-Thumesnil","a":"58 rue Jean Jaurès","la":50.60303,"lo":3.07031,"t":"e","s":"u","i":95.5,"ef":172,"cl":8,"f":["CANT"],"q_ips":133.8,"q_n":1,"cs":{"n":"Collège Jean Zay","i":86.9,"va":-4,"br":77}},{"id":"0592672J","n":"Ecole élémentaire Pierre Loti","c":"Lambersart","a":"12 rue Bréguet","la":50.65876,"lo":3.02049,"t":"e","s":"u","i":125.7,"ef":96,"cl":4,"f":["CANT"],"cs":{"n":"Collège Anne Frank","i":123.2,"va":-4,"br":88}},{"id":"0593577T","n":"Ecole élémentaire Ronsard","c":"Mons-en-Baroeul","a":"1 RUE BOSSUET","la":50.6397,"lo":3.10805,"t":"e","s":"u","ef":160,"cl":9,"f":["REP+","CANT"],"cs":{"n":"Collège Charles Baudelaire (0595167W)","ext":true},"i":88.5,"i_source_2020":true,"i_proxy":true,"i_source":"IPS 2020"},{"id":"0594555F","n":"Ecole élémentaire Rousseau-Mme Brunschvicg","c":"Lille","a":"1 rue Hippolyte Lefebvre","la":50.64521,"lo":3.08758,"t":"e","s":"u","i":113.8,"ef":215,"cl":9,"f":["CANT"],"q_ips":99.9,"q_n":1,"cs":{"n":"Collège Martha Desrumaux","i":85,"va":0,"br":78}},{"id":"0591875T","n":"Ecole élémentaire Sévigné","c":"Mons-en-Baroeul","a":"1 rue Jeanne d'Arc","la":50.64447,"lo":3.10264,"t":"e","s":"u","ef":168,"cl":7,"f":["CANT"],"i":123.3,"i_source_2020":true,"i_proxy":true,"i_source":"IPS 2020","cs":{"n":"Collège Descartes","i":101.6,"va":-1,"br":83}},{"id":"0596209D","n":"Ecole élémentaire Sévigné-Voltaire","c":"Lille","a":"1 rue Emile Zola","la":50.63421,"lo":3.00415,"t":"e","s":"u","i":82.7,"ef":285,"cl":17,"f":["ULIS","REP","CANT"],"q_ips":111.7,"q_n":1,"cs":{"n":"Collège Théodore Monod (0594634S)","ext":true}},{"id":"0591595N","n":"Ecole élémentaire Turgot","c":"Lille","a":"86 rue du Faubourg des Postes","la":50.61219,"lo":3.04577,"t":"e","s":"u","i":72.4,"ef":284,"cl":17,"f":["REP+","CANT"],"cs":{"n":"Collège Louise Michel","i":69.1,"va":11,"br":70}},{"id":"0591545J","n":"Ecole élémentaire Viala-Voltaire","c":"Lille","a":"5 rue Viala","la":50.61993,"lo":3.05207,"t":"e","s":"u","i":82.8,"ef":135,"cl":8,"f":["REP+","CANT"],"q_ips":76.6,"q_n":1,"cs":{"n":"Collège Nina Simone","i":79.2}},{"id":"0593542E","n":"Ecole élémentaire Victor Duruy","c":"Lille","a":"7 rue Victor Duruy","la":50.62253,"lo":3.06903,"t":"e","s":"u","i":85.9,"ef":240,"cl":15,"f":["REP+","CANT"],"q_ips":95.9,"q_n":3,"cs":{"n":"Collège Miriam Makeba","i":77.5}},{"id":"0594948H","n":"Ecole élémentaire Victor Hugo","c":"Marcq-en-Baroeul","a":"100 rue Pierre Brossolette","la":50.65837,"lo":3.0985,"t":"e","s":"u","ef":130,"cl":5,"f":["CANT"],"cs":{"n":"Collège Théodore Monod (0594634S)","ext":true},"i":128,"i_source_2020":true,"i_proxy":true,"i_source":"IPS 2020"},{"id":"0592728V","n":"Ecole élémentaire Victor Hugo-Sévigné","c":"Loos","a":"1  RUE ALBERT CHATELET","la":50.60662,"lo":3.01061,"t":"e","s":"u","i":74.5,"ef":165,"cl":10,"f":["REP+","CANT"],"q_ips":83.3,"q_n":3,"cs":{"n":"Collège René Descartes","i":77.6,"va":-3,"br":75}},{"id":"0591687N","n":"Ecole élémentaire Voltaire","c":"Loos","a":"Rue Francisco Ferrer","la":50.6139,"lo":3.01126,"t":"e","s":"u","i":86.8,"ef":153,"cl":7,"f":["CANT"],"q_ips":107.6,"q_n":1,"cs":{"n":"Collège Jean Zay","i":86.9}},{"id":"0591602W","n":"Ecole élémentaire d'application Ampère niveau 2","c":"Lille","a":"85 boulevard Montebello","la":50.62161,"lo":3.04699,"t":"e","s":"u","i":76.6,"ef":231,"cl":15,"f":["REP+","CANT"],"q_ips":81.3,"q_n":4,"cs":{"n":"Collège Claude Lévi-Strauss","i":86.7,"va":-2,"br":81},"sp":["INSPE"]},{"id":"0591617M","n":"Ecole élémentaire d'application Edouard Branly niveau 1","c":"Lille","a":"78 rue de la Barre","la":50.63891,"lo":3.05489,"t":"e","s":"u","i":122.8,"ef":70,"cl":4,"f":["CANT"],"q_ips":122.8,"q_n":1,"i_proxy":true,"i_source":"quartier (1 écoles)","cs":{"n":"Collège Carnot","i":125.9},"sp":["INSPE"]},{"id":"0591641N","n":"Ecole élémentaire d'application Michelet","c":"Lille","a":"20 rue Fabricy","la":50.62696,"lo":3.05917,"t":"e","s":"u","i":133.1,"ef":190,"cl":9,"f":["CANT"],"q_ips":122.6,"q_n":2,"cs":{"n":"Collège Franklin","i":104.8,"va":6,"br":97},"sp":["INSPE"]},{"id":"0596512H","n":"Ecole élémentaire d'application Trulin - Samain","c":"Lille","a":"15 rue Verhaeren","la":50.61949,"lo":3.03178,"t":"e","s":"u","i":74.9,"ef":153,"cl":11,"f":["ULIS","REP","CANT"],"q_ips":76.1,"q_n":4,"sp":["INSPE"],"cs":{"n":"Collège Claude Lévi-Strauss","i":86.7,"va":7,"br":83}},{"id":"0591562C","n":"Ecole élémentaire internationale Sophie Germain","c":"Lille","a":"95 boulevard de la Liberté","la":50.63413,"lo":3.05837,"t":"e","s":"u","i":122.8,"ef":136,"cl":6,"f":["CANT"],"q_ips":154.8,"q_n":1,"sp":["Intl"],"cs":{"n":"Collège Franklin","i":104.8,"va":1,"br":84}},{"id":"0597370R","n":"Ecole élémentaire privée hors contrat CERENE - niveau primaire","c":"Lille","a":"52 rue de l'Alma","la":50.63665,"lo":3.08226,"t":"e","s":"v","i":88.5,"q_ips":88.5,"q_n":5,"i_proxy":true,"i_source":"quartier (5 écoles)","sp":["HC"]},{"id":"0596629K","n":"Ecole élémentaire publique des Provinces","c":"Mons-en-Baroeul","a":"1 bis rue d'Alsace","la":50.64298,"lo":3.11484,"t":"e","s":"u","ef":230,"cl":14,"f":["REP+","CANT"],"i":73.9,"i_source_2020":true,"i_proxy":true,"i_source":"IPS 2020","cs":{"n":"Collège François Rabelais","i":72.9,"va":8,"br":84}},{"id":"0595098W","n":"Ecole maternelle Albert Samain","c":"Ronchin","a":"Rue Balzac","la":50.59779,"lo":3.09532,"t":"m","s":"u","i":95.6,"ef":73,"cl":3,"f":["CANT"],"q_ips":95.6,"q_n":1,"i_proxy":true,"i_source":"quartier (1 écoles)","cs":{"n":"Collège Louise Michel","i":69.1,"va":11,"br":70}},{"id":"0594687Z","n":"Ecole maternelle Alphonse Daudet","c":"Faches-Thumesnil","a":"176 rue Henri Dillies","la":50.59127,"lo":3.07552,"t":"m","s":"u","i":119.6,"ef":114,"cl":5,"f":["CANT"],"i_proxy":true,"i_source":"quartier (5)","cs":{"n":"Collège Jean Mermoz","i":112.8}},{"id":"0591690S","n":"Ecole maternelle Anatole France","c":"Loos","a":"Place Jean Jaurès","la":50.60888,"lo":3.01637,"t":"m","s":"u","i":102.8,"ef":144,"cl":6,"f":["CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Curie - Michelet","q_ips":97.4,"q_n":3,"cs":{"n":"Collège Professeur Albert Debeyre","i":93.3,"va":-10,"br":71}},{"id":"0592821W","n":"Ecole maternelle Anne Frank","c":"Mons-en-Baroeul","a":"41 rue Vincent de Paul","la":50.63797,"lo":3.11328,"t":"m","s":"u","ef":89,"cl":5,"f":["REP+","CANT"],"i":103.5,"i_source_2020":true,"i_proxy":true,"i_source":"IPS 2020","cs":{"n":"Collège François Rabelais","i":72.9,"va":8,"br":84}},{"id":"0591630B","n":"Ecole maternelle Antoine Brasseur","c":"Lille","a":"1  RUE PORRET","la":50.63074,"lo":3.08998,"t":"m","s":"u","i":95.4,"ef":114,"cl":5,"f":["REP+","CANT"],"q_ips":95.4,"q_n":5,"i_proxy":true,"i_source":"quartier (5 écoles)","cs":{"n":"Collège Boris Vian","i":90.9}},{"id":"0591622T","n":"Ecole maternelle Auguste Comte","c":"Lille","a":"10 BIS RUE DE THIONVILLE","la":50.64328,"lo":3.06638,"t":"m","s":"u","i":101.4,"ef":47,"cl":3,"f":["CANT"],"i_proxy":true,"i_source":"Ecole primaire Lamartine - Jenner","q_ips":117.5,"q_n":3,"cs":{"n":"Collège Carnot","i":125.9}},{"id":"0591616L","n":"Ecole maternelle Beranger - Hachette","c":"Lille","a":"4 rue Léon Blum","la":50.61896,"lo":3.03616,"t":"m","s":"u","i":66.4,"ef":85,"cl":6,"f":["REP+","CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Chenier Severine","q_ips":74.9,"q_n":4,"cs":{"n":"Collège Nina Simone","i":79.2,"va":6,"br":82}},{"id":"0591537A","n":"Ecole maternelle Bichat","c":"Lille","a":"2 rue Béranger","la":50.62232,"lo":3.03765,"t":"m","s":"u","i":99,"ef":98,"cl":6,"f":["REP+","CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Littré","q_ips":93.8,"q_n":6,"cs":{"n":"Collège Nina Simone","i":79.2,"va":6,"br":82}},{"id":"0591631C","n":"Ecole maternelle Broca","c":"Lille","a":"Rue du Commerce","la":50.62536,"lo":3.09052,"t":"m","s":"u","i":118.8,"ef":105,"cl":5,"f":["REP+","CANT"],"q_ips":118.8,"q_n":1,"i_proxy":true,"i_source":"quartier (1 écoles)","cs":{"n":"Collège Anatole France","i":95.3}},{"id":"0591558Y","n":"Ecole maternelle Camille Desmoulins","c":"Lille","a":"256 bis boulevard Victor Hugo","la":50.61967,"lo":3.05276,"t":"m","s":"u","i":82.8,"ef":88,"cl":5,"f":["REP+","CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Viala-Voltaire","q_ips":81.5,"q_n":2,"cs":{"n":"Collège Miriam Makeba","i":77.5}},{"id":"0591592K","n":"Ecole maternelle Charles Perrault","c":"Mons-en-Baroeul","a":"4 rue Parmentier","la":50.64253,"lo":3.10125,"t":"m","s":"u","ef":92,"cl":4,"f":["CANT"],"cs":{"n":"Collège Rosa Parks (0593667R)","ext":true},"i":123.3,"i_source_2020":true,"i_proxy":true,"i_source":"IPS 2020"},{"id":"0594719J","n":"Ecole maternelle Charles Perrault","c":"Ronchin","a":"2 rue Millet","la":50.59594,"lo":3.08811,"t":"m","s":"u","i":96.3,"ef":48,"cl":2,"f":["CANT"],"q_ips":96.3,"q_n":2,"i_proxy":true,"i_source":"quartier (2 écoles)","cs":{"n":"Collège Gernez Rieux","i":95.6,"va":0,"br":87}},{"id":"0591692U","n":"Ecole maternelle Charles Perrault","c":"Loos","a":"Rue des Frères Lumière","la":50.60961,"lo":3.01031,"t":"m","s":"u","i":81.5,"ef":69,"cl":5,"f":["REP+","CANT"],"q_ips":81.5,"q_n":5,"i_proxy":true,"i_source":"quartier (5 écoles)","cs":{"n":"Collège René Descartes","i":77.6,"va":-3,"br":73}},{"id":"0591722B","n":"Ecole maternelle Courbet","c":"La Madeleine","a":"Rue Courbet","la":50.65616,"lo":3.0633,"t":"m","s":"u","i":96.7,"ef":81,"cl":3,"f":["CANT"],"q_ips":96.7,"q_n":3,"i_proxy":true,"i_source":"quartier (3 écoles)","cs":{"n":"Collège Jean-Baptiste Lebas (0590190L)","ext":true}},{"id":"0591488X","n":"Ecole maternelle Desrousseaux","c":"Lambersart","a":"35 rue Henri de Moraes","la":50.65194,"lo":3.01189,"t":"m","s":"u","i":120.8,"ef":111,"cl":5,"f":["CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Pasteur","q_ips":120.7,"q_n":2,"cs":{"n":"Collège Lavoisier","i":101.3,"va":-8,"br":81}},{"id":"0591387M","n":"Ecole maternelle Dombrowski","c":"Lille","a":"Place Dombrowski","la":50.63263,"lo":3.10827,"t":"m","s":"u","i":104.3,"ef":123,"cl":5,"f":["CANT"],"q_ips":104.3,"q_n":1,"i_proxy":true,"i_source":"quartier (1 écoles)","cs":{"n":"Collège Saint-Exupéry","i":101.5,"va":7,"br":92}},{"id":"0594332N","n":"Ecole maternelle Du Bellay","c":"Lille","a":"11  RUE DES PYRAMIDES","la":50.62736,"lo":3.05973,"t":"m","s":"u","i":133.1,"ef":99,"cl":4,"f":["CANT"],"i_proxy":true,"i_source":"Ecole élémentaire d'application Michelet","q_ips":129,"q_n":2,"cs":{"n":"Collège Rosa Parks (0593667R)","ext":true}},{"id":"0594239M","n":"Ecole maternelle Eugène d'Hallendre","c":"La Madeleine","a":"48 rue Eugène Hallendre","la":50.65892,"lo":3.07037,"t":"m","s":"u","i":89.2,"ef":99,"cl":4,"f":["CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Kleber","q_ips":92.9,"q_n":2,"cs":{"n":"Collège Yvonne Abbas","i":95.6,"va":-16,"br":68}},{"id":"0594333P","n":"Ecole maternelle Florian","c":"Loos","a":"Rue Réaumur","la":50.60808,"lo":3.01066,"t":"m","s":"u","i":74.5,"ef":59,"cl":3,"f":["REP+","CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Victor Hugo-Sévigné","q_ips":80.5,"q_n":4,"cs":{"n":"Collège René Descartes","i":77.6,"va":-3,"br":73}},{"id":"0591135N","n":"Ecole maternelle Florian","c":"Faches-Thumesnil","a":"38 rue Carnot","la":50.60693,"lo":3.06563,"t":"m","s":"u","i":93.2,"ef":129,"cl":6,"f":["CANT"],"q_ips":93.2,"q_n":2,"i_proxy":true,"i_source":"quartier (2 écoles)","cs":{"n":"Collège Jean Zay","i":86.9}},{"id":"0594962Y","n":"Ecole maternelle George Sand","c":"Ronchin","a":"2 rue Vincent Auriol","la":50.59603,"lo":3.09258,"t":"m","s":"u","i":95.6,"ef":53,"cl":2,"f":["CANT"],"q_ips":95.6,"q_n":2,"i_proxy":true,"i_source":"quartier (2 écoles)","cs":{"n":"Collège Gernez Rieux","i":95.6,"va":0,"br":87}},{"id":"0592628L","n":"Ecole maternelle Georges Méliès","c":"Marcq-en-Baroeul","a":"27 rue Désiré Desmettre","la":50.65669,"lo":3.09786,"t":"m","s":"u","ef":93,"cl":4,"f":["CANT"],"i":124.4,"i_source_2020":true,"i_proxy":true,"i_source":"IPS 2020","cs":{"n":"Collège Rouges Barres","i":85.5,"va":-6,"br":86}},{"id":"0591571M","n":"Ecole maternelle Gutenberg","c":"Lille","a":"16 rue de la Baignerie","la":50.63755,"lo":3.05737,"t":"m","s":"u","i":122.8,"ef":114,"cl":5,"f":["CANT"],"q_ips":122.8,"q_n":1,"i_proxy":true,"i_source":"quartier (1 écoles)","cs":{"n":"Collège Carnot","i":125.9}},{"id":"0594704T","n":"Ecole maternelle Henri Matisse","c":"Marcq-en-Baroeul","a":"Allée des Charmes","la":50.68216,"lo":3.09556,"t":"m","s":"u","ef":92,"cl":4,"f":["CANT"],"i":130.2,"i_source_2020":true,"i_proxy":true,"i_source":"IPS 2020","cs":{"n":"Collège Du Lazaro","i":117.3,"va":-9,"br":79}},{"id":"0591615K","n":"Ecole maternelle Jean Jaurès","c":"Lille","a":"6 rue Guillaume Tell","la":50.6328,"lo":3.02771,"t":"m","s":"u","i":98.8,"ef":122,"cl":6,"f":["REP","CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Desbordes Valmore","q_ips":102.8,"q_n":2,"cs":{"n":"Collège Jean Zay","i":89.9,"va":3,"br":93}},{"id":"0591619P","n":"Ecole maternelle Jean-Jacques Rousseau","c":"Lille","a":"6 rue du Lieutenant Colpin","la":50.64248,"lo":3.05452,"t":"m","s":"u","i":126.3,"ef":127,"cl":5,"f":["CANT"],"q_ips":126.3,"q_n":1,"i_proxy":true,"i_source":"quartier (1 écoles)","cs":{"n":"Collège Carnot","i":125.9}},{"id":"0591559Z","n":"Ecole maternelle Jeanne Godart","c":"Lille","a":"2 rue Paul Bardou","la":50.60738,"lo":3.05669,"t":"m","s":"u","i":77,"ef":79,"cl":5,"f":["REP+","CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Bracke-Desrousseaux","q_ips":74.7,"q_n":2,"cs":{"n":"Collège Louise Michel","i":69.1,"va":11,"br":70}},{"id":"0596366Z","n":"Ecole maternelle Jules Ferry-Demory","c":"Lille","a":"13 rue Albert Deberdt","la":50.64182,"lo":2.99135,"t":"m","s":"u","i":100.9,"ef":103,"cl":5,"f":["CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Marie Curie-Louis Past","q_ips":101.2,"q_n":3,"cs":{"n":"Collège Guy Mollet","i":102.7,"va":5,"br":98}},{"id":"0591589G","n":"Ecole maternelle Jules Simon","c":"Lille","a":"122 rue du Buisson","la":50.65083,"lo":3.08942,"t":"m","s":"u","i":128.8,"ef":139,"cl":7,"f":["CANT"],"i_proxy":true,"i_source":"Ecole primaire Anatole France","q_ips":125.7,"q_n":3,"cs":{"n":"Collège Martha Desrumaux","i":85,"va":0,"br":78}},{"id":"0595511V","n":"Ecole maternelle La Briqueterie","c":"Lille","a":"33 rue Victor Tilmant","la":50.60823,"lo":3.05435,"t":"m","s":"u","i":77,"ef":57,"cl":4,"f":["REP+","CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Bracke-Desrousseaux","q_ips":75.4,"q_n":3,"cs":{"n":"Collège Louise Michel","i":69.1,"va":11,"br":70}},{"id":"0591560A","n":"Ecole maternelle La Bruyère","c":"Lille","a":"8 rue de l'Escaut","la":50.61336,"lo":3.05353,"t":"m","s":"u","i":81.1,"ef":118,"cl":6,"f":["REP+","CANT"],"q_ips":81.1,"q_n":2,"i_proxy":true,"i_source":"quartier (2 écoles)","cs":{"n":"Collège Verlaine","i":83.2,"va":-10,"br":69}},{"id":"0591691T","n":"Ecole maternelle La Fontaine","c":"Loos","a":"Place la Fontaine","la":50.61846,"lo":3.00955,"t":"m","s":"u","i":103.1,"ef":112,"cl":5,"f":["CANT"],"q_ips":103.1,"q_n":2,"i_proxy":true,"i_source":"quartier (2 écoles)","cs":{"n":"Collège Professeur Albert Debeyre","i":93.3,"va":-10,"br":71}},{"id":"0591878W","n":"Ecole maternelle La Fontaine","c":"Mons-en-Baroeul","a":"43 rue de l'An quarante","la":50.63684,"lo":3.10886,"t":"m","s":"u","ef":89,"cl":4,"f":["CANT"],"i":82.5,"i_source_2020":true,"i_proxy":true,"i_source":"IPS 2020","cs":{"n":"Collège Descartes","i":101.6,"va":-1,"br":83}},{"id":"0591134M","n":"Ecole maternelle La Fontaine","c":"Faches-Thumesnil","a":"18 bis rue Salengro","la":50.60353,"lo":3.06882,"t":"m","s":"u","i":133.8,"ef":100,"cl":5,"f":["CANT"],"q_ips":133.8,"q_n":1,"i_proxy":true,"i_source":"quartier (1 écoles)","cs":{"n":"Collège Jean Zay","i":86.9,"va":-4,"br":77}},{"id":"0591665P","n":"Ecole maternelle La Fontaine","c":"Lille","a":"1 rue Lamartine","la":50.62249,"lo":3.06458,"t":"m","s":"u","i":86,"ef":90,"cl":4,"f":["CANT"],"q_ips":86,"q_n":5,"i_proxy":true,"i_source":"quartier (5 écoles)","cs":{"n":"Collège Maxence Van Der Meersch (0595168X)","ext":true}},{"id":"0591590H","n":"Ecole maternelle La Fontaine","c":"Lille","a":"95 bis rue Saint Gabriel","la":50.6406,"lo":3.08643,"t":"m","s":"u","i":99.9,"ef":79,"cl":3,"f":["CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Madame Roland","q_ips":93.7,"q_n":5,"cs":{"n":"Collège Martha Desrumaux","i":85,"va":0,"br":78}},{"id":"0593630A","n":"Ecole maternelle Lamartine","c":"Mons-en-Baroeul","a":"2 bis rue Ile-de-France","la":50.64578,"lo":3.1152,"t":"m","s":"u","ef":120,"cl":7,"f":["REP+","CANT"],"i":73.9,"i_source_2020":true,"i_proxy":true,"i_source":"IPS 2020","cs":{"n":"Collège François Rabelais","i":72.9,"va":8,"br":84}},{"id":"0594954P","n":"Ecole maternelle Le Petit Prince","c":"Mons-en-Baroeul","a":"17 boulevard Mendès France","la":50.64623,"lo":3.11324,"t":"m","s":"u","ef":103,"cl":7,"f":["REP+","CANT"],"i":74.6,"i_source_2020":true,"i_proxy":true,"i_source":"IPS 2020","cs":{"n":"Collège François Rabelais","i":72.9,"va":8,"br":84}},{"id":"0591668T","n":"Ecole maternelle Le Petit Quinquin","c":"Lille","a":"72 bis rue Ancienne Balaterie","la":50.63726,"lo":3.008,"t":"m","s":"u","i":82.7,"ef":80,"cl":4,"f":["CANT"],"q_ips":82.7,"q_n":2,"i_proxy":true,"i_source":"quartier (2 écoles)","cs":{"n":"Collège Jean Jaurès","i":82.6,"va":5,"br":85}},{"id":"0595035C","n":"Ecole maternelle Les Moulins","c":"Lille","a":"66 rue de la Plaine","la":50.62159,"lo":3.06961,"t":"m","s":"u","i":85.9,"ef":104,"cl":6,"f":["REP+","CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Victor Duruy","q_ips":89.7,"q_n":4,"cs":{"n":"Collège Miriam Makeba","i":77.5}},{"id":"0591594M","n":"Ecole maternelle Les Petits Pouchins","c":"Lille","a":"3 rue des Déportés","la":50.63101,"lo":3.07349,"t":"m","s":"u","i":104.3,"ef":100,"cl":5,"f":["CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Lalo - Clement","q_ips":109,"q_n":5,"cs":{"n":"Collège Franklin","i":104.8,"va":1,"br":84}},{"id":"0591689R","n":"Ecole maternelle Louise Michel","c":"Loos","a":"Rue Lamartine","la":50.61721,"lo":3.01596,"t":"m","s":"u","i":103.5,"ef":132,"cl":5,"f":["CANT"],"q_ips":103.5,"q_n":3,"i_proxy":true,"i_source":"quartier (3 écoles)","cs":{"n":"Collège Maxence Van Der Meersch (0595168X)","ext":true}},{"id":"0591555V","n":"Ecole maternelle Léon Frapie","c":"Lille","a":"3 rue du Capitaine Michel","la":50.61464,"lo":3.07213,"t":"m","s":"u","i":79.2,"ef":68,"cl":4,"f":["REP+","CANT"],"q_ips":79.2,"q_n":3,"i_proxy":true,"i_source":"quartier (3 écoles)","cs":{"n":"Collège professeur Albert Debeyre","i":93.3}},{"id":"0594451T","n":"Ecole maternelle Léon Jouhaux","c":"Lille","a":"15 avenue Léon Jouhaux","la":50.63594,"lo":3.04245,"t":"m","s":"u","i":81.7,"ef":47,"cl":3,"f":["CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Léon Jouhaux","q_ips":86,"q_n":3,"cs":{"n":"Collège Claude Lévi-Strauss","i":86.7,"va":7,"br":83}},{"id":"0592032N","n":"Ecole maternelle Madame René Coty","c":"Ronchin","a":"66 rue Roger Salengro","la":50.60142,"lo":3.0977,"t":"m","s":"u","i":95.6,"ef":151,"cl":6,"f":["CANT"],"q_ips":95.6,"q_n":1,"i_proxy":true,"i_source":"quartier (1 écoles)","cs":{"n":"Collège Jean Zay","i":86.9}},{"id":"0592835L","n":"Ecole maternelle Marceline Desbordes-Valmore","c":"Loos","a":"Rue Albert Châtelet","la":50.60544,"lo":3.01061,"t":"m","s":"u","i":74.5,"ef":82,"cl":5,"f":["REP+","CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Victor Hugo-Sévigné","q_ips":77.2,"q_n":4,"cs":{"n":"Collège René Descartes","i":77.6,"va":-3,"br":73}},{"id":"0591760T","n":"Ecole maternelle Marie Curie","c":"Marcq-en-Baroeul","a":"16 place du Général de Gaulle","la":50.676,"lo":3.09142,"t":"m","s":"u","ef":79,"cl":4,"f":["CANT"],"i":105.3,"i_source_2020":true,"i_proxy":true,"i_source":"IPS 2020","cs":{"n":"Collège Du Lazaro","i":117.3,"va":-9,"br":79}},{"id":"0591591J","n":"Ecole maternelle Maurice Bouchor","c":"Lille","a":"1  RUE HIPPOLYTE LEFEBVRE","la":50.64521,"lo":3.08758,"t":"m","s":"u","i":113.8,"ef":110,"cl":5,"f":["CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Rousseau-Mme Brunschvi","q_ips":112.2,"q_n":2,"cs":{"n":"Collège Martha Desrumaux","i":85,"va":0,"br":78}},{"id":"0595053X","n":"Ecole maternelle Montaigne","c":"Mons-en-Baroeul","a":"3 rue de Gascogne","la":50.6476,"lo":3.11953,"t":"m","s":"u","ef":66,"cl":4,"f":["REP+","CANT"],"i":75.3,"i_source_2020":true,"i_proxy":true,"i_source":"IPS 2020","cs":{"n":"Collège François Rabelais","i":72.9,"va":8,"br":84}},{"id":"0594235H","n":"Ecole maternelle Mozart","c":"Lambersart","a":"2 allée Hélène Boucher","la":50.65768,"lo":3.02073,"t":"m","s":"u","i":125.7,"ef":62,"cl":3,"f":["CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Pierre Loti","q_ips":125.8,"q_n":2,"cs":{"n":"Collège Anne Frank","i":123.2,"va":-4,"br":88}},{"id":"0591561B","n":"Ecole maternelle Mozart","c":"Lille","a":"1  PARVIS SAINT MICHEL","la":50.6271,"lo":3.06179,"t":"m","s":"u","i":123.8,"ef":118,"cl":6,"f":["CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Pasteur","q_ips":127.7,"q_n":2,"cs":{"n":"Collège Franklin","i":104.8,"va":6,"br":97}},{"id":"0591568J","n":"Ecole maternelle Ovide Decroly","c":"Lille","a":"29 rue Littré","la":50.62576,"lo":3.05234,"t":"m","s":"u","i":122.7,"ef":112,"cl":7,"f":["REP+","CANT"],"q_ips":122.7,"q_n":6,"i_proxy":true,"i_source":"quartier (6 écoles)","cs":{"n":"Collège Nina Simone","i":79.2,"va":6,"br":82}},{"id":"0591761U","n":"Ecole maternelle Pascal","c":"Marcq-en-Baroeul","a":"30 rue de l'Ermitage","la":50.65987,"lo":3.07809,"t":"m","s":"u","i":138.3,"ef":140,"cl":6,"f":["CANT"],"q_ips":138.3,"q_n":1,"i_proxy":true,"i_source":"quartier (1 écoles)","cs":{"n":"Collège Rouges Barres","i":85.5,"va":-6,"br":86}},{"id":"0594234G","n":"Ecole maternelle Pascal","c":"Faches-Thumesnil","a":"2 rue de Paris","la":50.5963,"lo":3.07096,"t":"m","s":"u","i":111.3,"ef":98,"cl":4,"f":["CANT"],"i_proxy":true,"i_source":"quartier (6)","cs":{"n":"Collège Lavoisier","i":101.3,"va":-8,"br":81}},{"id":"0591666R","n":"Ecole maternelle Paul Bert","c":"Lille","a":"43 rue Eugène Varlin","la":50.64867,"lo":3.0046,"t":"m","s":"u","i":95.4,"ef":105,"cl":5,"f":["REP","CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Léon Blum","q_ips":95.4,"q_n":1,"cs":{"n":"Collège Jean Zay","i":89.9,"va":4,"br":88}},{"id":"0591663M","n":"Ecole maternelle Paul Langevin","c":"Lille","a":"263 avenue Notebart","la":50.63065,"lo":3.01352,"t":"m","s":"u","i":102.3,"ef":86,"cl":4,"f":["CANT"],"i_proxy":true,"i_source":"Ecole primaire Salengro","q_ips":103.8,"q_n":2,"cs":{"n":"Collège Jean Jaurès","i":82.6,"va":5,"br":85}},{"id":"0592033P","n":"Ecole maternelle Pauline Kergomard","c":"Ronchin","a":"1 rue du 11 Novembre","la":50.6028,"lo":3.08776,"t":"m","s":"u","i":97,"ef":151,"cl":6,"f":["CANT"],"q_ips":97,"q_n":2,"i_proxy":true,"i_source":"quartier (2 écoles)","cs":{"n":"Collège Charles Baudelaire (0595167W)","ext":true}},{"id":"0591554U","n":"Ecole maternelle Pauline Kergomard","c":"Lille","a":"2 rue Georges Mandel","la":50.61801,"lo":3.07562,"t":"m","s":"u","i":71.3,"ef":118,"cl":6,"f":["REP","CANT"],"i_proxy":true,"i_source":"Ecole élémentaire François Launay","q_ips":71.3,"q_n":1,"cs":{"n":"Collège Anatole France","i":95.3}},{"id":"0592664A","n":"Ecole maternelle Perrault","c":"Lambersart","a":"102 avenue de la Liberté","la":50.6557,"lo":3.03257,"t":"m","s":"u","i":134.2,"ef":89,"cl":4,"f":["CANT"],"q_ips":134.2,"q_n":1,"i_proxy":true,"i_source":"quartier (1 écoles)","cs":{"n":"Collège Anne Frank","i":123.2,"va":-4,"br":88}},{"id":"0591553T","n":"Ecole maternelle Philippe de Comines","c":"Lille","a":"3 rue Victor Duruy","la":50.6228,"lo":3.06878,"t":"m","s":"u","i":85.9,"ef":107,"cl":6,"f":["REP+","CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Victor Duruy","q_ips":90.4,"q_n":4,"cs":{"n":"Collège Miriam Makeba","i":77.5}},{"id":"0595368P","n":"Ecole maternelle Rachel Lempereur","c":"Lille","a":"Rue Jean Giraudoux","la":50.60789,"lo":3.04528,"t":"m","s":"u","i":71.2,"ef":85,"cl":4,"f":["REP+","CANT"],"q_ips":71.2,"q_n":3,"i_proxy":true,"i_source":"quartier (3 écoles)","cs":{"n":"Collège Louise Michel","i":69.1,"va":11,"br":70}},{"id":"0592660W","n":"Ecole maternelle Reine Astrid","c":"Mons-en-Baroeul","a":"43 bis rue Lacordaire","la":50.63905,"lo":3.10778,"t":"m","s":"u","ef":111,"cl":6,"f":["REP+","CANT"],"i":88.5,"i_source_2020":true,"i_proxy":true,"i_source":"IPS 2020","cs":{"n":"Collège Descartes","i":101.6,"va":-1,"br":83}},{"id":"0591385K","n":"Ecole maternelle Roger Salengro","c":"Lille","a":"Rue Anatole France","la":50.6375,"lo":3.0664,"t":"m","s":"u","i":101,"ef":106,"cl":4,"f":["CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Jean Jaurès","q_ips":113.2,"q_n":4,"cs":{"n":"Collège Jean Zay","i":86.9}},{"id":"0591587E","n":"Ecole maternelle Suzanne Lacore","c":"Lille","a":"16 rue Bohin","la":50.6319,"lo":3.09731,"t":"m","s":"u","i":78.2,"ef":171,"cl":10,"f":["REP+","CANT"],"i_proxy":true,"i_source":"Ecole primaire Berthelot - Jules Verne","q_ips":92,"q_n":4,"cs":{"n":"Collège Boris Vian","i":90.9}},{"id":"0591667S","n":"Ecole maternelle Victor Hugo","c":"Lille","a":"36 rue de l'Egalité","la":50.63194,"lo":3.00381,"t":"m","s":"u","i":98.4,"ef":96,"cl":5,"f":["REP","CANT"],"q_ips":98.4,"q_n":2,"i_proxy":true,"i_source":"quartier (2 écoles)","cs":{"n":"Collège Jean Jaurès","i":82.6,"va":5,"br":85}},{"id":"0591557X","n":"Ecole maternelle Victor Hugo","c":"Lille","a":"137 boulevard Victor Hugo","la":50.62154,"lo":3.06054,"t":"m","s":"u","i":72.7,"ef":135,"cl":8,"f":["REP+","CANT"],"i_proxy":true,"i_source":"Ecole primaire Arago - Jacquart","q_ips":75.7,"q_n":3,"cs":{"n":"Collège Miriam Makeba","i":77.5}},{"id":"0591638K","n":"Ecole maternelle d'application André","c":"Lille","a":"42 ter rue Paul Lafargue","la":50.62127,"lo":3.04794,"t":"m","s":"u","i":76.6,"ef":173,"cl":10,"f":["REP+","CANT"],"i_proxy":true,"i_source":"Ecole élémentaire d'application Ampère n","q_ips":78.6,"q_n":4,"cs":{"n":"Collège Charles Baudelaire (0595167W)","ext":true},"sp":["INSPE"]},{"id":"0591639L","n":"Ecole maternelle d'application Jean Aicard","c":"Lille","a":"23 avenue Verhaeren","la":50.61996,"lo":3.03116,"t":"m","s":"u","i":74.9,"ef":120,"cl":7,"f":["REP","CANT"],"i_proxy":true,"i_source":"Ecole élémentaire d'application Trulin -","q_ips":76.4,"q_n":5,"cs":{"n":"Collège Claude Lévi-Strauss","i":86.7,"va":-2,"br":81},"sp":["INSPE"]},{"id":"0591723C","n":"Ecole maternelle du Moulin Alphonse Daudet","c":"La Madeleine","a":"32 rue du Moulin","la":50.65351,"lo":3.07082,"t":"m","s":"u","i":104.5,"ef":92,"cl":4,"f":["CANT"],"i_proxy":true,"i_source":"Ecole élémentaire Edmond Rostand","q_ips":111.9,"q_n":5,"cs":{"n":"Collège Carnot","i":125.9}},{"id":"0597100X","n":"Ecole européenne de Lille Métropole Jacques Delors - niveau école primaire","c":"Marcq-en-Baroeul","a":"116 rue du Docteur Charcot","la":50.66219,"lo":3.08676,"t":"p","s":"u","i":84.5,"ef":363,"cl":14,"f":["CANT"],"i_proxy":true,"i_source":"quartier (1)","cs":{"n":"Collège professeur Albert Debeyre","i":93.3},"sp":["Européenne"]},{"id":"0591578V","n":"Ecole primaire Anatole France","c":"Lille","a":"13 rue Alphonse Leroy","la":50.65062,"lo":3.08999,"t":"p","s":"u","i":128.8,"ef":239,"cl":11,"f":["ULIS","CANT"],"q_ips":126.2,"q_n":2,"cs":{"n":"Collège Martha Desrumaux","i":85,"va":0,"br":78}},{"id":"0593567G","n":"Ecole primaire Arago - Jacquart","c":"Lille","a":"133 boulevard Victor Hugo","la":50.62167,"lo":3.06088,"t":"p","s":"u","i":72.7,"ef":206,"cl":12,"f":["REP+","ULIS","CANT"],"q_ips":84.6,"q_n":3,"cs":{"n":"Collège Miriam Makeba","i":77.5}},{"id":"0597265B","n":"Ecole primaire Ariane Capon","c":"Lille","a":"2 quater boulevard de Belfort","la":50.62104,"lo":3.07855,"t":"p","s":"u","i":71.3,"ef":291,"cl":16,"f":["REP","CANT"],"q_ips":71.3,"q_n":1,"i_proxy":true,"i_source":"quartier (1 écoles)","cs":{"n":"Collège Rosa Parks (0593667R)","ext":true}},{"id":"0593539B","n":"Ecole primaire Berthelot - Jules Verne","c":"Lille","a":"6 rue Bohin","la":50.63136,"lo":3.09707,"t":"p","s":"u","i":78.2,"ef":272,"cl":15,"f":["REP+","ULIS","CANT"],"q_ips":97.7,"q_n":3,"cs":{"n":"Collège Boris Vian","i":90.9}},{"id":"0591584B","n":"Ecole primaire Boufflers - Monge - Wicar","c":"Lille","a":"11 rue Saint-Sauveur","la":50.6323,"lo":3.07131,"t":"p","s":"u","i":99.4,"ef":334,"cl":16,"f":["ULIS","CANT"],"q_ips":112.3,"q_n":4,"cs":{"n":"Collège Franklin","i":104.8,"va":1,"br":84}},{"id":"0593554T","n":"Ecole primaire Cabanis - Bara","c":"Lille","a":"1 BIS RUE CABANIS","la":50.63547,"lo":3.09368,"t":"p","s":"u","i":127.8,"ef":289,"cl":16,"f":["REP+","CANT"],"q_ips":87.6,"q_n":5,"cs":{"n":"Collège Boris Vian","i":90.9}},{"id":"0591574R","n":"Ecole primaire Descartes - Montesquieu","c":"Lille","a":"1  RUE LOUIS BLANC","la":50.63601,"lo":3.08932,"t":"p","s":"u","i":77.3,"ef":253,"cl":16,"f":["ULIS","CANT"],"q_ips":110.2,"q_n":5,"cs":{"n":"Collège Saint-Exupéry","i":101.5,"va":8,"br":95}},{"id":"0592819U","n":"Ecole primaire Dolto - Péguy","c":"Marcq-en-Baroeul","a":"Avenue de Lattre de Tassigny","la":50.66795,"lo":3.08651,"t":"p","s":"u","ef":207,"cl":10,"f":["ULIS","CANT"],"i":88.6,"i_source_2020":true,"i_proxy":true,"i_source":"IPS 2020","cs":{"n":"Collège Du Lazaro","i":117.3,"va":-9,"br":79}},{"id":"0593467Y","n":"Ecole primaire Edouard Herriot","c":"Lille","a":"100  RUE PAVE DU MOULIN","la":50.62057,"lo":3.12083,"t":"p","s":"u","i":114.4,"ef":184,"cl":8,"f":["CANT"],"cs":{"n":"Collège Saint-Exupéry","i":101.5,"va":8,"br":95}},{"id":"0592817S","n":"Ecole primaire George Sand - Mozart","c":"Faches-Thumesnil","a":"130 rue de Dunkerque","la":50.59708,"lo":3.07531,"t":"p","s":"u","i":107.7,"ef":226,"cl":9,"f":["CANT"],"cs":{"n":"Collège Jean Mermoz","i":112.8}},{"id":"0591684K","n":"Ecole primaire George Sand-Alphonse Daudet","c":"Loos","a":"Rue Edouard Herriot","la":50.60889,"lo":3.00671,"t":"p","s":"u","i":78.5,"ef":215,"cl":13,"f":["REP+","ULIS","CANT"],"q_ips":76.8,"q_n":2,"cs":{"n":"Collège René Descartes","i":77.6,"va":-3,"br":75}},{"id":"0594935U","n":"Ecole primaire Hugo - Maintenon - Lanoy - Blin","c":"Lambersart","a":"84 bis rue Aristide Briand","la":50.64093,"lo":3.02387,"t":"p","s":"u","i":127.8,"ef":387,"cl":16,"f":["CANT"],"q_ips":115.5,"q_n":3,"cs":{"n":"Collège Lavoisier","i":101.3,"va":-8,"br":81}},{"id":"0595238Y","n":"Ecole primaire Jean Moulin-Louis Pergaud","c":"Lille","a":"1  RUE D'ARSONVAL","la":50.60954,"lo":3.07156,"t":"p","s":"u","i":100.8,"ef":390,"cl":17,"f":["CANT"],"q_ips":83.8,"q_n":2,"cs":{"n":"Collège Verlaine","i":83.2,"va":-10,"br":69}},{"id":"0595085G","n":"Ecole primaire Jean Rostand","c":"Lille","a":"29 boulevard de l'Epine","la":50.62007,"lo":3.10375,"t":"p","s":"u","i":75.7,"ef":247,"cl":10,"f":["CANT"],"q_ips":107.2,"q_n":1,"cs":{"n":"Collège Saint-Exupéry","i":101.5,"va":7,"br":92}},{"id":"0593570K","n":"Ecole primaire Lamartine - Jenner","c":"Lille","a":"2 place du Gard","la":50.64297,"lo":3.0645,"t":"p","s":"u","i":101.4,"ef":198,"cl":12,"f":["CANT"],"q_ips":130.4,"q_n":3,"cs":{"n":"Collège Carnot","i":125.9}},{"id":"0591635G","n":"Ecole primaire Lavoisier - Gounod","c":"Lille","a":"72 rue des Stations","la":50.62948,"lo":3.04765,"t":"p","s":"u","i":129.6,"ef":242,"cl":10,"f":["CANT"],"q_ips":133.2,"q_n":7,"cs":{"n":"Collège Nina Simone","i":79.2}},{"id":"0594510G","n":"Ecole primaire Les Dondaines","c":"Lille","a":"23 rue Eugène Jacquet","la":50.63827,"lo":3.08215,"t":"p","s":"u","i":87.3,"ef":181,"cl":9,"f":["CANT"],"q_ips":87.3,"q_n":5,"i_proxy":true,"i_source":"quartier (5 écoles)","cs":{"n":"Collège Martha Desrumaux","i":85,"va":-3,"br":76}},{"id":"0591563D","n":"Ecole primaire Madame de Maintenon","c":"Lille","a":"20 bis rue du Port","la":50.63361,"lo":3.04372,"t":"p","s":"u","i":91,"ef":162,"cl":10,"f":["ULIS","CANT"],"q_ips":116,"q_n":7,"cs":{"n":"Collège Nina Simone","i":79.2}},{"id":"0591640M","n":"Ecole primaire Maria Montessori","c":"Lille","a":"62 rue Mermoz","la":50.62861,"lo":3.02635,"t":"p","s":"u","i":98.8,"ef":225,"cl":14,"f":["REP","CANT"],"q_ips":98.8,"q_n":1,"i_proxy":true,"i_source":"quartier (1 écoles)","cs":{"n":"Collège Jean Zay","i":86.9},"sp":["Montessori"]},{"id":"0591609D","n":"Ecole primaire Nadaud - Briand - Buisson","c":"Lille","a":"7 boulevard Eugène Duthoit","la":50.60747,"lo":3.03991,"t":"p","s":"u","i":74.4,"ef":439,"cl":25,"f":["REP+","CANT"],"q_ips":69.1,"q_n":1,"cs":{"n":"Collège Louise Michel","i":69.1,"va":11,"br":70}},{"id":"0596393D","n":"Ecole primaire Rameau","c":"Lambersart","a":"5 place de la Cessoie","la":50.65795,"lo":3.03673,"t":"p","s":"u","i":134.2,"ef":135,"cl":6,"f":["CANT"],"cs":{"n":"Collège Anne Frank","i":123.2,"va":0,"br":97}},{"id":"0594696J","n":"Ecole primaire Richard Wagner","c":"Lille","a":"184 rue Paul Bourget","la":50.60441,"lo":3.05435,"t":"p","s":"u","i":69.3,"ef":421,"cl":24,"f":["REP+","ULIS","CANT"],"q_ips":77,"q_n":1,"cs":{"n":"Collège Louise Michel","i":69.1,"va":11,"br":70}},{"id":"0594698L","n":"Ecole primaire Salengro","c":"Lille","a":"257 avenue Arthur Notebart","la":50.63165,"lo":3.01245,"t":"p","s":"u","i":102.3,"ef":180,"cl":8,"f":["CANT"],"q_ips":111.7,"q_n":1,"cs":{"n":"Collège Jean Jaurès","i":82.6,"va":10,"br":93}},{"id":"0591652A","n":"Ecole primaire Sand - Bracke Desrousseaux - Michelet","c":"Lille","a":"37 avenue de la République","la":50.65505,"lo":3.0867,"t":"p","s":"u","i":84.5,"ef":336,"cl":15,"f":["ULIS","CANT"],"q_ips":132,"q_n":2,"cs":{"n":"Collège Rouges Barres","i":85.5,"va":-6,"br":86}},{"id":"0591481P","n":"Ecole primaire Watteau - La Fontaine","c":"Lambersart","a":"6 rue Kléber","la":50.64916,"lo":3.03768,"t":"p","s":"u","i":139.7,"ef":319,"cl":13,"f":["CANT"],"q_ips":139.7,"q_n":2,"i_proxy":true,"i_source":"quartier (2 écoles)","cs":{"n":"Collège Anne Frank","i":123.2,"va":-4,"br":88}},{"id":"0593904Y","n":"Ecole primaire privée Jean Bosco - Notre Dame des Jeunes","c":"Marcq-en-Baroeul","a":"170 rue du Collège","la":50.68074,"lo":3.10732,"t":"p","s":"v","ef":529,"cl":19,"f":["CANT"],"px":1560},{"id":"0596419G","n":"Ecole primaire privée La Salle","c":"Lille","a":"195 rue des Stations","la":50.62479,"lo":3.04053,"t":"p","s":"v","i":128,"ef":339,"cl":13,"q_ips":97.1,"q_n":6,"px":1320},{"id":"0593977C","n":"Ecole primaire privée Notre-Dame","c":"Loos","a":"25 bis place Carnot","la":50.61729,"lo":3.01356,"t":"p","s":"v","i":107.6,"ef":151,"cl":6,"f":["CANT"],"q_ips":86.8,"q_n":1},{"id":"0593833W","n":"Ecole primaire privée Notre-Dame de La Paix","c":"Lille","a":"11 place aux Bleuets","la":50.64119,"lo":3.06766,"t":"p","s":"v","i":133.7,"ef":251,"cl":10,"f":["CANT"],"q_ips":112.8,"q_n":3,"px":1200},{"id":"0593790Z","n":"Ecole primaire privée Notre-Dame de La Treille","c":"Faches-Thumesnil","a":"12 rue Kléber","la":50.58932,"lo":3.07582,"t":"p","s":"v","i":135.2,"ef":222,"cl":8,"f":["CANT"],"px":1200},{"id":"0594061U","n":"Ecole primaire privée Notre-Dame de Lourdes","c":"Ronchin","a":"105 avenue Jean Jaurès","la":50.60533,"lo":3.07677,"t":"p","s":"v","i":133.8,"ef":332,"cl":12,"f":["CANT"],"q_ips":100.8,"q_n":1,"px":1200},{"id":"0593905Z","n":"Ecole primaire privée Notre-Dame de Lourdes","c":"Marcq-en-Baroeul","a":"13 rue du Docteur Ducroquet","la":50.67778,"lo":3.09087,"t":"p","s":"v","ef":498,"cl":18,"f":["CANT"],"px":1320},{"id":"0593903X","n":"Ecole primaire privée Notre-Dame des Victoires","c":"Marcq-en-Baroeul","a":"66 rue Jacquard","la":50.66528,"lo":3.07169,"t":"p","s":"v","ef":125,"cl":5,"f":["CANT"],"px":1200},{"id":"0593821H","n":"Ecole primaire privée Sacré-Coeur","c":"Lambersart","a":"12 bis avenue Pottier","la":50.65119,"lo":3.0392,"t":"p","s":"v","i":134.3,"ef":163,"cl":6,"f":["CANT"],"q_ips":143.6,"q_n":1,"px":1320},{"id":"0593953B","n":"Ecole primaire privée Sacré-Coeur","c":"Lille","a":"18 rue Condorcet","la":50.63396,"lo":3.08682,"t":"p","s":"v","i":110.3,"ef":122,"cl":6,"f":["CANT"],"q_ips":87.6,"q_n":4,"px":1080},{"id":"0596616W","n":"Ecole primaire privée Saint Christophe","c":"Marcq-en-Baroeul","a":"28 rue Bouret","la":50.66069,"lo":3.10476,"t":"p","s":"v","ef":626,"cl":22,"f":["CANT"],"px":1680},{"id":"0593913H","n":"Ecole primaire privée Saint Honoré - La Treille","c":"Mons-en-Baroeul","a":"20 rue Florimond Delemer","la":50.64482,"lo":3.10335,"t":"p","s":"v","ef":273,"cl":11,"f":["CANT"]},{"id":"0593973Y","n":"Ecole primaire privée Saint Jean","c":"Lille","a":"22 bis rue de l'Eglise","la":50.63166,"lo":3.00647,"t":"p","s":"v","i":111.7,"ef":207,"cl":8,"f":["CANT"],"q_ips":90.4,"q_n":2,"px":1020},{"id":"0593830T","n":"Ecole primaire privée Saint Joseph","c":"Lille","a":"2 rue de la Marbrerie","la":50.63232,"lo":3.09834,"t":"p","s":"v","i":98.5,"ef":55,"cl":4,"f":["CANT"],"q_ips":89.3,"q_n":3,"px":1080},{"id":"0593946U","n":"Ecole primaire privée Saint Louis","c":"Lille","a":"10  RUE BROCA","la":50.62494,"lo":3.09019,"t":"p","s":"v","i":118.8,"ef":106,"cl":5,"f":["CANT"],"px":1200},{"id":"0593817D","n":"Ecole primaire privée Saint Nicolas","c":"Lambersart","a":"28 rue de la Carnoy","la":50.65073,"lo":3.02164,"t":"p","s":"v","i":133.4,"ef":484,"cl":18,"f":["CANT"],"q_ips":131.9,"q_n":2,"px":1200},{"id":"0593828R","n":"Ecole primaire privée Saint Paul","c":"Lille","a":"25 bis rue Colbert","la":50.62823,"lo":3.04924,"t":"p","s":"v","i":146.8,"ef":473,"cl":17,"f":["CANT"],"q_ips":122.2,"q_n":6,"px":1560},{"id":"0596461C","n":"Ecole primaire privée Saint Sauveur et Saint Eubert","c":"Lille","a":"1  RUE CHARLES DEBIERRE","la":50.63203,"lo":3.07307,"t":"p","s":"v","i":124.4,"ef":273,"cl":11,"f":["CANT"],"q_ips":103.5,"q_n":4,"px":1200},{"id":"0596116C","n":"Ecole primaire privée Saint Vincent de Paul","c":"Lille","a":"28 rue de Fontenoy","la":50.62135,"lo":3.06812,"t":"p","s":"v","i":97.7,"ef":150,"cl":6,"q_ips":82.3,"q_n":3,"px":960},{"id":"0593893L","n":"Ecole primaire privée Sainte Anne","c":"Lille","a":"32 rue Pierre Curie","la":50.64783,"lo":2.98844,"t":"p","s":"v","i":126.1,"ef":265,"cl":11,"f":["CANT"],"q_ips":90.2,"q_n":3,"px":1320},{"id":"0593968T","n":"Ecole primaire privée Sainte Anne-Saint Joachim","c":"Lille","a":"198 rue du Bois","la":50.64959,"lo":3.09361,"t":"p","s":"v","i":133.4,"ef":275,"cl":10,"f":["CANT"],"q_ips":128.8,"q_n":1,"px":1440},{"id":"0593829S","n":"Ecole primaire privée Sainte Elisabeth","c":"Lille","a":"102 rue DU FAUBOURG DE BETHUNE","la":50.61747,"lo":3.02424,"t":"p","s":"v","i":101.4,"ef":251,"cl":9,"f":["CANT"],"q_ips":89.4,"q_n":2,"px":960},{"id":"0593978D","n":"Ecole primaire privée Sainte Geneviève","c":"La Madeleine","a":"193 avenue de la République","la":50.64958,"lo":3.07859,"t":"p","s":"v","i":140.6,"ef":238,"cl":9,"f":["CANT"],"q_ips":135.2,"q_n":1,"px":1440},{"id":"0593819F","n":"Ecole primaire privée Sainte Odile","c":"Lambersart","a":"244 avenue de Dunkerque","la":50.63751,"lo":3.02707,"t":"p","s":"v","i":132,"ef":626,"cl":23,"f":["CANT"],"q_ips":129.2,"q_n":3,"px":1200},{"id":"0593954C","n":"Ecole primaire privée Sainte Thérèse","c":"Lille","a":"268 rue Léon Gambetta","la":50.62816,"lo":3.0512,"t":"p","s":"v","i":101.7,"ef":233,"cl":11,"f":["ULIS","CANT"],"q_ips":139.9,"q_n":5,"px":1080},{"id":"0593964N","n":"Ecole primaire privée Thérèse d'Avila","c":"Lille","a":"124 boulevard Vauban","la":50.62987,"lo":3.04362,"t":"p","s":"v","i":141.9,"ef":540,"cl":21,"f":["CANT"],"q_ips":125.9,"q_n":7,"px":1680},{"id":"0597183M","n":"Ecole primaire privée hors contrat Arborescences de LILLE - Ecole primaire","c":"Lille","a":"6 rue Lamartine","la":50.62208,"lo":3.064,"t":"p","s":"v","i":83.7,"q_ips":83.7,"q_n":5,"i_proxy":true,"i_source":"quartier (5 écoles)","sp":["HC"]},{"id":"0596640X","n":"Ecole primaire publique Anatole France - La Bruyère","c":"Faches-Thumesnil","a":"Rue Anatole France","la":50.60097,"lo":3.06429,"t":"p","s":"u","i":99.4,"ef":256,"cl":11,"f":["CANT"],"cs":{"n":"Collège Jean Zay","i":86.9}},{"id":"0591613H","n":"Ecole régionale du premier degré Ernest Couteaux","c":"Lille","a":"6 rue Saint Bernard","la":50.62106,"lo":3.04145,"t":"p","s":"u","i":77.3,"ef":70,"cl":6,"f":["CANT"],"q_ips":91.6,"q_n":5,"cs":{"n":"Collège Nina Simone","i":79.2}},{"id":"0591579W","n":"Ecole élémentaire Arthur Cornette","c":"Lille","a":"18 rue Eugène Jacquet","la":50.63744,"lo":3.08164,"t":"p","s":"u","i":83.9,"ef":105,"cl":6,"f":["ULIS","CANT"],"q_ips":90.9,"q_n":4,"cs":{"n":"Collège Martha Desrumaux","i":85,"va":-3,"br":76}},{"id":"0591874S","n":"Groupe scolaire Guynemer-Rollin","c":"Mons-en-Baroeul","a":"9 rue Mirabeau","la":50.64238,"lo":3.09869,"t":"p","s":"u","ef":165,"cl":7,"f":["CANT"],"cs":{"n":"Collège Charles Baudelaire (0595167W)","ext":true},"i":105.6,"i_source_2020":true,"i_proxy":true,"i_source":"IPS 2020"},{"id":"0593543F","n":"Groupe scolaire Joséphine Baker","c":"Marcq-en-Baroeul","a":"1  RUE AUGUSTIN BOURDON","la":50.66591,"lo":3.0721,"t":"p","s":"u","ef":205,"cl":10,"f":["CANT"],"i":103,"i_source_2020":true,"i_proxy":true,"i_source":"IPS 2020","cs":{"n":"Collège Du Lazaro","i":117.3,"va":-9,"br":79}},{"id":"0590122M","n":"Lycée Valentine Labbé","c":"La Madeleine","a":"41 rue Paul Doumer","la":50.64763,"lo":3.07229,"t":"l","s":"u","i":91.5,"ie":28.6,"iv":{"bac":88,"va_bac":-2,"presents":272,"men":43,"va_men":2,"tb":2,"b":6,"ab":25,"acc2":74,"va_acc":-5},"lt":"LPO","igt":92.1,"ipro":85.7,"ef":660},{"id":"0593015G","n":"Lycée professionnel Camille de Lellis","c":"Lambersart","a":"1 E rue de Verlinghem","la":50.65389,"lo":3.02455,"t":"l","s":"v","i":95,"iv":{"bac":89,"va_bac":-1,"presents":79,"men":67,"va_men":7,"tb":6,"b":18,"ab":29,"acc2":38,"va_acc":-28},"lt":"LP","ipro":94.4,"ef":252,"px":1440},{"id":"0593106F","n":"Lycée Sainte-Odile","c":"Lambersart","a":"244 avenue de Dunkerque","la":50.63813,"lo":3.02685,"t":"l","s":"v","i":135.4,"iv":{"bac":99,"va_bac":1,"presents":153,"men":81,"va_men":13,"tb":38,"b":44,"ab":42,"acc2":88,"va_acc":1},"lt":"LEGT","igt":135.3,"ef":459,"px":2620},{"id":"0590110Z","n":"Lycée Jean Perrin","c":"Lambersart","a":"2 avenue Andreï Sakharov","la":50.64759,"lo":3.03915,"t":"l","s":"u","i":116.1,"iv":{"bac":97,"va_bac":1,"presents":298,"men":69,"va_men":4,"tb":50,"b":68,"ab":64,"acc2":81,"va_acc":-5},"lt":"LEGT","igt":119.2,"ef":839},{"id":"0593030Y","n":"Lycée professionnel Notre-Dame du Sacré-Cœur","c":"Loos","a":"6 rue du Maréchal Joffre","la":50.61789,"lo":3.00547,"t":"l","s":"v","i":102.9,"iv":{"bac":97,"va_bac":5,"presents":59,"men":63,"va_men":-2,"tb":2,"b":7,"ab":28,"acc2":68,"va_acc":-3},"lt":"LP","ipro":102.3,"ef":222,"px":1320},{"id":"0595657D","n":"Lycée Saint-Vincent de Paul","c":"Loos","a":"6 rue du Maréchal Joffre","la":50.61772,"lo":3.00541,"t":"l","s":"v","i":116.3,"iv":{"bac":97,"va_bac":1,"presents":188,"men":62,"va_men":3,"tb":4,"b":16,"ab":31,"acc2":76,"va_acc":-10},"lt":"LPO","igt":119.5,"ipro":105.5,"ef":613,"px":1560},{"id":"0590133Z","n":"Lycée professionnel Maurice Duhamel","c":"Loos","a":"1079 rue Guy Môcquet","la":50.60228,"lo":3.01141,"t":"l","s":"u","i":81.3,"iv":{"bac":73,"va_bac":-5,"presents":60,"men":45,"va_men":6,"b":8,"ab":19,"acc2":31,"va_acc":-22},"lt":"LP","ipro":81.4,"ef":185},{"id":"0590117G","n":"Lycée Louis Pasteur","c":"Lille","a":"1 rue des Urbanistes","la":50.64278,"lo":3.07014,"t":"l","s":"u","i":117,"iv":{"bac":96,"va_bac":0,"presents":358,"men":67,"va_men":7,"tb":52,"b":69,"ab":73,"acc2":81,"va_acc":-3},"lt":"LEGT","igt":119.9,"ef":1091},{"id":"0590121L","n":"Lycée César Baggio","c":"Lille","a":"332 boulevard d’Alsace","la":50.61705,"lo":3.06831,"t":"l","s":"u","i":95.8,"iv":{"bac":88,"va_bac":6,"presents":236,"men":33,"va_men":6,"tb":9,"b":6,"ab":18,"acc2":66,"va_acc":-3},"lt":"LEGT","igt":90.1,"ef":761,"sp":["STI2D"]},{"id":"0592922F","n":"Lycée Thérèse d’Avila","c":"Lille","a":"254 rue Nationale","la":50.63094,"lo":3.04793,"t":"l","s":"v","i":142.6,"iv":{"bac":100,"va_bac":0,"presents":208,"men":91,"va_men":2,"tb":65,"b":83,"ab":42,"acc2":84,"va_acc":-7},"lt":"LEGT","igt":142.6,"ef":685,"sp":["Intl"],"px":2400},{"id":"0596957S","n":"Lycée professionnel Aimé Césaire","c":"Lille","a":"115 rue Francisco Ferrer","la":50.63091,"lo":3.09244,"t":"l","s":"u","i":76.2,"iv":{"bac":81,"va_bac":9,"presents":136,"men":55,"va_men":18,"tb":9,"b":23,"ab":42,"acc2":46,"va_acc":-4},"lt":"LP","ipro":75.6,"ef":456},{"id":"0590111A","n":"Lycée professionnel Sonia Delaunay","c":"Lille","a":"121 rue de la Mitterie","la":50.6491,"lo":2.99653,"t":"l","s":"u","i":78.4,"iv":{"bac":77,"va_bac":-1,"presents":124,"men":48,"va_men":3,"tb":9,"b":18,"ab":32,"acc2":29,"va_acc":-26},"lt":"LP","ipro":78.6,"ef":414},{"id":"0590258K","n":"Lycée Gaston Berger","c":"Lille","a":"Avenue Gaston Berger","la":50.61374,"lo":3.07582,"t":"l","s":"u","i":103.1,"lt":"LEGT","igt":87.6,"ef":738,"iv":{"bac":90,"va_bac":1,"presents":163,"men":48,"va_men":0,"tb":15,"b":28,"ab":36,"acc2":73,"va_acc":-5}},{"id":"0593007Y","n":"Lycée Ozanam","c":"Lille","a":"50 rue Saint-Gabriel","la":50.63953,"lo":3.08672,"t":"l","s":"v","i":139.3,"iv":{"bac":96,"va_bac":-1,"presents":262,"men":53,"va_men":-10,"tb":24,"b":33,"ab":51,"acc2":84,"va_acc":-1},"lt":"LEGT","igt":138.1,"ef":878,"sp":["BTS"],"px":2400},{"id":"0593109J","n":"Lycée Notre-Dame de la Paix","c":"Lille","a":"14 place du Concert","la":50.6429,"lo":3.06211,"t":"l","s":"v","i":141.4,"iv":{"bac":100,"va_bac":1,"presents":100,"men":79,"va_men":1,"tb":16,"b":29,"ab":34,"acc2":75,"va_acc":-14},"lt":"LEGT","igt":139.4,"ef":363,"px":2200},{"id":"0593114P","n":"Lycée Saint-Paul","c":"Lille","a":"62 rue Royale","la":50.62796,"lo":3.04857,"t":"l","s":"v","i":152.6,"iv":{"bac":100,"va_bac":0,"presents":334,"men":92,"va_men":3,"tb":103,"b":113,"ab":91,"acc2":93,"va_acc":2},"lt":"LEGT","igt":151.6,"ef":995,"sp":["CPGE"],"px":2800},{"id":"0590116F","n":"Lycée Fénelon","c":"Lille","a":"27 rue Alexandre Leleux","la":50.63162,"lo":3.05765,"t":"l","s":"u","i":114.3,"iv":{"bac":92,"va_bac":-3,"presents":185,"men":64,"va_men":7,"tb":28,"b":34,"ab":57,"acc2":78,"va_acc":-6},"lt":"LEGT","igt":114.3,"ef":643},{"id":"0590266U","n":"Lycée professionnel César Baggio","c":"Lille","a":"332 boulevard d’Alsace","la":50.61713,"lo":3.0663,"t":"l","s":"u","i":82.7,"iv":{"bac":75,"va_bac":-1,"presents":112,"men":41,"va_men":-2,"tb":5,"b":15,"ab":25,"acc2":53,"va_acc":2},"lt":"LP","ipro":83.3,"ef":541},{"id":"0593006X","n":"Lycée Notre-Dame d’Annay","c":"Lille","a":"15 place du Concert","la":50.64246,"lo":3.06005,"t":"l","s":"v","i":120.9,"iv":{"bac":97,"va_bac":0,"presents":155,"men":57,"va_men":0,"acc2":86,"va_acc":4},"lt":"LPO","igt":127.3,"ipro":110.8,"ef":324,"px":2100},{"id":"0593113N","n":"Lycée Sainte-Claire","c":"Lille","a":"8 rue des Augustins","la":50.63446,"lo":3.06902,"t":"l","s":"v","i":116.3,"iv":{"bac":100,"va_bac":2,"presents":68,"men":76,"va_men":2,"tb":13,"b":11,"ab":28,"acc2":65,"va_acc":-21},"lt":"LEGT","igt":116.3,"ef":138,"px":1800},{"id":"0593117T","n":"Lycée La Salle","c":"Lille","a":"2 rue Jean Levasseur","la":50.62863,"lo":3.04081,"t":"l","s":"v","i":134.6,"iv":{"bac":99,"va_bac":1,"presents":257,"men":71,"va_men":4,"tb":19,"b":41,"ab":46,"acc2":89,"va_acc":2},"lt":"LPO","igt":136.1,"ipro":122.5,"ef":844,"px":1980},{"id":"0595786U","n":"Lycée Jean Prouvé","c":"Lille","a":"2 rue de Lompret","la":50.65013,"lo":2.99877,"t":"l","s":"u","i":105.6,"iv":{"bac":87,"va_bac":-5,"presents":71,"men":49,"va_men":0,"tb":4,"b":9,"ab":11,"acc2":79,"va_acc":0},"lt":"LEGT","igt":100.7,"ef":308},{"id":"0590119J","n":"Lycée Faidherbe","c":"Lille","a":"9 rue Armand Carrel","la":50.61476,"lo":3.0777,"t":"l","s":"u","i":128.7,"iv":{"bac":98,"va_bac":1,"presents":376,"men":71,"va_men":2,"tb":67,"b":86,"ab":114,"acc2":87,"va_acc":0},"lt":"LEGT","igt":118.1,"ef":1197,"sp":["CPGE"]},{"id":"0590125R","n":"Lycée hôtelier international de Lille","c":"Lille","a":"31 passage de l’Internationale","la":50.62849,"lo":3.09306,"t":"l","s":"u","i":100,"iv":{"bac":77,"va_bac":-12,"presents":99,"men":52,"va_men":-8,"tb":2,"b":24,"ab":25,"acc2":61,"va_acc":-7},"lt":"LP","igt":120.7,"ipro":96.6,"ef":400,"sp":["Hôtellerie"]},{"id":"0593027V","n":"Lycée numérique des métiers","c":"Lille","a":"82 rue des Meuniers","la":50.62226,"lo":3.05739,"t":"l","s":"v","i":119.1,"iv":{"bac":81,"va_bac":-9,"presents":80,"men":59,"va_men":-3,"tb":9,"b":19,"ab":19,"acc2":63,"va_acc":-7},"lt":"LP","ipro":116.3,"ef":256,"px":1680},{"id":"0595867G","n":"Lycée international Montebello","c":"Lille","a":"196 boulevard Montebello","la":50.62012,"lo":3.04748,"t":"l","s":"u","i":106.5,"iv":{"bac":96,"va_bac":2,"presents":429,"men":66,"va_men":8,"tb":77,"b":94,"ab":81,"acc2":81,"va_acc":-2},"lt":"LEGT","igt":107.4,"ef":1323,"sp":["Intl"]}];

const TL = {m:"Maternelle",e:"Élémentaire",p:"Primaire",c:"Collège",l:"Lycée"};
const TC = {m:"#9b59b6",e:"#3498db",p:"#27ae60",c:"#e67e22",l:"#e74c3c"};
const TE = {m:"🎒",e:"📚",p:"🏫",c:"🎓",l:"🏛️"};
const SL = {u:"Public",v:"Privé"};

function ipsColor(v){if(!v)return"#ccc";if(v>=125)return"#1B4F72";if(v>=110)return"#2874A6";if(v>=100)return"#5DADE2";if(v>=85)return"#E67E22";return"#D35400"}
function ipsLabel(v){if(!v)return"";if(v>=125)return"Très favorisé";if(v>=110)return"Favorisé";if(v>=100)return"Mixte";if(v>=85)return"Populaire";return"Très populaire"}
function vaColor(v){if(v==null)return"#ccc";if(v>=5)return"#27ae60";if(v>=0)return"#2ecc71";if(v>=-5)return"#f39c12";return"#e74c3c"}
function vaLabel(v){if(v==null)return"";if(v>=5)return"Très bon";if(v>=1)return"Bon";if(v>=-1)return"Dans la moyenne";if(v>=-5)return"En dessous";return"Faible"}
function vaSign(v){return v>0?"+"+v:String(v)}
function shortName(n){return n.replace(/^(Ecole |École |Collège |Lycée |Centre scolaire )(élémentaire |primaire |maternelle |professionnel |d.application |publique |privée? |privee |prive |Saint-|Sainte-)?/gi,"").replace(/^(d.application |publique |professionnel |hôtelier |international )/i,"").substring(0,30)}

const HELP = {
  ips: {t:"IPS — Indice de Position Sociale",d:"L'IPS est un indicateur du Ministère de l'Éducation qui résume le profil socio-économique des familles d'une école. Il est calculé à partir des professions des deux parents. Plus il est élevé, plus les élèves viennent en moyenne de milieux favorisés.\n\nMoyenne nationale : 103. En dessous de 85 : milieu défavorisé. Au-dessus de 125 : milieu très favorisé.\n\n⚠️ Un IPS élevé ne signifie pas que l'école est « meilleure ». Il décrit le profil social, pas la qualité de l'enseignement.\n\nSource : DEPP (Direction de l'évaluation, de la prospective et de la performance), Ministère de l'Éducation nationale — data.education.gouv.fr"},
  ips_est: {t:"IPS estimé — pourquoi ≈ ?",d:"L'IPS officiel n'existe que pour les écoles ayant des élèves de CM2 (c'est à partir de leur passage en 6ème que les professions des parents sont enregistrées). Les maternelles et certaines petites écoles n'ont donc pas d'IPS.\n\nPour ces écoles, nous affichons un IPS estimé (≈) basé sur l'école élémentaire publique la plus proche (même secteur, moins de 600m). En général, les mêmes familles fréquentent les deux écoles.\n\nLe contour en pointillé et le symbole ≈ distinguent toujours une estimation d'une donnée officielle."},
  va: {t:"Valeur ajoutée — qu'est-ce que c'est ?",d:"La valeur ajoutée est l'indicateur le plus fiable pour évaluer ce qu'un collège apporte réellement à ses élèves.\n\nLe Ministère compare le taux de réussite au brevet d'un collège à celui qu'on attendrait, compte tenu du profil de ses élèves (âge, sexe, origine sociale, niveau scolaire à l'entrée en 6ème). La différence est la valeur ajoutée.\n\n• VA positive (+6 par exemple) : le collège obtient de meilleurs résultats que des collèges comparables. Il fait progresser ses élèves au-delà de ce que leur profil laissait prévoir.\n• VA négative (-5 par exemple) : le collège fait moins bien que ce qu'on attendrait.\n• VA proche de 0 : résultats conformes aux attentes.\n\nUn collège avec un IPS faible mais une VA positive est un collège qui travaille bien. L'inverse (IPS élevé, VA négative) indique un collège qui « vit sur sa rente » sociale.\n\nSource : DEPP, indicateurs IVAC — data.education.gouv.fr"},
  eval: {t:"Évaluations nationales de 6ème",d:"Chaque année en septembre, tous les élèves entrant en 6ème passent des tests standardisés en français et en mathématiques, organisés par le Ministère.\n\nLe score est standardisé : la moyenne nationale est d'environ 250. Il n'y a pas de maximum fixe — les meilleurs établissements peuvent dépasser 300.\n\nLe « % d'élèves dans le groupe le plus avancé » indique la part d'élèves ayant obtenu les meilleurs résultats. Plus ce pourcentage est élevé, plus le collège accueille d'élèves performants à leur entrée.\n\n⚠️ Ces scores mesurent le niveau des élèves à l'entrée, pas ce que le collège leur apporte ensuite. Pour cela, regardez la valeur ajoutée.\n\nSource : DEPP, évaluations exhaustives — data.education.gouv.fr"},
  brevet: {t:"Résultats du Brevet (DNB)",d:"Le Diplôme National du Brevet est l'examen passé en fin de 3ème par tous les collégiens.\n\n• Taux de réussite : % d'élèves qui obtiennent le brevet.\n• Note à l'écrit : moyenne des épreuves écrites sur 20.\n• Parcours complet 6ᵉ→3ᵉ : % des élèves entrés en 6ème qui sont allés jusqu'en 3ème dans ce collège (un chiffre bas peut indiquer des départs en cours de route).\n• Mentions Très Bien : nombre d'élèves ayant eu 16/20 ou plus de moyenne.\n\nSource : DEPP, indicateurs IVAC — data.education.gouv.fr"},
  secteur: {t:"Collège de secteur — carte scolaire",d:"En France, chaque adresse est rattachée à un collège public par la « carte scolaire », fixée par le Département (Conseil départemental du Nord pour Lille).\n\nVotre enfant sera automatiquement affecté à ce collège à la fin du CM2, sauf si vous demandez une dérogation ou choisissez un collège privé.\n\nLes dérogations sont possibles pour : handicap, raison médicale, boursier, fratrie déjà dans le collège, proximité du domicile, parcours scolaire particulier (CHAM, section internationale, section sportive).\n\n⚠️ Le collège de secteur affiché ici est basé sur l'adresse de l'école, pas sur votre adresse personnelle. Vérifiez toujours sur services.lenord.fr.\n\nSource : carte scolaire Affelnet, Département du Nord"},
  rep: {t:"REP / REP+ — Éducation Prioritaire",d:"Les Réseaux d'Éducation Prioritaire regroupent les écoles et collèges situés dans des quartiers défavorisés. Ils bénéficient de moyens renforcés :\n\n• Classes plus petites (souvent 12-15 élèves en CP/CE1)\n• Plus d'enseignants et de personnels\n• Accompagnement éducatif renforcé\n• Formation continue des enseignants\n\nREP+ est le niveau le plus renforcé.\n\nSource : Ministère de l'Éducation nationale"},
  ulis: {t:"ULIS — Inclusion scolaire",d:"Une Unité Localisée pour l'Inclusion Scolaire (ULIS) est un dispositif qui accueille, au sein d'une école ordinaire, des élèves en situation de handicap. Les élèves ULIS suivent les cours dans leur classe de référence et bénéficient de temps d'enseignement adapté.\n\nLa présence d'un dispositif ULIS dans une école est un signe d'inclusivité.\n\nSource : annuaire de l'Éducation nationale"},
  appli: {t:"École d'application",d:"Une école d'application accueille des enseignants stagiaires en formation (rattachés à l'INSPÉ, ex-IUFM). L'école est dirigée par un « maître formateur » certifié.\n\nPour les parents, c'est un signal positif : l'équipe pédagogique est soumise à un regard extérieur permanent, les pratiques sont actualisées, et l'encadrement est renforcé par la présence régulière de formateurs.\n\nSource : annuaire de l'Éducation nationale"},
  prix: {t:"Frais de scolarité (privé)",d:"Les écoles privées sous contrat avec l'État facturent une contribution aux familles. Les enseignants sont payés par l'État, mais les frais couvrent l'entretien des locaux, le personnel non enseignant et les activités.\n\nLe prix affiché est la scolarité annuelle seule (hors cantine, garderie, sorties, fournitures). Il varie selon les écoles et les niveaux.\n\nLes écoles publiques sont gratuites (seuls la cantine et le périscolaire sont payants).\n\nSource : sites web des écoles privées, mars 2026"},
  bac: {t:"Résultats du Baccalauréat (IVAL)",d:"Le Ministère publie chaque année les indicateurs de valeur ajoutée des lycées (IVAL), qui évaluent l'action propre de chaque lycée.\n\n• Taux de réussite : % d'élèves qui obtiennent le bac.\n• Taux de mentions : % de bacheliers ayant obtenu une mention (AB, B ou TB).\n• Parcours 2nde→Bac : % des élèves entrés en 2nde qui obtiennent le bac dans ce lycée. C'est un indicateur clé de l'accompagnement — un lycée qui perd beaucoup d'élèves en cours de route a un taux bas.\n\nChaque indicateur a sa propre valeur ajoutée (VA), qui compare les résultats observés à ceux attendus compte tenu du profil social et scolaire des élèves.\n\nUn lycée avec un IPS moyen mais une VA positive fait bien son travail. L'inverse (IPS élevé, VA négative) indique un lycée qui ne capitalise pas sur le profil favorable de ses élèves.\n\nSource : DEPP, indicateurs IVAL — data.education.gouv.fr, session 2024."},
  lyctype: {t:"LEGT, LP, LPO — Types de lycées",d:"Le système français distingue trois types de lycées :\n\n• LEGT (Lycée d'Enseignement Général et Technologique) : prépare au bac général et technologique. C'est le parcours classique vers les études supérieures longues.\n• LP (Lycée Professionnel) : prépare au bac professionnel et aux CAP. Enseignement concret, stages en entreprise, insertion professionnelle directe ou poursuite en BTS.\n• LPO (Lycée Polyvalent) : combine les deux — propose à la fois des filières générales/technologiques et professionnelles sous le même toit.\n\nL'IPS des trois voies diffère souvent au sein du même lycée polyvalent : la voie GT a en général un IPS plus élevé que la voie Pro.\n\nSource : annuaire de l'Éducation nationale."},
  mentions: {t:"Mentions au Bac — Très Bien, Bien, Assez Bien",d:"Au baccalauréat, les mentions sont attribuées selon la moyenne générale :\n\n• Très Bien (TB) : 16/20 et plus\n• Bien (B) : 14 à 16/20\n• Assez Bien (AB) : 12 à 14/20\n\nLe taux de mentions d'un lycée est le % de bacheliers ayant obtenu au moins AB. La VA mentions compare ce taux à celui attendu : un lycée avec VA mentions positive pousse ses élèves vers les mentions mieux que des lycées comparables.\n\nUn lycée avec 92% de mentions et VA +3 fait un travail remarquable. Un lycée avec 92% mais VA -5 a simplement un public très favorisé qui aurait eu ces mentions partout.\n\nSource : DEPP, IVAL session 2024."},
  cham: {t:"CHAM — Musique et Danse",d:"Les Classes à Horaires Aménagés Musique ou Danse (CHAM/CHAD) permettent aux élèves de suivre un cursus musical ou chorégraphique au Conservatoire tout en poursuivant leur scolarité.\n\nC'est aussi un motif de dérogation à la carte scolaire : un enfant peut intégrer un collège CHAM même s'il n'est pas dans son secteur.\n\nConditions : être inscrit au Conservatoire, passer un examen d'entrée (épreuve de formation musicale + instrument).\n\nSource : annuaire de l'Éducation nationale, Conservatoire de Lille"},
};

function InfoBubble({topic}) {
  const [open, setOpen] = useState(false);
  const info = HELP[topic];
  if (!info) return null;
  return (
    <span className="relative inline-block align-middle">
      <button onClick={e=>{e.stopPropagation();setOpen(!open)}} className="hover:opacity-70 transition-opacity" style={{fontSize:10,cursor:"pointer",marginLeft:2,verticalAlign:"middle",lineHeight:1}}>ℹ️</button>
      {open && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center" style={{zIndex:10000}} onClick={()=>setOpen(false)}>
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="relative bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto animate-slideUp" onClick={e=>e.stopPropagation()}>
            <div className="sticky top-0 bg-white rounded-t-3xl sm:rounded-t-2xl px-5 pt-4 pb-2 border-b border-gray-100 flex justify-between items-start">
              <div className="font-bold text-gray-800" style={{fontSize:16,lineHeight:1.3}}>{info.t}</div>
              <button onClick={()=>setOpen(false)} className="text-gray-300 hover:text-gray-500 font-bold p-1" style={{fontSize:20,lineHeight:1}}>×</button>
            </div>
            <div className="px-5 py-4">
              {info.d.split("\n\n").map((para,i)=>(
                <p key={i} className="text-gray-600 mb-3" style={{fontSize:13,lineHeight:1.7}}>
                  {para.split("\n").map((line,j)=><span key={j}>{line}{j<para.split("\n").length-1&&<br/>}</span>)}
                </p>
              ))}
              {topic==="ips"&&<IpsScale/>}
            </div>
          </div>
        </div>
      )}
    </span>
  );
}

/* === IPS SCALE — interactive family profiles === */
function IpsScale() {
  const [activeZone, setActiveZone] = useState(null);
  const zones = [
    {min:55,max:80,color:"#D35400",label:"Très populaire",
      families:[
        {emoji:"👩‍👧",desc:"Parent seul, sans emploi",ips:"~62"},
        {emoji:"👨‍👩‍👧",desc:"Ouvrier non qualifié + sans activité professionnelle",ips:"~68"},
        {emoji:"👨‍👧",desc:"Parent seul, ouvrier qualifié",ips:"~74"},
      ]},
    {min:80,max:100,color:"#E67E22",label:"Populaire",
      families:[
        {emoji:"👨‍👩‍👧",desc:"Chauffeur-livreur + aide à domicile",ips:"~78"},
        {emoji:"👨‍👩‍👧",desc:"Ouvrier qualifié + employée de commerce",ips:"~85"},
        {emoji:"👩‍👧‍👦",desc:"Parent seul, employée administrative",ips:"~88"},
      ]},
    {min:100,max:110,color:"#5DADE2",label:"Mixte",
      families:[
        {emoji:"👨‍👩‍👧",desc:"Agent de maîtrise + aide-soignante",ips:"~98"},
        {emoji:"👨‍👩‍👧‍👦",desc:"Employé administratif + auxiliaire de puériculture",ips:"~95"},
        {emoji:"👨‍👩‍👧",desc:"Technicien + secrétaire médicale",ips:"~105"},
      ]},
    {min:110,max:125,color:"#2874A6",label:"Favorisé",
      families:[
        {emoji:"👩‍👧",desc:"Parent seul, cadre d'entreprise",ips:"~108"},
        {emoji:"👨‍👩‍👧",desc:"Professeur des écoles + comptable",ips:"~115"},
        {emoji:"👨‍👩‍👧‍👦",desc:"Cadre commercial + assistante de direction",ips:"~120"},
      ]},
    {min:125,max:160,color:"#1B4F72",label:"Très favorisé",
      families:[
        {emoji:"👨‍👩‍👧",desc:"Professeur agrégé + journaliste",ips:"~128"},
        {emoji:"👨‍👩‍👧‍👦",desc:"Ingénieur + médecin",ips:"~138"},
        {emoji:"👨‍👩‍👧",desc:"Avocat + cadre dirigeant",ips:"~148"},
      ]},
  ];
  const W=280;
  return(
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="font-extrabold text-gray-700 mb-2" style={{fontSize:13}}>À quoi correspond concrètement l'IPS ?</div>
      <p className="text-gray-500 mb-3" style={{fontSize:11,lineHeight:1.5}}>L'IPS d'une école est la moyenne des IPS individuels de ses élèves. L'IPS de chaque élève dépend des métiers de ses deux parents. Voici des exemples concrets :</p>
      
      {/* Gradient bar */}
      <div style={{position:"relative",height:32,borderRadius:16,overflow:"hidden",display:"flex",marginBottom:4}}>
        {zones.map((z,i)=>(
          <div key={i} onClick={()=>setActiveZone(activeZone===i?null:i)}
            style={{flex:(z.max-z.min),background:z.color,cursor:"pointer",opacity:activeZone!=null&&activeZone!==i?.4:1,transition:"opacity .2s",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:"white",fontSize:9,fontWeight:800,textShadow:"0 1px 2px rgba(0,0,0,.3)",letterSpacing:.5}}>{z.label}</span>
          </div>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#bbb",padding:"0 2px",marginBottom:12}}>
        <span>60</span><span>80</span><span>100</span><span>110</span><span>125</span><span>155</span>
      </div>
      <p className="text-center text-gray-400 mb-3" style={{fontSize:10}}>👆 Touchez une zone pour voir des exemples de familles</p>
      
      {/* Family profiles */}
      {activeZone!=null && (
        <div className="rounded-2xl p-3 mb-2 animate-slideUp" style={{background:zones[activeZone].color+"10",border:"1px solid "+zones[activeZone].color+"25"}}>
          <div className="font-extrabold mb-2" style={{color:zones[activeZone].color,fontSize:12}}>
            Zone « {zones[activeZone].label} » — IPS {zones[activeZone].min} à {zones[activeZone].max}
          </div>
          <div className="space-y-2">
            {zones[activeZone].families.map((f,i)=>(
              <div key={i} className="flex items-start gap-2 bg-white rounded-xl p-2.5" style={{border:"1px solid "+zones[activeZone].color+"15"}}>
                <span style={{fontSize:20,lineHeight:1}}>{f.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-gray-700 font-semibold" style={{fontSize:11,lineHeight:1.4}}>{f.desc}</div>
                  <div className="font-bold mt-0.5" style={{color:zones[activeZone].color,fontSize:11}}>IPS {f.ips}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="bg-amber-50 rounded-xl p-2.5 mt-2" style={{fontSize:10,color:"#92640a",lineHeight:1.5}}>
        <strong>⚠️ Rappel :</strong> L'IPS décrit le public d'une école, pas sa qualité. Un collège avec un IPS de 80 et une plus-value de +8 fait <em>mieux progresser</em> ses élèves qu'un collège à IPS 130 avec une plus-value de -3.
      </div>
    </div>
  );
}

/* === MINI MAP (Leaflet) === */
function MiniMap({schools, selected, onSelect}) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const selectedRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    
    const map = L.map(mapRef.current, {zoomControl:true, scrollWheelZoom:true}).setView([50.633, 3.063], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://openstreetmap.org">OSM</a> · QuelleEcole.fr',
      maxZoom: 18
    }).addTo(map);
    mapInstance.current = map;
    return () => { map.remove(); mapInstance.current = null; };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    schools.forEach(s => {
      if (!s.la || !s.lo) return;
      const isSel = selected && selected.id === s.id;
      const r = isSel ? 10 : 7;
      const marker = L.circleMarker([s.la, s.lo], {
        radius: r,
        fillColor: ipsColor(s.i),
        color: isSel ? "#1B4F72" : "white",
        weight: isSel ? 3 : 1.5,
        opacity: 1,
        fillOpacity: s.i_proxy ? 0.5 : 0.85,
        dashArray: s.i_proxy ? "3,2" : undefined
      }).addTo(map);
      const tip = `<div style="font-family:system-ui;min-width:180px">
        <strong style="font-size:13px">${shortName(s.n)}</strong><br/>
        <span style="font-size:11px;color:#888">${TL[s.t]} ${SL[s.s]} · ${s.c}${s.i ? " · IPS "+s.i : ""}</span>
        ${s.ef ? '<br/><span style="font-size:11px">'+s.ef+' élèves</span>' : ''}
        ${s.iv&&(s.iv.va_brevet!=null||s.iv.va_bac!=null) ? '<br/><span style="font-size:11px;color:#1B4F72;font-weight:600">Plus-value '+vaSign(s.iv.va_brevet||s.iv.va_bac)+'</span>' : ''}
        ${s.cs&&s.t!=="c" ? '<br/><span style="font-size:11px;color:#1B4F72">→ '+s.cs.n+'</span>' : ''}
      </div>`;
      marker.bindTooltip(tip, {direction:"top",offset:[0,-8]});
      marker.on("click", () => onSelect(s));
      markersRef.current.push(marker);
    });
  }, [schools, selected, onSelect]);

  useEffect(() => {
    if (selected && mapInstance.current) {
      mapInstance.current.panTo([selected.la, selected.lo], {animate:true});
    }
  }, [selected]);

  return (
    <div style={{position:"relative",borderRadius:20,overflow:"hidden",border:"1px solid #e8e5e0",boxShadow:"0 2px 12px rgba(0,0,0,.04)"}}>
      <div ref={mapRef} style={{width:"100%",height:480}}></div>
      <div style={{position:"absolute",top:12,left:12,zIndex:1000,background:"rgba(255,255,255,.95)",borderRadius:12,padding:"8px 12px",boxShadow:"0 1px 6px rgba(0,0,0,.04)",fontSize:10,lineHeight:1.8}}>
        <div style={{fontWeight:800,fontSize:10,color:"#1B4F72",marginBottom:2,letterSpacing:.5,textTransform:"uppercase"}}>Milieu social</div>
        {[["#1B4F72","Très favorisé"],["#2874A6","Favorisé"],["#5DADE2","Mixte"],["#E67E22","Populaire"],["#D35400","Très populaire"]].map(([c,l])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{width:10,height:10,borderRadius:"50%",background:c,display:"inline-block",boxShadow:"0 0 0 1.5px white, 0 0 0 2px "+c+"30"}}></span>
            <span style={{color:"#666"}}>{l}</span>
          </div>))}
      </div>
    </div>
  );
}

/* === SCHOOL CARD === */
function Card({s, onCompare, compact, cmpHighlight}) {
  const [expanded, setExpanded] = useState(false);
  const va = s.iv ? (s.iv.va_brevet ?? s.iv.va_bac) : null;
  const ratio = s.ef && s.cl ? (s.ef/s.cl).toFixed(1) : null;
  const hasDetails = (s.t==="c"&&(s.ev||s.iv)) || (s.t==="l"&&s.iv);
  return (
    <div className={compact ? "bg-white rounded-2xl border border-gray-100 p-3 active:bg-gray-50 transition-colors" : "bg-white rounded-2xl border border-gray-100 p-4 sm:p-5"}>
      {/* ROW 1: badges + IPS circle */}
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span style={{fontSize:13}}>{TE[s.t]}</span>
            <span className="font-bold px-2 py-0.5 rounded-full" style={{background:TC[s.t]+"15",color:TC[s.t],fontSize:11}}>{TL[s.t]}</span>
            <span className="font-semibold px-2 py-0.5 rounded-full" style={{background:s.s==="u"?"#1B4F7210":"#E67E2215",color:s.s==="u"?"#1B4F72":"#c0702a",fontSize:11}}>{SL[s.s]}</span>
            {s.lt&&<span className="font-bold px-1.5 py-0.5 rounded-full bg-red-50 text-red-500" style={{fontSize:9}}>{s.lt}</span>}
          </div>
          <h3 className="font-extrabold text-gray-800 mt-1.5 leading-tight" style={{fontSize:compact?14:18}}>{s.n}</h3>
          <p className="text-gray-400 mt-0.5" style={{fontSize:12}}>{s.c}{!compact && s.a && <span className="text-gray-300"> · {s.a}</span>}</p>
        </div>
        {s.i && (
          <div className="text-center flex-shrink-0" style={{minWidth:compact?48:56}}>
            <div className="mx-auto flex items-center justify-center text-white font-extrabold rounded-full shadow-sm" style={{width:compact?42:52,height:compact?42:52,background:ipsColor(s.i),fontSize:compact?12:16,border:s.i_proxy?"2.5px dashed rgba(255,255,255,.5)":"none"}}>{s.i_proxy?"≈":""}{Math.round(s.i)}</div>
            <div className="mt-1 font-bold" style={{color:ipsColor(s.i),fontSize:9}}>{ipsLabel(s.i)}</div>
            {!compact && <div className="mt-1 mx-auto rounded-full overflow-hidden" style={{width:48,height:4,background:"#eee"}}>
              <div className="h-full rounded-full" style={{width:Math.max(4,Math.min(100,((s.i-55)/105)*100))+'%',background:ipsColor(s.i)}}></div>
            </div>}
            <div style={{fontSize:8,color:"#999"}}>milieu social <InfoBubble topic={s.i_proxy?"ips_est":"ips"}/></div>
          </div>
        )}
      </div>

      {/* COMPACT: key stats row */}
      {compact && (
        <div className="flex items-center gap-2 mt-2 flex-wrap" style={{fontSize:11,color:"#999"}}>
          {s.ef&&<span>{s.ef} él.</span>}
          {va!=null&&<span className="font-bold px-1.5 py-0.5 rounded-full text-white" style={{background:vaColor(va),fontSize:10}}>Plus-value {vaSign(va)}</span>}
          {s.px&&<span className="text-amber-600 font-semibold">{s.px}€/an</span>}
          {s.cs&&s.t!=="c"&&s.t!=="l"&&<span className="text-gray-400 truncate">→ {shortName(s.cs.n.replace(/\s*\([^)]+\)/,""))}</span>}
        </div>
      )}

      {/* FULL: Layer 1 — always visible */}
      {!compact && (<>
        {/* Badges row */}
        {(s.f||s.sp)&&<div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {s.f&&s.f.includes("REP")&&<span className="font-bold px-2 py-1 rounded-full bg-red-50 text-red-600" style={{fontSize:10}}>{s.f.includes("REP+")?'REP+':'REP'} <InfoBubble topic="rep"/></span>}
          {s.f&&s.f.includes("ULIS")&&<span className="px-2 py-1 rounded-full bg-teal-50 text-teal-600 font-medium" style={{fontSize:10}}>ULIS <InfoBubble topic="ulis"/></span>}
          {s.sp&&s.sp.includes("INSPE")&&<span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 font-semibold" style={{fontSize:10}}>🎓 Application <InfoBubble topic="appli"/></span>}
          {s.sp&&s.sp.includes("Montessori")&&<span className="px-2 py-1 rounded-full bg-green-50 text-green-600 font-semibold" style={{fontSize:10}}>🌿 Montessori</span>}
          {s.sp&&(s.sp.includes("Intl")||s.sp.includes("Cambridge")||s.sp.includes("Européenne"))&&<span className="px-2 py-1 rounded-full bg-purple-50 text-purple-600 font-semibold" style={{fontSize:10}}>🌍 International</span>}
          {s.sp&&s.sp.includes("CHAM")&&<span className="px-2 py-1 rounded-full bg-pink-50 text-pink-600 font-semibold" style={{fontSize:10}}>🎵 CHAM <InfoBubble topic="cham"/></span>}
          {s.sp&&s.sp.includes("CPGE")&&<span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold" style={{fontSize:10}}>📖 Prépas</span>}
          {s.sp&&s.sp.includes("HC")&&<span className="px-2 py-1 rounded-full bg-gray-100 text-gray-500 font-semibold" style={{fontSize:10}}>Hors contrat</span>}
          {s.px&&<span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 font-bold" style={{fontSize:10}}>~{s.px}€/an <InfoBubble topic="prix"/></span>}
        </div>}

        {/* Key numbers — always visible */}
        <div className="flex items-center gap-3 mt-3 flex-wrap" style={{fontSize:12,color:"#888"}}>
          {s.ef&&<span className="font-medium">{s.ef} élèves</span>}
          {s.cl&&<span>{s.cl} classes</span>}
          {ratio&&<span>{ratio} él./classe</span>}
          {va!=null&&<span className="font-bold px-2 py-0.5 rounded-full text-white" style={{background:vaColor(va),fontSize:11}}>Plus-value {vaSign(va)} <InfoBubble topic="va"/></span>}
        </div>

        {/* College de secteur — always visible */}
        {s.cs&&s.t!=="c"&&s.t!=="l"&&(
          <div className="mt-3 p-3 rounded-xl" style={{background:"#1B4F7208",fontSize:12}}>
            <div className="font-bold" style={{color:"#1B4F72",fontSize:11}}>🎓 Collège de secteur <InfoBubble topic="secteur"/></div>
            <div className="mt-1 font-bold text-gray-700">{s.cs.n.replace(/\s*\([^)]+\)/,"")}</div>
            {s.cs.ext ? (
              <div className="text-gray-400 mt-1" style={{fontSize:10}}>Collège hors périmètre — données non disponibles</div>
            ) : (
              <div className="flex gap-2 mt-1 flex-wrap" style={{fontSize:11}}>
                {s.cs.i&&<span style={{color:ipsColor(s.cs.i)}}>IPS {s.cs.i}</span>}
                {s.cs.va!=null&&<span style={{color:vaColor(s.cs.va)}}>Plus-value {vaSign(s.cs.va)}</span>}
                {s.cs.br&&<span className="text-gray-400">Brevet {s.cs.br}%</span>}
              </div>
            )}
          </div>
        )}

        {/* Layer 2 — expandable details */}
        {hasDetails && !expanded && (
          <button onClick={e=>{e.stopPropagation();setExpanded(true)}} className="mt-3 w-full py-2.5 rounded-xl text-center font-bold transition-colors hover:bg-gray-50 active:bg-gray-100" style={{fontSize:12,color:"#1B4F72",border:"1px dashed #1B4F7030"}}>
            {s.t==="c"?"📊 Voir brevet, évaluations, détails":"📊 Voir résultats bac, détails"} ↓
          </button>
        )}

        {expanded && (<>
          {/* Éval 6ème (collèges) */}
          {s.t==="c"&&s.ev&&(
            <div className="mt-3 p-3 rounded-xl bg-gray-50" style={{fontSize:12}}>
              <div className="font-bold text-gray-500 mb-2" style={{fontSize:11}}>📝 Niveau des élèves à l'entrée en 6ème ({s.ev_y}) <InfoBubble topic="eval"/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><div className="text-gray-400" style={{fontSize:10}}>Français</div><div className="font-extrabold text-gray-700" style={{fontSize:18}}>{s.ev.fr_s}</div><div className="text-gray-400" style={{fontSize:10}}>{s.ev.fr_st}% avancés</div></div>
                <div><div className="text-gray-400" style={{fontSize:10}}>Maths</div><div className="font-extrabold text-gray-700" style={{fontSize:18}}>{s.ev.ma_s}</div><div className="text-gray-400" style={{fontSize:10}}>{s.ev.ma_st}% avancés</div></div>
              </div>
            </div>
          )}

          {/* Brevet (collèges) */}
          {s.t==="c"&&s.iv&&(
            <div className="mt-2 p-3 rounded-xl bg-gray-50" style={{fontSize:12}}>
              <div className="font-bold text-gray-500 mb-2" style={{fontSize:11}}>🎯 Brevet des collèges — session {s.iv.session} <InfoBubble topic="brevet"/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><div className="text-gray-400" style={{fontSize:10}}>Réussite</div><div className="font-extrabold text-gray-700" style={{fontSize:18}}>{s.iv.brevet}%</div></div>
                <div><div className="text-gray-400" style={{fontSize:10}}>Plus-value</div><div className="font-extrabold" style={{fontSize:18,color:vaColor(s.iv.va_brevet)}}>{vaSign(s.iv.va_brevet)}</div></div>
              </div>
              <div className="flex gap-3 mt-2 pt-2 border-t border-gray-100 text-gray-500 flex-wrap" style={{fontSize:11}}>
                {s.iv.note_ecrit&&<span>Écrit {s.iv.note_ecrit}/20</span>}
                {s.iv.acces_6_3&&<span>Parcours 6ᵉ→3ᵉ : {s.iv.acces_6_3}%</span>}
                {s.iv.tb!=null&&<span>Mentions TB : {s.iv.tb}/{s.iv.cand}</span>}
              </div>
            </div>
          )}

          {/* Bac (lycées) */}
          {s.t==="l"&&s.iv&&(
            <div className="mt-2 p-3 rounded-xl bg-gray-50" style={{fontSize:12}}>
              <div className="font-bold text-gray-500 mb-2" style={{fontSize:11}}>🎓 Baccalauréat 2024 <InfoBubble topic="bac"/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><div className="text-gray-400" style={{fontSize:10}}>Réussite</div><div className="font-extrabold text-gray-700" style={{fontSize:18}}>{s.iv.bac}%</div></div>
                {s.iv.va_bac!=null&&<div><div className="text-gray-400" style={{fontSize:10}}>Plus-value réussite</div><div className="font-extrabold" style={{fontSize:18,color:vaColor(s.iv.va_bac)}}>{vaSign(s.iv.va_bac)}</div></div>}
              </div>
              {s.iv.men&&(
                <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-gray-100">
                  <div><div className="text-gray-400" style={{fontSize:10}}>Taux de mentions</div><div className="font-extrabold text-gray-700" style={{fontSize:16}}>{s.iv.men}%</div></div>
                  {s.iv.va_men!=null&&<div><div className="text-gray-400" style={{fontSize:10}}>Plus-value mentions</div><div className="font-extrabold" style={{fontSize:16,color:vaColor(s.iv.va_men)}}>{vaSign(s.iv.va_men)}</div></div>}
                </div>
              )}
              {(s.iv.tb>0||s.iv.b>0||s.iv.ab>0)&&(
                <div className="flex gap-3 mt-2 pt-2 border-t border-gray-100 text-gray-500" style={{fontSize:11}}>
                  {s.iv.tb>0&&<span>🏅 TB {s.iv.tb}</span>}
                  {s.iv.b>0&&<span>Bien {s.iv.b}</span>}
                  {s.iv.ab>0&&<span>AB {s.iv.ab}</span>}
                </div>
              )}
              {s.iv.acc2&&(
                <div className="mt-2 pt-2 border-t border-gray-100 text-gray-500" style={{fontSize:11}}>
                  Parcours 2nde→Bac : <span className="font-bold text-gray-700">{s.iv.acc2}%</span>
                  {s.iv.va_acc!=null&&<span className="ml-1" style={{color:vaColor(s.iv.va_acc)}}>Plus-value {vaSign(s.iv.va_acc)}</span>}
                </div>
              )}
            </div>
          )}

          <button onClick={e=>{e.stopPropagation();setExpanded(false)}} className="mt-2 w-full py-2 rounded-xl text-center font-medium text-gray-400 hover:text-gray-600 transition-colors" style={{fontSize:11}}>
            Réduire ↑
          </button>
        </>)}

        {/* Compare button */}
        <div className="mt-3 flex justify-end">
          <button onClick={e=>{e.stopPropagation();onCompare(s)}} className="font-bold rounded-xl px-4 py-2.5 transition-all active:scale-95" style={{color:cmpHighlight?"white":"#1B4F72",background:cmpHighlight?"#1B4F72":"#1B4F720A",fontSize:12,minHeight:44,border:"1px solid #1B4F7020"}}>{cmpHighlight?"✓ Sélectionné":"⚖️ Comparer"}</button>
        </div>
      </>)}
    </div>
  );
}

/* === COMPARATOR === */
function Comparator({a,b,onClear}) {
  if(!a&&!b) return <div className="text-center py-16"><p style={{fontSize:48}}>⚖️</p><p className="font-bold text-gray-500 mt-3" style={{fontSize:16}}>Comparez deux établissements</p><p className="text-gray-400 mt-2 max-w-xs mx-auto" style={{fontSize:13,lineHeight:1.6}}>Appuyez sur <strong>⚖️ Comparer</strong> dans la fiche d'une école, puis faites de même avec une deuxième.</p></div>;
  const items=[a,b].filter(Boolean);
  const row=(label,fn,highlight)=>{
    if(!label) return <tr key={Math.random()}><td colSpan={3} className="py-1"><div className="border-t border-gray-100"></div></td></tr>;
    return(<tr key={label}><td className="p-2.5 text-gray-500 font-medium align-top" style={{fontSize:11,lineHeight:1.4}}>{label}</td>
      {items.map(s=>{const val=fn(s);const isVA=highlight&&typeof val==="string"&&(val.startsWith("+")||val.startsWith("-"));
        return <td key={s.id} className="p-2.5 text-center font-bold align-top" style={{fontSize:12,color:isVA?vaColor(parseFloat(val)):undefined}}>{String(val)}</td>})}
    </tr>)};
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-extrabold text-gray-700" style={{fontSize:16}}>Comparaison</h3>
        <button onClick={onClear} className="text-red-400 hover:text-red-600 font-medium px-3 py-2 rounded-xl" style={{fontSize:12,minHeight:44}}>✕ Recommencer</button>
      </div>
      {items.length===1&&<p className="text-gray-400 mb-4 text-center" style={{fontSize:12}}>Sélectionnez un deuxième établissement pour comparer</p>}
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <table className="w-full" style={{fontSize:12,minWidth:350}}>
          <thead><tr><th className="text-left p-2"></th>
            {items.map(s=><th key={s.id} className="p-2 text-center" style={{minWidth:140}}>
              <div className="flex flex-col items-center gap-1">
                {s.i&&<div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold" style={{background:ipsColor(s.i),fontSize:12}}>{Math.round(s.i)}</div>}
                <span className="font-extrabold text-gray-800" style={{fontSize:12}}>{TE[s.t]} {shortName(s.n)}</span>
                <span className="text-gray-400" style={{fontSize:10}}>{TL[s.t]} {SL[s.s]}</span>
              </div>
            </th>)}
          </tr></thead>
          <tbody>
            {row("Type",s=>TL[s.t]+(s.lt?" ("+s.lt+")":""))}
            {row("Commune",s=>s.c)}
            {row("Effectifs",s=>s.ef||"—")}
            {row("Élèves / classe",s=>s.ef&&s.cl?(s.ef/s.cl).toFixed(1):"—")}
            {row("Prix / an",s=>s.px?s.px+"€":"Gratuit")}
            {row("")}
            {row("Milieu social (IPS)",s=>s.i?(s.i+(s.i_proxy?" ≈":""))+" — "+ipsLabel(s.i):"—")}
            {row("IPS voie GT",s=>s.igt||"—")}
            {row("IPS voie Pro",s=>s.ipro||"—")}
            {row("")}
            {row("Réussite brevet / bac",s=>s.iv?(s.iv.brevet||s.iv.bac)+"%":"—")}
            {row("Plus-value réussite",s=>s.iv&&(s.iv.va_brevet!=null||s.iv.va_bac!=null)?vaSign(s.iv.va_brevet!=null?s.iv.va_brevet:s.iv.va_bac):"—",true)}
            {row("Taux de mentions",s=>s.iv&&s.iv.men?s.iv.men+"%":"—")}
            {row("Plus-value mentions",s=>s.iv&&s.iv.va_men!=null?vaSign(s.iv.va_men):"—",true)}
            {row("Mentions TB",s=>s.iv&&s.iv.tb?String(s.iv.tb):"—")}
            {row("Parcours complet",s=>{if(s.iv&&s.iv.acces_6_3)return"6ᵉ→3ᵉ: "+s.iv.acces_6_3+"%";if(s.iv&&s.iv.acc2)return"2nde→Bac: "+s.iv.acc2+"%";return"—"})}
            {row("Plus-value parcours",s=>s.iv&&s.iv.va_acc!=null?vaSign(s.iv.va_acc):"—",true)}
            {row("")}
            {row("Collège de secteur",s=>s.cs?s.cs.n:"—")}
            {row("Éval 6ème FR",s=>s.ev?s.ev.fr_s+" ("+s.ev.fr_st+"% avancés)":"—")}
            {row("Éval 6ème MA",s=>s.ev?s.ev.ma_s+" ("+s.ev.ma_st+"% avancés)":"—")}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* === VA CHART === */
function VAChart({schools}) {
  const items=schools.filter(s=>(s.t==="c"&&s.iv&&s.iv.va_brevet!=null)||(s.t==="l"&&s.iv&&s.iv.va_bac!=null));
  if(!items.length) return <p className="text-gray-400 text-center py-16" style={{fontSize:14}}>Aucun établissement avec données de plus-value dans les filtres actuels</p>;
  const data=items.sort((a,b)=>((b.iv.va_brevet||b.iv.va_bac)||0)-((a.iv.va_brevet||a.iv.va_bac)||0)).map(s=>({
    name:shortName(s.n),full:s.n,va:s.iv.va_brevet||s.iv.va_bac,fill:vaColor(s.iv.va_brevet||s.iv.va_bac),type:s.t==="l"?"Lycée":"Collège",sector:s.s==="u"?"Public":"Privé",c:s.c
  }));
  const top3=data.filter(d=>d.va>0).slice(0,3);
  const bottom3=data.filter(d=>d.va<0).slice(-3).reverse();
  return (
    <div>
      {/* SIMPLE EXPLANATION */}
      <div className="rounded-2xl p-4 mb-4" style={{background:"#f0fdf4",border:"1px solid #bbf7d0"}}>
        <div className="font-extrabold mb-2" style={{color:"#15803d",fontSize:15}}>📊 Qu'est-ce que la plus-value ?</div>
        <p style={{fontSize:13,lineHeight:1.7,color:"#374151"}}>
          Le Ministère compare chaque collège et lycée à des établissements qui accueillent le même type d'élèves. La <strong>plus-value</strong> répond à une question simple :
        </p>
        <div className="rounded-xl p-3 mt-2 mb-2 text-center font-bold" style={{background:"white",fontSize:14,color:"#1B4F72"}}>
          « Est-ce que cette école fait <u>mieux</u> ou <u>moins bien</u> que ce qu'on attend d'elle ? »
        </div>
        <div className="flex gap-3 mt-2" style={{fontSize:12}}>
          <div className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-full" style={{background:"#27ae60"}}></span><strong style={{color:"#27ae60"}}>+5</strong> = fait mieux que prévu</div>
          <div className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-full" style={{background:"#f39c12"}}></span><strong style={{color:"#f39c12"}}>0</strong> = dans la moyenne</div>
          <div className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-full" style={{background:"#e74c3c"}}></span><strong style={{color:"#e74c3c"}}>-5</strong> = en dessous</div>
        </div>
      </div>

      {/* TOP & BOTTOM HIGHLIGHT */}
      {top3.length>0&&(
        <div className="mb-4">
          <div className="font-extrabold text-gray-700 mb-2" style={{fontSize:13}}>🏆 Ceux qui font le plus progresser leurs élèves</div>
          <div className="flex flex-col gap-1.5">
            {top3.map((d,i)=>(
              <div key={d.name} className="flex items-center gap-2 bg-white rounded-xl p-2.5 border border-gray-100" style={{fontSize:12}}>
                <span className="font-extrabold text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{background:"#27ae60",fontSize:13}}>+{d.va}</span>
                <div className="flex-1 min-w-0"><span className="font-bold text-gray-800">{d.name}</span> <span className="text-gray-400">· {d.type} {d.sector} · {d.c}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}
      {bottom3.length>0&&(
        <div className="mb-4">
          <div className="font-extrabold text-gray-700 mb-2" style={{fontSize:13}}>⚠️ Ceux qui ont une marge de progression</div>
          <div className="flex flex-col gap-1.5">
            {bottom3.map((d,i)=>(
              <div key={d.name} className="flex items-center gap-2 bg-white rounded-xl p-2.5 border border-gray-100" style={{fontSize:12}}>
                <span className="font-extrabold text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{background:"#e74c3c",fontSize:13}}>{d.va}</span>
                <div className="flex-1 min-w-0"><span className="font-bold text-gray-800">{d.name}</span> <span className="text-gray-400">· {d.type} {d.sector} · {d.c}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FULL CHART */}
      <div className="font-extrabold text-gray-700 mb-2" style={{fontSize:13}}>📈 Tous les établissements</div>
      <ResponsiveContainer width="100%" height={Math.max(300,data.length*28)}>
        <BarChart data={data} layout="vertical" margin={{left:0,right:30,top:5,bottom:5}}>
          <XAxis type="number" domain={[-15,15]} tick={{fontSize:10}} tickLine={false} axisLine={false}/>
          <YAxis type="category" dataKey="name" width={120} tick={{fontSize:10}} tickLine={false} axisLine={false}/>
          <Tooltip formatter={(v)=>[v>0?"+"+v:v,"Plus-value"]} labelFormatter={n=>{const d=data.find(x=>x.name===n);return d?d.full+" ("+d.type+" "+d.sector+", "+d.c+")":n}} contentStyle={{fontSize:12,borderRadius:12,border:"1px solid #eee"}}/>
          <ReferenceLine x={0} stroke="#374151" strokeWidth={1}/>
          <Bar dataKey="va" radius={[0,4,4,0]}>{data.map((d,i)=><Cell key={i} fill={d.fill}/>)}</Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-gray-400 mt-3 text-center" style={{fontSize:10}}>Source : IVAL/IVAC — Ministère de l'Éducation nationale · Session 2023-2024</p>
    </div>
  );
}

/* === APP SHELL === */
export default function App() {
  const [tab,setTab]=useState("carte");
  const [showGuide,setShowGuide]=useState(false);
  const [showHero,setShowHero]=useState(true);
  const [showLegal,setShowLegal]=useState(false);
  const [typeF,setTypeF]=useState([]);
  const [comF,setComF]=useState([]);
  const [secF,setSecF]=useState([]);
  const [search,setSearch]=useState("");
  const [sel,setSel]=useState(null);
  const [cmpA,setCmpA]=useState(null);
  const [cmpB,setCmpB]=useState(null);
  const [sortBy,setSortBy]=useState("ips");
  const [openF,setOpenF]=useState(null);

  const communes=useMemo(()=>[...new Set(D.map(s=>s.c))].sort(),[]);
  const toggle=(arr,set,v)=>set(p=>p.includes(v)?p.filter(x=>x!==v):[...p,v]);

  const filtered=useMemo(()=>{
    let f=D;
    if(typeF.length)f=f.filter(s=>typeF.includes(s.t));
    if(comF.length)f=f.filter(s=>comF.includes(s.c));
    if(secF.length)f=f.filter(s=>secF.includes(s.s));
    if(search){const q=search.toLowerCase();f=f.filter(s=>s.n.toLowerCase().includes(q)||s.c.toLowerCase().includes(q)||s.a?.toLowerCase().includes(q))}
    const sorters={ips:(a,b)=>(b.i||0)-(a.i||0),effectifs:(a,b)=>(b.ef||0)-(a.ef||0),nom:(a,b)=>a.n.localeCompare(b.n),
      ratio:(a,b)=>{const ra=a.ef&&a.cl?a.ef/a.cl:999;const rb=b.ef&&b.cl?b.ef/b.cl:999;return ra-rb},
      va:(a,b)=>((b.iv?.va_brevet??b.iv?.va_bac)??(-99))-((a.iv?.va_brevet??a.iv?.va_bac)??(-99))};
    return [...f].sort(sorters[sortBy]||sorters.ips);
  },[typeF,comF,secF,search,sortBy]);

  const cmp=useCallback(s=>{
    if(!cmpA){setCmpA(s);setCmpB(null);}
    else if(!cmpB&&cmpA.id!==s.id){setCmpB(s);setTab("comparer");}
    else{setCmpA(s);setCmpB(null);}
  },[cmpA,cmpB]);

  const stats=useMemo(()=>{
    const wi=filtered.filter(s=>s.i);
    return{total:filtered.length,avg:wi.length?(wi.reduce((a,s)=>a+s.i,0)/wi.length).toFixed(0):"—",eleves:filtered.reduce((a,s)=>a+(s.ef||0),0)};
  },[filtered]);

  const TABS=[{id:"carte",l:"🗺️ Carte",m:"🗺️"},{id:"liste",l:"📋 Liste",m:"📋"},{id:"comparer",l:"⚖️ Comparer",m:"⚖️"}];

  return (
    <div className="min-h-screen bg-gray-50" style={{fontFamily:"'Nunito',system-ui,-apple-system,sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}.animate-slideUp{animation:slideUp .25s ease-out}`}</style>

      {/* HEADER — sticky, minimal */}
      <header className="bg-white border-b border-gray-100 sticky top-0" style={{zIndex:1200}}>
        <div className="max-w-5xl mx-auto px-3 sm:px-5 h-14 flex items-center justify-between">
          <h1 className="font-black" style={{fontSize:19,color:"#1B4F72",letterSpacing:-.5}}>QuelleEcole<span style={{color:"#e67e22"}}>.fr</span></h1>
          <div className="flex items-center gap-1">
            <button onClick={()=>setShowGuide(!showGuide)} className="flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors" style={{width:44,height:44,color:showGuide?"#1B4F72":"#aaa",fontSize:20,fontWeight:900}}>?</button>
            <a href="https://buymeacoffee.com/quelleecole" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center rounded-xl font-bold transition-all hover:scale-105" style={{height:38,padding:"0 14px",fontSize:13,background:"#FFDD00",color:"#1a1a1a",boxShadow:"0 2px 8px rgba(255,221,0,.4)"}}>☕ Soutenir</a>
          </div>
        </div>
      </header>

      {/* HERO — first impression */}
      {showHero && (
        <div style={{background:"linear-gradient(135deg, #1B4F72 0%, #2874A6 100%)"}}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center relative">
            <button onClick={()=>setShowHero(false)} className="absolute top-3 right-3 text-white text-opacity-40 hover:text-opacity-80 p-2" style={{fontSize:16}}>✕</button>
            <h2 className="font-black text-white leading-tight" style={{fontSize:24,letterSpacing:-.5}}>Quelle école pour votre enfant ?</h2>
            <p className="text-white text-opacity-70 mt-3 max-w-md mx-auto" style={{fontSize:14,lineHeight:1.7}}>Comparez <strong className="text-white text-opacity-100">255 établissements</strong> de Lille Métropole avec les données officielles du Ministère — IPS, résultats, carte scolaire.</p>
            <div className="flex items-center justify-center gap-2 mt-5">
              {[{c:"#D35400",l:"Populaire"},{c:"#E67E22"},{c:"#F4D03F"},{c:"#5DADE2"},{c:"#1B4F72",l:"Favorisé"}].map((z,i)=>
                <div key={i} className="rounded-full" style={{width:12,height:12,background:z.c,border:"2px solid rgba(255,255,255,.3)"}}></div>
              )}
            </div>
            <p className="text-white text-opacity-50 mt-1" style={{fontSize:10}}>Chaque pastille = le milieu social d'une école</p>
            <button onClick={()=>setShowHero(false)} className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95" style={{color:"#1B4F72",fontSize:14}}>🗺️ Explorer la carte</button>
          </div>
        </div>
      )}

      {/* GUIDE PANEL */}
      {showGuide && (
        <div style={{background:"#fafaf8",borderBottom:"1px solid #eee"}}>
          <div className="max-w-5xl mx-auto px-3 sm:px-5 py-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-extrabold" style={{color:"#1B4F72",fontSize:17}}>Comment lire ce site ?</h2>
              <button onClick={()=>setShowGuide(false)} className="font-bold p-2 rounded-xl hover:bg-gray-100" style={{color:"#1B4F72",fontSize:13,minHeight:44}}>✕ Fermer</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" style={{fontSize:12,color:"#555",lineHeight:1.6}}>
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="font-extrabold mb-1" style={{color:"#1B4F72",fontSize:13}}>🔵 Les pastilles de couleur = milieu social</div>
                <p>C'est l'IPS (Indice de Position Sociale). Il résume le profil des familles à partir des métiers des parents. <strong>Plus il est élevé, plus les familles sont favorisées.</strong> Moyenne nationale : 103. Un chiffre élevé ≠ meilleure école. <strong>Touchez une pastille IPS puis ℹ️ pour voir des exemples de familles.</strong></p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="font-extrabold mb-1" style={{color:"#27ae60",fontSize:13}}>🟢 La « Plus-value » = ce que l'école apporte vraiment</div>
                <p>Le Ministère compare les résultats de chaque collège et lycée à ceux qu'il devrait obtenir vu son public. <strong>Plus-value positive = l'école fait mieux que prévu.</strong> C'est le meilleur indicateur pour juger un établissement.</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="font-extrabold mb-1" style={{fontSize:13}}>🎓 Collège de secteur = où ira votre enfant</div>
                <p>Chaque adresse est rattachée à un collège public. C'est automatique en fin de CM2. Des dérogations existent (musique, sport, section internationale). <a href="https://services.lenord.fr/trouver-mon-college-de-secteur" target="_blank" rel="noopener noreferrer" style={{color:"#1B4F72"}} className="font-bold underline">Vérifiez votre adresse ici</a>.</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="font-extrabold mb-1" style={{fontSize:13}}>📊 D'où viennent ces données ?</div>
                <p>Tout est issu des données officielles du Ministère de l'Éducation nationale (DEPP). <strong>255 établissements · 9 communes · Données 2024-2025.</strong> Prix : sites des écoles privées. Aucune donnée n'est inventée.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IPS BANNER — always visible */}
      <div className="border-b border-gray-100" style={{background:"#f8fafc"}}>
        <div className="max-w-5xl mx-auto px-3 sm:px-5 py-2 flex items-center gap-3">
          <div className="flex items-center gap-1 flex-shrink-0">
            {[{c:"#D35400",l:"Populaire"},{c:"#E67E22"},{c:"#5DADE2"},{c:"#2874A6"},{c:"#1B4F72",l:"Favorisé"}].map((z,i)=>
              <div key={i} className="rounded-full" style={{width:i===0||i===4?10:8,height:i===0||i===4?10:8,background:z.c}}></div>
            )}
          </div>
          <div className="flex-1 min-w-0" style={{fontSize:11,color:"#888"}}>
            <span className="font-bold" style={{color:"#1B4F72"}}>IPS</span> = milieu social des familles (métiers des parents). Chaque pastille colorée résume le profil d'une école.
          </div>
          <InfoBubble topic="ips"/>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white border-b border-gray-100 relative" style={{zIndex:1100}} onClick={e=>{if(!e.target.closest("[data-f]"))setOpenF(null)}}>
        <div className="max-w-5xl mx-auto px-3 sm:px-5 py-2.5 space-y-2">
          <input type="text" placeholder="🔍 Rechercher une école, un collège, un lycée…" value={search} onChange={e=>setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-gray-400 bg-gray-50/80 transition-colors" style={{fontSize:15,minHeight:48}}/>

          {/* FILTER PILLS */}
          <div className="flex gap-2 flex-wrap pb-1">
            {[["type",typeF,setTypeF,[["m","🎒 Mater."],["e","📚 Élem."],["p","🏫 Primaire"],["c","🎓 Collège"],["l","🏛️ Lycée"]]],
              ["ville",comF,setComF,communes.map(c=>[c,c])],
              ["secteur",secF,setSecF,[["u","Public"],["v","Privé"]]]
            ].map(([key,f,set,opts])=>(
              <div key={key} className="relative" data-f={key}>
                <button onClick={()=>setOpenF(openF===key?null:key)}
                  className="flex items-center gap-1 px-3.5 rounded-2xl border whitespace-nowrap transition-colors"
                  style={{height:40,fontSize:13,fontWeight:f.length?700:500,color:f.length?"#1B4F72":"#888",background:f.length?"#1B4F720A":"white",borderColor:f.length?"#1B4F7030":"#e5e5e5"}}>
                  {f.length===0?(key==="type"?"Type":key==="ville"?"Ville":"Public/Privé"):<><span>{f.length} filtre{f.length>1?"s":""}</span><span onClick={e=>{e.stopPropagation();set([])}} className="ml-1 text-gray-400 hover:text-red-400" style={{fontSize:16}}>×</span></>} {!f.length&&"▾"}
                </button>
                {openF===key&&(
                  <div className="absolute top-full left-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 min-w-48 max-h-72 overflow-y-auto" style={{zIndex:9999,boxShadow:"0 8px 30px rgba(0,0,0,.15)"}}>
                    {opts.map(([v,l])=>(
                      <label key={v} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer active:bg-gray-100" style={{fontSize:14}}>
                        <input type="checkbox" checked={f.includes(v)} onChange={()=>toggle(f,set,v)} style={{width:20,height:20}} className="rounded"/>
                        <span className="font-medium">{l}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="px-3.5 rounded-2xl border border-gray-200 bg-white text-gray-600 appearance-none" style={{height:40,fontSize:13,paddingRight:12}}>
              <option value="ips">Tri : milieu social ↓</option><option value="effectifs">Tri : effectifs ↓</option>
              <option value="ratio">Tri : taille classes ↑</option><option value="nom">Tri : nom A→Z</option><option value="va">Tri : plus-value ↓</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABS — big touch targets */}
      <div className="bg-gray-50 pt-2 pb-1 px-3 sm:px-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-1 overflow-x-auto" style={{scrollbarWidth:"none"}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-2xl font-extrabold transition-all whitespace-nowrap flex-shrink-0 ${tab===t.id?"text-white shadow-lg":"text-gray-400 hover:text-gray-600 bg-white border border-gray-100"}`}
                style={{fontSize:13,background:tab===t.id?"#1B4F72":undefined,minHeight:48}}>
                {t.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-3 sm:px-5 py-3 sm:py-4">

        {/* CARTE */}
        {tab==="carte"&&(
          <div className="space-y-3">
            <MiniMap schools={filtered} selected={sel} onSelect={setSel}/>
            {sel&&<Card s={sel} onCompare={cmp} cmpHighlight={cmpA&&cmpA.id===sel.id}/>}
            <div>
              <p className="text-gray-400 font-bold px-1 mb-2" style={{fontSize:12}}>{filtered.length} établissement{filtered.length>1?"s":""} {(typeF.length>0||comF.length>0||secF.length>0)&&<button onClick={()=>{setTypeF([]);setComF([]);setSecF([])}} className="text-red-400 font-medium ml-2">effacer filtres</button>}</p>
              {filtered.length===0&&<div className="text-center py-16 text-gray-400"><p style={{fontSize:48}}>🔍</p><p className="font-bold mt-3" style={{fontSize:16}}>Aucun résultat</p><p className="mt-1" style={{fontSize:13}}>Essayez d'élargir vos filtres</p></div>}
              <div className="space-y-1.5">
                {filtered.slice(0,40).map(s=><div key={s.id} onClick={()=>{if(cmpA&&!cmpB&&cmpA.id!==s.id){cmp(s)}else{setSel(s)}}} className="cursor-pointer"><Card s={s} onCompare={cmp} compact cmpHighlight={cmpA&&cmpA.id===s.id}/></div>)}
              </div>
              {filtered.length>40&&<div className="text-center py-4"><button onClick={()=>setTab("liste")} className="font-bold hover:underline" style={{color:"#1B4F72",fontSize:14,minHeight:48}}>Voir les {filtered.length} résultats en liste →</button></div>}
            </div>
          </div>
        )}

        {/* LISTE */}
        {tab==="liste"&&(
          <div>
            <p className="text-gray-400 font-bold mb-3" style={{fontSize:12}}>{filtered.length} établissement{filtered.length>1?"s":""}</p>
            <div className="space-y-2 sm:columns-2 sm:gap-3">
              {filtered.map(s=><div key={s.id} className="cursor-pointer break-inside-avoid mb-2" onClick={()=>{if(cmpA&&!cmpB&&cmpA.id!==s.id){cmp(s)}else{setSel(s);setTab("carte")}}}><Card s={s} onCompare={cmp} cmpHighlight={cmpA&&cmpA.id===s.id}/></div>)}
            </div>
          </div>
        )}

        {/* COMPARER */}
        {tab==="comparer"&&<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-5"><Comparator a={cmpA} b={cmpB} onClear={()=>{setCmpA(null);setCmpB(null)}}/></div>}

        {/* PLUS-VALUE */}
      </div>

      {/* TIP JAR */}
      <div className="max-w-5xl mx-auto px-3 sm:px-5 py-4">
        <div className="rounded-3xl border border-amber-100 p-5 sm:p-6 text-center" style={{background:"linear-gradient(135deg, #fffbf0 0%, #fff7e6 100%)"}}>
          <p style={{fontSize:28}}>☕</p>
          <h3 className="font-extrabold text-gray-700 mt-1" style={{fontSize:15}}>Ce guide vous est utile ?</h3>
          <p className="text-gray-500 mt-1.5 max-w-sm mx-auto" style={{fontSize:12,lineHeight:1.6}}>Gratuit, indépendant, sans pub. Des centaines d'heures de travail bénévole sur les données ouvertes du Ministère.</p>
          <a href="https://buymeacoffee.com/quelleecole" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 font-extrabold rounded-full shadow-md hover:shadow-lg transition-all active:scale-95" style={{fontSize:14}}>
            ☕ Offrir un café
          </a>
        </div>
      </div>

      {/* MENTIONS LÉGALES */}
      {showLegal && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center" style={{zIndex:10000}} onClick={()=>setShowLegal(false)}>
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="relative bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="sticky top-0 bg-white rounded-t-3xl sm:rounded-t-2xl px-5 pt-4 pb-2 border-b border-gray-100 flex justify-between items-start">
              <div className="font-bold text-gray-800" style={{fontSize:16}}>Mentions légales</div>
              <button onClick={()=>setShowLegal(false)} className="text-gray-300 hover:text-gray-500 font-bold p-1" style={{fontSize:20,lineHeight:1}}>×</button>
            </div>
            <div className="px-5 py-4 space-y-4" style={{fontSize:13,color:"#555",lineHeight:1.7}}>
              <div><h3 className="font-bold text-gray-800 mb-1">Éditeur du site</h3><p>QuelleEcole.fr est un projet créé par deux parents lillois. Conformément à l'article 6-III-2 de la loi LCEN, l'identité des éditeurs a été communiquée à l'hébergeur.</p></div>
              <div><h3 className="font-bold text-gray-800 mb-1">Hébergement</h3><p>Vercel Inc. — 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p></div>
              <div><h3 className="font-bold text-gray-800 mb-1">Données personnelles</h3><p>Ce site ne collecte aucune donnée personnelle. Aucun cookie publicitaire n'est utilisé. Seul Vercel Analytics (anonymisé, sans cookies) mesure la fréquentation.</p></div>
              <div><h3 className="font-bold text-gray-800 mb-1">Sources des données</h3><p>Toutes les données proviennent de sources publiques officielles : IPS (DEPP, data.education.gouv.fr), résultats brevet/bac (IVAC/IVAL, session 2024), évaluations 6ème (DEPP 2024), carte scolaire (annuaire-education.fr / Département du Nord), prix du privé (sites web des écoles).</p></div>
              <div><h3 className="font-bold text-gray-800 mb-1">Responsabilité</h3><p>QuelleEcole.fr est un outil d'information. Les données sont fournies à titre indicatif et ne sauraient engager la responsabilité de l'éditeur. En cas d'erreur, merci de nous contacter.</p></div>
              <div><h3 className="font-bold text-gray-800 mb-1">Propriété intellectuelle</h3><p>Données ouvertes sous Licence Ouverte Etalab 2.0. Code et design du site : propriété de l'éditeur.</p></div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="max-w-5xl mx-auto px-3 sm:px-5 pb-10 text-center text-gray-300" style={{fontSize:10,lineHeight:1.7}}>
        <p>Données : Ministère de l'Éducation nationale (DEPP) · data.education.gouv.fr · Session 2024-25</p>
        <p>255 établissements (229 écoles/collèges + 26 lycées) · 47 avec tarifs · 8 communes de Lille Métropole</p>
        <p>Carte scolaire : vérifiez sur <a href="https://services.lenord.fr/trouver-mon-college-de-secteur" target="_blank" rel="noopener noreferrer" style={{color:"#1B4F72"}} className="hover:underline font-medium">services.lenord.fr</a></p>
        <p className="mt-2"><a href="https://buymeacoffee.com/quelleecole" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-600 font-bold">☕ Soutenir</a> · <button onClick={()=>setShowLegal(true)} className="underline hover:text-gray-400">Mentions légales</button> · Fait avec soin à Lille par deux parents</p>
      </footer>

      {/* FLOATING COMPARE BAR — appears when 1 school selected */}
      {cmpA && !cmpB && tab!=="comparer" && (
        <div className="fixed bottom-0 left-0 right-0 animate-slideUp" style={{zIndex:9990}}>
          <div className="max-w-5xl mx-auto px-3 pb-3">
            <div className="flex items-center gap-3 p-3 rounded-2xl shadow-2xl border border-gray-100" style={{background:"white",boxShadow:"0 -4px 30px rgba(0,0,0,.12)"}}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{background:ipsColor(cmpA.i),fontSize:11}}>{Math.round(cmpA.i||0)}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-800 truncate" style={{fontSize:13}}>{shortName(cmpA.n)}</div>
                <div className="text-gray-400" style={{fontSize:11}}>Cliquez sur n'importe quelle école pour comparer</div>
              </div>
              <button onClick={()=>{setCmpA(null);setCmpB(null)}} className="text-gray-300 hover:text-red-400 flex-shrink-0 p-2" style={{fontSize:18}}>✕</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
