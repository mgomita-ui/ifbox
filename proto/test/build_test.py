# 検証ページを作る：偽物のDB・AIスタブ（stub_head.html）＋本体（../index.html）
import io
stub = io.open("stub_head.html", encoding="utf-8").read()
src = io.open("../index.html", encoding="utf-8").read()
h = stub + src + "\n</body></html>"
io.open("index.html", "w", encoding="utf-8").write(h)
for n in ["5", "6", "7", "8"]:
    run = h.replace("\n</body></html>", "\n<script src=\"scenario_round%s.js\"></script>\n</body></html>" % n)
    io.open("run%s.html" % n, "w", encoding="utf-8").write(run)
print("ok: index.html, run5-8.html")
