const GUIDE_TEXTS = [
  "2色の比較\n1st color: 左の色\n2nd color: 右の色\n色の指定方法:\nカラーコード(#fff, #ffffff)\n10進数RGB(rgb(255, 255, 255))\nHSV表色系(hsv(359, 100%, 100%))\nHSL表色系(hsl(359, 100%, 100%))\nXYZ表色系(xyz(0.964, 1.0, 0.825))\nxy色座標(xy(0, 0.359))\nCSS色名(blanchedalmond)",
  "文字の見やすさ確認\n1st color: 文字色\n2nd color: 背景色",
  "加法混色(値あふれあり)\n1st color: 左上の色\n2nd color: 右下の色",
  "加法混色(値あふれなし)\n1st color: 左上の色\n2nd color: 右下の色",
  "減法混色\n1st color: 左上の色\n2nd color: 右下の色",
  "RGB乗法混色\n1st color: 中央の色\n2nd color: 右半分の色\n補足: 物体色(1st)が環境色(2nd)によってどう見えるかを表す",
  "XYZ乗法混色\n1st color: 中央の色\n2nd color: 右半分の色",
  "RGB相乗平均混色\n1st color: 左上の色\n2nd color: 右下の色",
  "XYZ相乗平均混色\n1st color: 左上の色\n2nd color: 右下の色",
  "RGB調和平均混色\n1st color: 左上の色\n2nd color: 右下の色",
  "XYZ調和平均混色\n1st color: 左上の色\n2nd color: 右下の色",
  "RGBアインシュタイン和混色\n1st color: 左上の色\n2nd color: 右下の色\n計算式: (x + y)/(1 + xy)",
  "補色(ダイアード)\n1st color: 一番左の色\n説明: 色相環で互いに正反対の位置にいる色",
  "トライアード\n1st color: 一番左の色\n説明: 色相環を120°開いた所にある色",
  "テトラード\n1st color: 一番左の色\n説明: 色相環を90°開いた所にある色",
  "ペンタード\n1st color: 一番左の色\n説明: 色相環を72°開いた所にある色",
  "ヘキサード\n1st color: 一番左の色\n説明: 色相環を60°開いた所にある色",
  "スプリット・コンプリメンタリ\n1st color: 一番左の色\n説明: 補色の隣接色(150°離れた2色)",
  "ナチュラル・ハーモニー/コンプレックス・ハーモニー\n1st color: 一番左の色\n2nd color: 一番右の色の色相\n説明: 一番左の色に馴染むように右の色のトーンを調節する\nNaturalityの近い色が選ばれる",
  "ドミナント配色",
  "グラデーション\n1st color: 一番左の色\n2nd color: 一番右の色\n説明: 色を連続的(60段階)に変化させる",
  "ナチュラル/コンプレックス・グラデーション\n1st color: 一番左の色\n2nd color: 一番右の色の色相\n説明: 馴染みを考慮したグラデーション",
  "セパレーション配色",
  "トーナル配色",
  "カマイュ配色"
];