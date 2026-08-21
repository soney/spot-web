# frozen_string_literal: true

# The paint splatter behind the wordmark in _layouts/default.html: one splat
# per alum, in their `color`.
#
# Two pieces:
#   - SplatterFile, a Generator, writes /assets/images/splatter.svg at build
#     time from the people in _data/people.yaml whose `membership` is in
#     MEMBERSHIPS and who have a `color`. The file is ~100 KB because the look
#     is made of a thousand-odd droplets, so it is a separate cached asset
#     rather than inline SVG repeated in every page.
#   - the `{% splatter %}` tag emits the <img> that shows it. The tag exists so
#     the template does not have to know the path, and so the two stay in step.
#
# Each person's splat is generated from a random stream seeded with their
# `id`, so the same people produce the same picture on every build (and in the
# _site diff), while adding someone adds one new splat and leaves the others
# alone. A person without a `color` is skipped silently, so adding an alum
# without one does not break the build; it just leaves them out.
#
# This is in Ruby because the geometry needs a seeded PRNG, trigonometry and
# Bezier smoothing; Liquid has none of those.
#
# THE LOOK is the STYLE hash below, layered over STYLE_DEFAULTS. Each splat is:
#   - a few small ragged pools (outline = low-frequency sine bumps for bays
#     and bulges, plus per-point jitter for a frayed edge);
#   - a `cloud` of medium droplets piled around the centre, which is what
#     actually forms the mass, so its edge is granular and porous;
#   - `holes` punched through all of that with an SVG mask, kept out of the
#     centre so they bite into the outline rather than pepper the middle;
#   - `sats`, a field of small droplets thinning with distance, biased into a
#     cone on the far side of a random impact direction, and `specks` of mist
#     further out.
# Sizes are fractions of the splat radius r; counts and ranges are [lo, hi].
# To try a different look, change STYLE and rebuild; only splatter.svg
# changes in the _site diff.
require "digest"

module Jekyll
  module Splatter
    module_function

    # Deterministic per-person seed; only the first 8 hex digits are needed.
    def seed_for(id)
      Digest::MD5.hexdigest(id.to_s)[0, 8].to_i(16)
    end

    # Number formatting for path data: one decimal, trailing ".0" dropped.
    # The viewBox is 200 units across and renders at roughly 100 CSS px, so
    # 0.1 unit is well under a device pixel; more digits only add bytes.
    def f(x)
      format("%.1f", x).sub(/\.0$/, "")
    end

    # "#rrggbb" -> [h, s, l] in 0..1.
    def hex_to_hsl(hex)
      hex = hex.to_s.strip.delete("#")
      hex = hex.chars.map { |c| c * 2 }.join if hex.size == 3
      r, g, b = hex.scan(/../).map { |x| x.to_i(16) / 255.0 }
      max = [r, g, b].max
      min = [r, g, b].min
      l = (max + min) / 2.0
      return [0.0, 0.0, l] if max == min

      d = max - min
      s = l > 0.5 ? d / (2.0 - max - min) : d / (max + min)
      h = if max == r then ((g - b) / d) % 6
          elsif max == g then (b - r) / d + 2
          else (r - g) / d + 4
          end
      [h / 6.0, s, l]
    end

    def hsl_to_hex(h, s, l)
      c = (1 - (2 * l - 1).abs) * s
      x = c * (1 - ((h * 6) % 2 - 1).abs)
      m = l - c / 2.0
      r, g, b = case (h * 6).floor % 6
                when 0 then [c, x, 0]
                when 1 then [x, c, 0]
                when 2 then [0, c, x]
                when 3 then [0, x, c]
                when 4 then [x, 0, c]
                else [c, 0, x]
                end
      format("#%02X%02X%02X", *[r, g, b].map { |v| ((v + m) * 255).round.clamp(0, 255) })
    end

    # The person's `color`, pushed toward paint: saturation raised to at least
    # `sat`, lightness pulled into the `light` band. Hue is never changed, so
    # each splat still reads as the same colour as that person's news chip,
    # only bolder. A near-grey becomes a vivid version of its faint tint.
    def vivid(hex, st)
      return hex unless st[:vivid]

      h, s, l = hex_to_hsl(hex)
      s = [s, st[:vivid][:sat]].max
      l = l.clamp(st[:vivid][:light][0], st[:vivid][:light][1])
      hsl_to_hex(h, s, l)
    end

    # A uniform draw from a [lo, hi] pair.
    def rr(rng, range)
      range[0] + rng.rand * (range[1] - range[0])
    end

    # Roughly normal, bounded to +-3: three uniforms summed and recentred.
    def gauss(rng)
      (rng.rand + rng.rand + rng.rand - 1.5) * 2
    end

    # A droplet: a circle unless it is stretched enough to show, in which case
    # an ellipse rotated along its direction of flight. Circles are half the
    # bytes, and most droplets are close enough to round.
    def drop(x, y, size, stretch, angle)
      if stretch < 1.15
        %(<circle cx="#{f(x)}" cy="#{f(y)}" r="#{f(size)}"/>)
      else
        %(<ellipse cx="#{f(x)}" cy="#{f(y)}" rx="#{f(size * stretch)}" ry="#{f(size)}" transform="rotate(#{f(angle * 180 / Math::PI)} #{f(x)} #{f(y)})"/>)
      end
    end

    # Catmull-Rom spline through a closed ring of points, as cubic Beziers.
    def smooth_closed_path(pts)
      n = pts.size
      d = +"M#{f(pts[0][0])} #{f(pts[0][1])}"
      n.times do |i|
        p0 = pts[(i - 1) % n]
        p1 = pts[i]
        p2 = pts[(i + 1) % n]
        p3 = pts[(i + 2) % n]
        c1 = [p1[0] + (p2[0] - p0[0]) / 6.0, p1[1] + (p2[1] - p0[1]) / 6.0]
        c2 = [p2[0] - (p3[0] - p1[0]) / 6.0, p2[1] - (p3[1] - p1[1]) / 6.0]
        d << "C#{f(c1[0])} #{f(c1[1])} #{f(c2[0])} #{f(c2[1])} #{f(p2[0])} #{f(p2[1])}"
      end
      d << "Z"
    end

    STYLE_DEFAULTS = {
      # body
      body_scale: 1.0,      # body radius as a fraction of r
      edge_pts: 16,         # outline samples; more = finer raggedness survives smoothing
      edge_amp: 0.17,       # amplitude of the low-frequency bumps (bays/bulges)
      wave_fq: [2, 5],      # bumps per revolution, three sinusoids drawn from this
      edge_hf: 0.0,         # per-point jitter (frayed edge); 0 = smooth
      nick_p: 0.06,         # chance a ragged point kicks outward
      ecc: 1.0,             # elongation along the impact direction
      lobes: 0,             # extra pools merged into the body
      lobe_size: [0.35, 0.75],
      lobe_dist: [0.5, 1.1],
      # impact direction
      directional: false,   # bias tendrils/droplets into a cone
      cone: 0.8,            # cone width in radians
      dir_bias: 0.0,        # added to the 65% chance a feature follows the cone
      # tendrils
      tendrils: [2, 5],
      t_len: [0.7, 2.3],
      t_thick: [0.16, 0.30],  # half-width at the root
      t_taper: 0.3,           # tip half-width as a fraction of the root's
      # droplet field
      sats: [8, 15],
      sat_dist: [1.2, 3.2],
      sat_size: [0.05, 0.21],
      sat_fall: 1.5,          # >1 packs droplets near the body
      sat_stretch: 1.2,       # elongation along the direction of flight
      # mist
      specks: [2, 5],
      speck_dist: [2.8, 4.2],
      speck_size: [0.04, 0.10],
      # coalesced core: a cloud of droplets packed around the centre so the
      # mass is granular and its edge porous, like paint that hit hard enough
      # to break up. 0 disables it (the body is then just the smooth pool).
      cloud: [0, 0],
      cloud_reach: 1.6,       # how far the cloud extends, in r
      cloud_size: [0.06, 0.2],
      # holes punched out of everything above, via an SVG mask; most land
      # near the centre where the mass is solid
      holes: [0, 0],
      hole_reach: 1.2,
      hole_inner: 0.0,        # no holes closer to the centre than this fraction of reach
      hole_size: [0.03, 0.12],
      # layout: how far the splat centres spread across the viewBox
      x_spread: 0.56,
      y_spread: 0.24,
      # colour: nil uses each person's `color` as written; a hash pushes it
      # toward paint (see `vivid`)
      vivid: nil,
    }.freeze

    # The chosen look: mass built from medium droplets over small ragged
    # pools, holes biting the edges, heavy spray, the five splats overlapping
    # into one cluster ("variant Q" from the design pass).
    STYLE = STYLE_DEFAULTS.merge(
      body_scale: 0.45, edge_pts: 72, edge_amp: 0.32, wave_fq: [3, 7], edge_hf: 0.09, nick_p: 0.12,
      lobes: 4, lobe_size: [0.25, 0.6], lobe_dist: [0.4, 1.2], ecc: 1.15,
      directional: true, cone: 1.6,
      tendrils: [0, 1], t_len: [0.3, 0.9], t_thick: [0.08, 0.17], t_taper: 0.2,
      cloud: [110, 150], cloud_reach: 2.2, cloud_size: [0.06, 0.32],
      holes: [30, 45], hole_reach: 2.0, hole_inner: 0.55, hole_size: [0.02, 0.11],
      sats: [60, 90], sat_dist: [0.9, 3.2], sat_size: [0.02, 0.11], sat_fall: 1.0, sat_stretch: 1.2,
      specks: [70, 110], speck_dist: [1.8, 4.6], speck_size: [0.012, 0.045],
      x_spread: 0.3, y_spread: 0.3,
      vivid: { sat: 0.78, light: [0.48, 0.58] },
    ).freeze

    # Who gets a splat.
    MEMBERSHIPS = ["alum"].freeze

    # Where the generated file goes, relative to the site root.
    PATH = "assets/images/splatter.svg"

    # An angle: uniform, or (when directional) usually inside the cone
    # around theta.
    def pick_angle(rng, st, theta)
      return rng.rand * Math::PI * 2 unless st[:directional] && rng.rand < (0.65 + st[:dir_bias])

      theta + gauss(rng) * st[:cone] * 0.5
    end

    # Outline points of one pool of radius r centred on (cx, cy), elongated
    # along theta.
    def body(rng, cx, cy, r, st, theta)
      n = st[:edge_pts]
      waves = Array.new(3) do
        [st[:wave_fq][0] + rng.rand(st[:wave_fq][1] - st[:wave_fq][0] + 1), rng.rand * Math::PI * 2, rng.rand * st[:edge_amp]]
      end
      ux = Math.cos(theta)
      uy = Math.sin(theta)
      Array.new(n) do |k|
        a = Math::PI * 2 * k / n
        rad = 1.0
        waves.each { |(fq, ph, amp)| rad += amp * Math.sin(fq * a + ph) }
        rad += (rng.rand - 0.5) * 2 * st[:edge_hf]
        rad += 0.2 + rng.rand * 0.2 if st[:edge_hf] > 0 && rng.rand < st[:nick_p]
        x = Math.cos(a) * rad * r
        y = Math.sin(a) * rad * r
        along = (x * ux + y * uy) * st[:ecc]
        across = -x * uy + y * ux
        [cx + along * ux - across * uy, cy + along * uy + across * ux]
      end
    end

    # One splat centred on (cx, cy) with radius r, as SVG shapes (no fill:
    # the caller's <g> carries the colour).
    def splat(rng, cx, cy, r, st)
      out = []
      theta = rng.rand * Math::PI * 2
      r *= st[:body_scale]
      out << %(<path d="#{smooth_closed_path(body(rng, cx, cy, r, st, theta))}"/>)

      st[:lobes].times do
        a = pick_angle(rng, st, theta)
        d = r * rr(rng, st[:lobe_dist])
        lr = r * rr(rng, st[:lobe_size])
        lst = st.merge(lobes: 0, ecc: 1.0)
        out << %(<path d="#{smooth_closed_path(body(rng, cx + Math.cos(a) * d, cy + Math.sin(a) * d, lr, lst, a))}"/>)
      end

      rng.rand(st[:cloud][0]..st[:cloud][1]).times do
        a = pick_angle(rng, st, theta)
        t = [gauss(rng).abs / 3.0, 1.0].min # 0..1, piled up near 0
        dist = r * t * st[:cloud_reach]
        size = r * rr(rng, st[:cloud_size]) * (1.0 - t * 0.7)
        stretch = 1 + rng.rand * 0.8 * t
        out << drop(cx + Math.cos(a) * dist, cy + Math.sin(a) * dist, size, stretch, a)
      end

      rng.rand(st[:tendrils][0]..st[:tendrils][1]).times do
        a = pick_angle(rng, st, theta)
        len = r * rr(rng, st[:t_len])
        w0 = r * rr(rng, st[:t_thick])
        w1 = w0 * st[:t_taper] * (0.6 + rng.rand * 0.8)
        root = r * 0.7
        ux = Math.cos(a)
        uy = Math.sin(a)
        px = -uy
        py = ux
        bend = (rng.rand - 0.5) * 0.5 * len
        rx = cx + ux * root
        ry = cy + uy * root
        tx = cx + ux * (root + len) + px * bend
        ty = cy + uy * (root + len) + py * bend
        mx = cx + ux * (root + len * 0.45) + px * bend * 0.3
        my = cy + uy * (root + len * 0.45) + py * bend * 0.3
        wm = w0 * 0.5
        d = "M#{f(rx + px * w0)} #{f(ry + py * w0)}" \
            "Q#{f(mx + px * wm)} #{f(my + py * wm)} #{f(tx + px * w1)} #{f(ty + py * w1)}" \
            "Q#{f(tx + ux * w1 * 1.4)} #{f(ty + uy * w1 * 1.4)} #{f(tx - px * w1)} #{f(ty - py * w1)}" \
            "Q#{f(mx - px * wm)} #{f(my - py * wm)} #{f(rx - px * w0)} #{f(ry - py * w0)}Z"
        out << %(<path d="#{d}"/>)
        next unless rng.rand < 0.8

        gap = w0 * (1.2 + rng.rand * 2.5)
        dr = w0 * (0.5 + rng.rand * 0.6)
        out << %(<circle cx="#{f(tx + ux * gap)}" cy="#{f(ty + uy * gap)}" r="#{f(dr)}"/>)
      end

      rng.rand(st[:sats][0]..st[:sats][1]).times do
        a = pick_angle(rng, st, theta)
        t = rng.rand**st[:sat_fall]
        dist = r * (st[:sat_dist][0] + t * (st[:sat_dist][1] - st[:sat_dist][0]))
        size = r * rr(rng, st[:sat_size]) * (1.1 - t * 0.6)
        next if size < 0.25

        stretch = 1 + rng.rand * st[:sat_stretch] * (1 - t * 0.5)
        out << drop(cx + Math.cos(a) * dist, cy + Math.sin(a) * dist, size, stretch, a)
      end

      rng.rand(st[:specks][0]..st[:specks][1]).times do
        a = pick_angle(rng, st, theta)
        dist = r * rr(rng, st[:speck_dist])
        size = r * rr(rng, st[:speck_size])
        out << %(<circle cx="#{f(cx + Math.cos(a) * dist)}" cy="#{f(cy + Math.sin(a) * dist)}" r="#{f(size)}"/>)
      end
      out.join
    end

    # Hole shapes for the mask over one splat: black dots that cut through
    # whatever is under them.
    def holes(rng, cx, cy, r, st)
      r *= st[:body_scale]
      Array.new(rng.rand(st[:holes][0]..st[:holes][1])) do
        a = rng.rand * Math::PI * 2
        # sqrt spreads them evenly over the area instead of piling up in the
        # middle; hole_inner then keeps the centre solid, so the holes mostly
        # bite the edge of the mass rather than pepper its middle
        band = st[:hole_inner] + (1 - st[:hole_inner]) * Math.sqrt(rng.rand)
        dist = r * band * st[:hole_reach]
        size = r * rr(rng, st[:hole_size])
        %(<circle cx="#{f(cx + Math.cos(a) * dist)}" cy="#{f(cy + Math.sin(a) * dist)}" r="#{f(size)}"/>)
      end.join
    end

    # people: hashes with "id", "color", "given_name", "family_name".
    # The splat centres are laid out in a width x height box; the viewBox is
    # that box plus `pad` on every side, because an <img> clips at its edge
    # and the spray reaches well past the centres. The CSS decides how big the
    # whole image is on the page.
    def svg(people, width: 200, height: 100, pad: 70, radius: 34, style: STYLE)
      people = people.select { |p| p["color"].to_s.strip != "" }
      groups = people.each_with_index.map do |p, i|
        rng = Random.new(seed_for(p["id"]))
        # Centres are spread left to right in data order, alternating above
        # and below the middle, with a little jitter. The zigzag is what keeps
        # every person visible: in a tight cluster a splat placed between two
        # others on the same line is mostly painted over by them.
        slot = (i + 0.5) / people.size
        cx = width * (0.5 + (slot - 0.5) * style[:x_spread]) + (rng.rand - 0.5) * width * 0.08
        cy = height * (0.5 + ((i % 2) - 0.5) * style[:y_spread] + (rng.rand - 0.5) * 0.08)
        r = radius * (0.8 + rng.rand * 0.5)
        name = "#{p["given_name"]} #{p["family_name"]}".strip
        shapes = splat(rng, cx, cy, r, style)
        mask = ""
        if style[:holes][1] > 0
          mask_id = "splatter-holes-#{p["id"]}"
          # The mask is white everywhere a splat may reach and black where the
          # holes are; maskUnits default to the bounding box, so the rect has to
          # be an explicit generous area or anything outside it is clipped.
          mask = %(<mask id="#{mask_id}" maskUnits="userSpaceOnUse" x="#{-width}" y="#{-width}" width="#{width * 3}" height="#{width * 3}"><rect x="#{-width}" y="#{-width}" width="#{width * 3}" height="#{width * 3}" fill="#fff"/><g fill="#000">#{holes(rng, cx, cy, r, style)}</g></mask>)
          shapes = %(<g mask="url(##{mask_id})">#{shapes}</g>)
        end
        %(<g fill="#{vivid(p["color"].to_s.strip, style)}" data-person="#{p["id"]}"><title>#{name}</title>#{mask}#{shapes}</g>)
      end
      vw = width + pad * 2
      vh = height + pad * 2
      %(<svg xmlns="http://www.w3.org/2000/svg" width="#{vw}" height="#{vh}" viewBox="#{-pad} #{-pad} #{vw} #{vh}">#{groups.join}</svg>)
    end
  end

  # Writes PATH into _site. Nothing is written to the source tree.
  class SplatterFile < Generator
    safe true
    priority :low

    def generate(site)
      people = (site.data["people"] || []).select { |p| Splatter::MEMBERSHIPS.include?(p["membership"]) }
      page = PageWithoutAFile.new(site, site.source, File.dirname(Splatter::PATH), File.basename(Splatter::PATH))
      page.content = Splatter.svg(people)
      # The SVG is finished output: no layout, and not run through Liquid.
      page.data["layout"] = nil
      page.data["render_with_liquid"] = false
      page.data["sitemap"] = false
      site.pages << page
    end
  end

  # {% splatter %} -- the <img> for the file above. Decorative (alt=""): the
  # colour-to-person mapping is in people.yaml, not something a reader needs.
  class SplatterTag < Liquid::Tag
    def render(context)
      site = context.registers[:site]
      src = File.join(site.config["baseurl"].to_s, "/", Splatter::PATH)
      %(<img class="splatter" src="#{src}" alt="" width="340" height="240">)
    end
  end
end

Liquid::Template.register_tag("splatter", Jekyll::SplatterTag)
