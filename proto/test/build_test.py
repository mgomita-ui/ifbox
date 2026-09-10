# 検証ページを作る：偽物のDB・AIスタブ＋本体
import io
stub=io.open("stub_head.html",encoding="utf-8").read()
src=io.open("../index.html",encoding="utf-8").read()
h=stub+src+"
</body></html>"
io.open("index.html","w",encoding="utf-8").write(h)
for n in ["5","6","7","8"]:
    io.open(f"run{n}.html","w",encoding="utf-8").write(h.replace("
</body></html>",f"
<script src=\"scenario_round{n}.js\"></script>
</body></html>"))
print("ok")
