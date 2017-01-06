window.onload = function (ev) {
  let canvas = document.getElementById('canvas'),
    palette = document.getElementById('palette'),
    ctx_diag = canvas.getContext('2d'),
    ctx_p = palette.getContext('2d'),
    selector = document.getElementById('mode_select'),
    selected_color1 = document.getElementById('first_color_selector'),
    express_color1 = document.getElementById('first_color_expr'),
    selected_color2 = document.getElementById('second_color_selector'),
    express_color2 = document.getElementById('second_color_expr'),
    result_display = document.getElementById('result'),
    change_button = document.getElementById('change_button'),
    eye = new Eye(),
    regulated_color = [],
    first_ID;

  draw_chromaticity_diagram(ctx_diag, canvas.width, 1);
  first_ID = init_eye(eye, regulated_color, [new Color(selected_color1.value), new Color(selected_color2.value)]);

  function std_draw_palette() {
    eye.chgColor(first_ID, new Color(selected_color1.value));
    eye.chgColor(first_ID + 1, new Color(selected_color2.value));
    eye.chgColor(first_ID + 2, (new Color(selected_color1.value)).add(new Color(selected_color2.value)));
    eye.sync();
    draw_palette(selector.value, ctx_p, palette.width, palette.height, regulated_color, [new Color(selected_color1.value), new Color(selected_color2.value), (new Color(selected_color1.value)).add(new Color(selected_color2.value))]);
  }
  std_draw_palette();

  selected_color1.onchange = function (e) {
    express_color1.value = selected_color1.value;
    std_draw_palette();
  };
  express_color1.onblur = function (e) {
    selected_color1.value = (new Color(express_color1.value)).rgb.toColorCode();
    std_draw_palette();
  };
  selected_color2.onchange = function (e) {
    express_color2.value = selected_color2.value;
    std_draw_palette();
  };
  express_color2.onblur = function (e) {
    selected_color2.value = (new Color(express_color2.value)).rgb.toColorCode();
    std_draw_palette();
  };

  selector.onchange = function (e) {
    std_draw_palette();
  };

  change_button.onclick = function (e) {
    [selected_color1.value, selected_color2.value] = [selected_color2.value, selected_color1.value];
    [express_color1.value, express_color2.value] = [selected_color1.value, selected_color2.value];
    std_draw_palette();
  };

  palette.onmousemove = function (e) {
    let mouse = {
        x: e.clientX - e.target.offsetLeft,
        y: e.clientY - e.target.offsetTop
      },
      pixeldata = ctx_p.getImageData(mouse.x, mouse.y, 1, 1).data,
      pixel_color = new Color([pixeldata[0], pixeldata[1], pixeldata[2]]);

    result_display.innerHTML = pixel_color.rgb.toColorCode() + "<br>" + pixel_color.rgb.toString() + "<br>" + pixel_color.hsv.toString() + "<br>" + pixel_color.hsl.toString() + "<br>" + pixel_color.xyz.toString() + "<br>" + pixel_color.xyz.toYxyString() + "<br>Naturality: " + pixel_color.naturality;
  };
  palette.onmouseleave = function (e) {
    result_display.innerHTML = "";
  };
};

function draw_chromaticity_diagram(context, size, Y) {
  // 幅と高さがsizeのcanvas領域に輝度Yで色度図を描く
  for (var x = 1 / size; x < 1; x += 1 / size) {
    for (var y = 1 / size; y < 1 - x - 1 / size; y += 1 / size) {
      context.fillStyle = (new Color([x, y])).rgb.toString();
      context.fillRect(x * size - 1, size - y * size, 1, 1);
    }
  }
}

function clear_palette(context, width, height, color) {
  context.fillStyle = color.rgb.toString();
  context.fillRect(0, 0, width, height);
}

function init_eye(eye, regArray, init_colors) {
  let first_ID = eye.regColor(init_colors[0], function (c) {
    regArray[0] = c;
  });
  eye.regColor(init_colors[1], function (c) {
    regArray[1] = c;
  });
  eye.regColor(init_colors[0].add(init_colors[1]), function (c) {
    regArray[2] = c;
  });
  return first_ID;
}

function draw_palette(mode, context, width, height, r_colors, n_colors) {
  switch (mode) {
  case 'Additive_L':
    draw_additive(context, width, height, n_colors);
    break;
  case 'Additive_R':
    draw_additive(context, width, height, r_colors);
    break;
  case 'Subtractive':
    draw_subtractive(context, width, height, n_colors);
    break;
  case 'Multiplicative_RGB':
    draw_multiplicative_rgb(context, width, height, n_colors);
    break;
  case 'Multiplicative_XYZ':
    draw_multiplicative_xyz(context, width, height, n_colors);
    break;
  case 'Geometric_RGB':
    draw_geometric_rgb(context, width, height, n_colors);
    break;
  case 'Geometric_XYZ':
    draw_geometric_xyz(context, width, height, n_colors);
    break;
  case 'Harmonic_RGB':
    draw_harmonic_rgb(context, width, height, n_colors);
    break;
  case 'Harmonic_XYZ':
    draw_harmonic_xyz(context, width, height, n_colors);
    break;
  case 'Einstein':
    draw_einstein(context, width, height, n_colors);
    break;
  case 'Dyads':
    draw_n_ads(context, width, height, n_colors[0], 2);
    break;
  case 'Triads':
    draw_n_ads(context, width, height, n_colors[0], 3);
    break;
  case 'Tetrads':
    draw_n_ads(context, width, height, n_colors[0], 4);
    break;
  case 'Pentads':
    draw_n_ads(context, width, height, n_colors[0], 5);
    break;
  case 'Hexads':
    draw_n_ads(context, width, height, n_colors[0], 6);
    break;
  case 'Split':
    draw_split_complemental(context, width, height, n_colors[0]);
    break;
  case 'Natural':
    draw_nat_cpx(context, width, height, n_colors);
    break;
  case 'Gradation':
    draw_gradation(context, width, height, n_colors, 60);
    break;
  case 'Natural_Gradation':
    draw_nat_gradation(context, width, height, n_colors, 60);
    break;
  default:
    clear_palette(context, width, height, new Color([0, 0, 0]));
  }
}

function draw_additive(context, width, height, colors) {
  clear_palette(context, width, height, new Color([0, 0, 0]));
  context.fillStyle = colors[0].rgb.toString();
  context.fillRect(width * 7 / 32, height / 8, width * 3 / 8, height / 2);
  context.fillStyle = colors[1].rgb.toString();
  context.fillRect(width * 13 / 32, height * 3 / 8, width * 3 / 8, height / 2);
  context.fillStyle = colors[2].rgb.toString();
  context.fillRect(width * 13 / 32, height * 3 / 8, width * 3 / 16, height / 4);
}

function draw_subtractive(context, width, height, colors) {
  clear_palette(context, width, height, new Color([0xff, 0xff, 0xff]));
  context.fillStyle = colors[0].rgb.toString();
  context.fillRect(width * 7 / 32, height / 8, width * 3 / 8, height / 2);
  context.fillStyle = colors[1].rgb.toString();
  context.fillRect(width * 13 / 32, height * 3 / 8, width * 3 / 8, height / 2);
  context.fillStyle = colors[0].subtract(colors[1]).rgb.toString();
  context.fillRect(width * 13 / 32, height * 3 / 8, width * 3 / 16, height / 4);
}

function draw_multiplicative_rgb(context, width, height, colors) {
  clear_palette(context, width, height, new Color([0xff, 0xff, 0xff]));
  context.fillStyle = colors[0].rgb.toString();
  context.fillRect(width / 4, height / 4, width / 4, height / 2);
  context.fillStyle = colors[1].rgb.toString();
  context.fillRect(width / 2, 0, width / 2, height);
  context.fillStyle = colors[0].multiply_rgb(colors[1]).rgb.toString();
  context.fillRect(width / 2, height / 4, width / 4, height / 2);
}

function draw_multiplicative_xyz(context, width, height, colors) {
  clear_palette(context, width, height, new Color([0xff, 0xff, 0xff]));
  context.fillStyle = colors[0].rgb.toString();
  context.fillRect(width / 4, height / 4, width / 4, height / 2);
  context.fillStyle = colors[1].rgb.toString();
  context.fillRect(width / 2, 0, width / 2, height);
  context.fillStyle = colors[0].multiply_xyz(colors[1]).rgb.toString();
  context.fillRect(width / 2, height / 4, width / 4, height / 2);
}

function draw_geometric_rgb(context, width, height, colors) {
  clear_palette(context, width, height, new Color([0xff, 0xff, 0xff]));
  context.fillStyle = colors[0].rgb.toString();
  context.fillRect(width * 7 / 32, height / 8, width * 3 / 8, height / 2);
  context.fillStyle = colors[1].rgb.toString();
  context.fillRect(width * 13 / 32, height * 3 / 8, width * 3 / 8, height / 2);
  context.fillStyle = colors[0].geo_mean_rgb(colors[1]).rgb.toString();
  context.fillRect(width * 13 / 32, height * 3 / 8, width * 3 / 16, height / 4);
}

function draw_geometric_xyz(context, width, height, colors) {
  clear_palette(context, width, height, new Color([0xff, 0xff, 0xff]));
  context.fillStyle = colors[0].rgb.toString();
  context.fillRect(width * 7 / 32, height / 8, width * 3 / 8, height / 2);
  context.fillStyle = colors[1].rgb.toString();
  context.fillRect(width * 13 / 32, height * 3 / 8, width * 3 / 8, height / 2);
  context.fillStyle = colors[0].geo_mean_xyz(colors[1]).rgb.toString();
  context.fillRect(width * 13 / 32, height * 3 / 8, width * 3 / 16, height / 4);
}

function draw_harmonic_rgb(context, width, height, colors) {
  clear_palette(context, width, height, new Color([0xff, 0xff, 0xff]));
  context.fillStyle = colors[0].rgb.toString();
  context.fillRect(width * 7 / 32, height / 8, width * 3 / 8, height / 2);
  context.fillStyle = colors[1].rgb.toString();
  context.fillRect(width * 13 / 32, height * 3 / 8, width * 3 / 8, height / 2);
  context.fillStyle = colors[0].harm_mean_rgb(colors[1]).rgb.toString();
  context.fillRect(width * 13 / 32, height * 3 / 8, width * 3 / 16, height / 4);
}

function draw_harmonic_xyz(context, width, height, colors) {
  clear_palette(context, width, height, new Color([0xff, 0xff, 0xff]));
  context.fillStyle = colors[0].rgb.toString();
  context.fillRect(width * 7 / 32, height / 8, width * 3 / 8, height / 2);
  context.fillStyle = colors[1].rgb.toString();
  context.fillRect(width * 13 / 32, height * 3 / 8, width * 3 / 8, height / 2);
  context.fillStyle = colors[0].harm_mean_xyz(colors[1]).rgb.toString();
  context.fillRect(width * 13 / 32, height * 3 / 8, width * 3 / 16, height / 4);
}

function draw_einstein(context, width, height, colors) {
  clear_palette(context, width, height, new Color([0, 0, 0]));
  context.fillStyle = colors[0].rgb.toString();
  context.fillRect(width * 7 / 32, height / 8, width * 3 / 8, height / 2);
  context.fillStyle = colors[1].rgb.toString();
  context.fillRect(width * 13 / 32, height * 3 / 8, width * 3 / 8, height / 2);
  context.fillStyle = colors[0].einstein_rgb(colors[1]).rgb.toString();
  context.fillRect(width * 13 / 32, height * 3 / 8, width * 3 / 16, height / 4);
}

function draw_n_ads(context, width, height, color1, n) {
  let _ = new Library();
  clear_palette(context, width, height, new Color([0, 0, 0]));
  _.range(0, n).forEach(i => {
    context.fillStyle = color1.rotate(Math.round(360 * i / n)).rgb.toString();
    context.fillRect(width * (1 / 4 + i * 5 / 11 / (n - 1)), height / 4, width / 22, height / 2);
  });
}

function draw_split_complemental(context, width, height, color1) {
  clear_palette(context, width, height, new Color([0, 0, 0]));
  context.fillStyle = color1.rgb.toString();
  context.fillRect(width / 4, height / 4, width / 22, height / 2);
  context.fillStyle = color1.rotate(Math.round(360 * 5 / 12)).rgb.toString();
  context.fillRect(width * (1 / 4 + 10 / 33), height / 4, width / 22, height / 2);
  context.fillStyle = color1.rotate(Math.round(360 * 7 / 12)).rgb.toString();
  context.fillRect(width * (1 / 4 + 5 / 11), height / 4, width / 22, height / 2);
}

function draw_nat_cpx(context, width, height, colors) {
  let _ = new Library(),
    [n, m] = colors[0].naturality,
    hues = _.range(0, 5).map(i => colors[0].neutralColor(colors[1], i * 25).hsv.h),
    fixed_hues = hues.map(h => ((h < 60) ? (h + 30) : ((h < 240) ? (150 - h) : (h - 330))) / 90),
    fixed_colors = fixed_hues.map((h, i) => new Color(colors[0].neutralColor(colors[1], i * 25).hsv.setSV(m - n * Math.abs(h), n * h + 50).toString()));

  clear_palette(context, width, height, new Color([0, 0, 0]));
  fixed_colors.forEach((c, i) => {
    context.fillStyle = c.rgb.toString();
    context.fillRect(width * (1 / 8 + i * 3 / 20), height / 4, width * 3 / 20, height / 2);
  });
}

function draw_nat_gradation(context, width, height, colors, separate_num) {
  let _ = new Library(),
    [n, m] = colors[0].naturality,
    hues = _.range(0, separate_num).map(i => colors[0].neutralColor(colors[1], i * 100 / (separate_num - 1)).hsv.h),
    fixed_hues = hues.map(h => ((h < 60) ? (h + 30) : ((h < 240) ? (150 - h) : (h - 330))) / 90),
    fixed_colors = fixed_hues.map((h, i) => new Color(colors[0].neutralColor(colors[1], i * 100 / (separate_num - 1)).hsv.setSV(m - n * Math.abs(h), n * h + 50).toString()));

  clear_palette(context, width, height, new Color([0, 0, 0]));
  fixed_colors.forEach((c, i) => {
    context.fillStyle = c.rgb.toString();
    context.fillRect(width * (1 / 8 + i * 3 / 4 / separate_num), height / 4, width / 2 / separate_num, height / 2);
  });
}

function draw_gradation(context, width, height, colors, separate_num) {
  let _ = new Library();
  clear_palette(context, width, height, new Color([0, 0, 0]));

  _.range(0, separate_num).forEach(i => {
    context.fillStyle = colors[0].neutralColor(colors[1], i * 100 / (separate_num - 1)).rgb.toString();
    context.fillRect(width * (1 / 8 + i * 3 / 4 / separate_num), height / 4, width / 2 / separate_num, height / 2);
  });
}
