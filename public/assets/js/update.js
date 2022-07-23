!(function (t) {
    "function" == typeof define && define.amd ? define("mapbox", t) : t();
})(function () {
    "use strict";
    function o(t) {
        return (o =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (t) {
                    return typeof t;
                }
                : function (t) {
                    return t &&
                        "function" == typeof Symbol &&
                        t.constructor === Symbol &&
                        t !== Symbol.prototype
                        ? "symbol"
                        : typeof t;
                })(t);
    }
    function e(t) {
        if (((t = Object.assign({}, t)), !(this instanceof e)))
            throw new Error("MapboxLanguage needs to be called with the new keyword");
        (this.setLanguage = this.setLanguage.bind(this)),
            (this._initialStyleUpdate = this._initialStyleUpdate.bind(this)),
            (this._defaultLanguage = t.defaultLanguage),
            (this._isLanguageField = t.languageField || /^\{name/),
            (this._getLanguageField =
                t.getLanguageField ||
                function (t) {
                    return "mul" === t ? "{name}" : "{name_" + t + "}";
                }),
            (this._languageSource = t.languageSource || null),
            (this._languageTransform =
                t.languageTransform ||
                function (t, e) {
                    return "ar" === e
                        ? (function (t) {
                            var e = t.layers.map(function (t) {
                                if (!(t.layout || {})["text-field"]) return t;
                                return Object.assign({}, t, {
                                    layout: Object.assign({}, t.layout, {
                                        "text-letter-spacing": 0,
                                    }),
                                });
                            });
                            return Object.assign({}, t, { layers: e });
                        })(t)
                        : (function (t) {
                            var e = t.layers.map(function (t) {
                                if (!(t.layout || {})["text-field"]) return t;
                                var e = 0;
                                return (
                                    "state_label" === t["source-layer"] && (e = 0.15),
                                    "marine_label" === t["source-layer"] &&
                                    (/-lg/.test(t.id) && (e = 0.25),
                                        /-md/.test(t.id) && (e = 0.15),
                                        /-sm/.test(t.id) && (e = 0.1)),
                                    "place_label" === t["source-layer"] &&
                                    (/-suburb/.test(t.id) && (e = 0.15),
                                        /-neighbour/.test(t.id) && (e = 0.1),
                                        /-islet/.test(t.id) && (e = 0.01)),
                                    "airport_label" === t["source-layer"] && (e = 0.01),
                                    "rail_station_label" === t["source-layer"] && (e = 0.01),
                                    "poi_label" === t["source-layer"] &&
                                    /-scalerank/.test(t.id) &&
                                    (e = 0.01),
                                    "road_label" === t["source-layer"] &&
                                    (/-label-/.test(t.id) && (e = 0.01),
                                        /-shields/.test(t.id) && (e = 0.05)),
                                    Object.assign({}, t, {
                                        layout: Object.assign({}, t.layout, {
                                            "text-letter-spacing": e,
                                        }),
                                    })
                                );
                            });
                            return Object.assign({}, t, { layers: e });
                        })(t);
                }),
            (this._excludedLayerIds = t.excludedLayerIds || []),
            (this.supportedLanguages = t.supportedLanguages || [
                "ar",
                "en",
                "es",
                "fr",
                "de",
                "ja",
                "ko",
                "mul",
                "pt",
                "ru",
                "zh",
            ]);
    }
    function p(t, e, i, o) {
        return e.layout && e.layout["text-field"] && -1 === o.indexOf(e.id)
            ? Object.assign({}, e, {
                layout: Object.assign({}, e.layout, {
                    "text-field": (function (e, t, i) {
                        if (
                            (function (t, e) {
                                return "string" == typeof e && t.test(e);
                            })(e, t)
                        )
                            return i;
                        if (
                            (function (e, t) {
                                return (
                                    t.stops &&
                                    0 <
                                    t.stops.filter(function (t) {
                                        return e.test(t[1]);
                                    }).length
                                );
                            })(e, t)
                        ) {
                            var o = t.stops.map(function (t) {
                                return e.test(t[1]) ? [t[0], i] : t;
                            });
                            return Object.assign({}, t, { stops: o });
                        }
                        return t;
                    })(t, e.layout["text-field"], i),
                }),
            })
            : e;
    }
    function i(t) {
        var e = navigator.languages
            ? navigator.languages[0]
            : navigator.language || navigator.userLanguage,
            i = e.split("-"),
            o = e;
        return 1 < i.length && (o = i[0]), -1 < t.indexOf(o) ? o : null;
    }
    var t, n;
    (MyListing.Maps = {
        options: {
            locations: [],
            zoom: 12,
            minZoom: 0,
            maxZoom: 30,
            skin: "skin1",
            marker_type: "basic",
            gestureHandling: "greedy",
            cluster_markers: !0,
            draggable: !0,
            scrollwheel: !1,
        },
        instances: [],
        skins: [],
        init: function () { },
        loaded: !1,
        getInstance: function (e) {
            var t = MyListing.Maps.instances.filter(function (t) {
                return t.id == e;
            });
            return !(!t || !t.length) && t[0];
        },
    }),
        jQuery(document).on("maps:loaded", function () {
            jQuery(
                '.form-location-autocomplete, input[name="job_location"], input[name="_job_location"]'
            ).each(function (t, e) {
                new MyListing.Maps.Autocomplete(e);
            }),
                (MyListing.Geocoder = new MyListing.Maps.Geocoder()),
                jQuery(".cts-get-location").click(function (t) {
                    t.preventDefault();
                    var e = jQuery(jQuery(this).data("input")),
                        i = jQuery(this).data("map"),
                        o = null;
                    e.length &&
                        (i.length &&
                            (o = MyListing.Maps.getInstance(i)) &&
                            MyListing.Geocoder.setMap(o.instance),
                            MyListing.Geocoder.getUserLocation({
                                receivedAddress: function (t) {
                                    if ((e.val(t.address), e.data("autocomplete")))
                                        return e.data("autocomplete").fireChangeEvent(t);
                                },
                            }));
                });
        }),
        jQuery(function (l) {
            l(document).on("maps:loaded", function () {
                if (document.getElementById("location-picker-map")) {
                    var i = MyListing.Maps.getInstance("location-picker-map").instance,
                        t = l(".location-field-wrapper"),
                        e = t.data("options"),
                        o = t.find(".location-coords"),
                        n = t.find(".latitude-input"),
                        s = t.find(".longitude-input"),
                        a = t.find(".address-input"),
                        r = t.find('.lock-pin input[type="checkbox"]'),
                        p = t.find(".enter-coordinates-toggle > span"),
                        u = new MyListing.Maps.Marker({
                            position: g(),
                            map: i,
                            template: { type: "traditional" },
                        });
                    i.addListener("click", function (t) {
                        if (!r.prop("checked")) {
                            var e = i.getClickPosition(t);
                            u.setPosition(e),
                                n.val(e.getLatitude()),
                                s.val(e.getLongitude()),
                                MyListing.Geocoder.geocode(e.toGeocoderFormat(), function (t) {
                                    t && a.val(t.address);
                                });
                        }
                    }),
                        a.on("autocomplete:change", function (t) {
                            if (
                                !r.prop("checked") &&
                                t.detail.place &&
                                t.detail.place.latitude &&
                                t.detail.place.longitude
                            ) {
                                var e = new MyListing.Maps.LatLng(
                                    t.detail.place.latitude,
                                    t.detail.place.longitude
                                );
                                u.setPosition(e),
                                    n.val(t.detail.place.latitude),
                                    s.val(t.detail.place.longitude),
                                    i.panTo(e);
                            }
                        }),
                        i.addListenerOnce("idle", function (t) {
                            i.setZoom(e["default-zoom"]);
                        }),
                        r
                            .on("change", function (t) {
                                i.trigger("resize"), i.setCenter(g());
                            })
                            .change(),
                        p.click(function (t) {
                            o.toggleClass("hide");
                        }),
                        n.blur(c),
                        s.blur(c);
                }
                function c() {
                    var t = g();
                    u.setPosition(t),
                        i.panTo(t),
                        "" !== n.val().trim() &&
                        "" !== s.val().trim() &&
                        (n.val(t.getLatitude()), s.val(t.getLongitude()));
                }
                function g() {
                    return n.val().trim() && s.val().trim()
                        ? new MyListing.Maps.LatLng(n.val(), s.val())
                        : new MyListing.Maps.LatLng(e["default-lat"], e["default-lng"]);
                }
            });
        }),
        (MyListing.Maps.Autocomplete = function (t) {
            jQuery(t).data("autocomplete", this), this.init(t);
        }),
        (MyListing.Maps.Autocomplete.prototype.init = function (t) { }),
        (MyListing.Maps.Autocomplete.prototype.fireChangeEvent = function (t) {
            var e = document.createEvent("CustomEvent");
            e.initCustomEvent("autocomplete:change", !1, !0, { place: t || !1 }),
                this.el.dispatchEvent(e);
        }),
        (MyListing.Maps.Clusterer = function (t) {
            this.init(t);
        }),
        (MyListing.Maps.Clusterer.prototype.init = function (t) { }),
        (MyListing.Maps.Geocoder = function () {
            this.init();
        }),
        (MyListing.Maps.Geocoder.prototype.init = function () { }),
        (MyListing.Maps.Geocoder.prototype.geocode = function (t, e, i) { }),
        (MyListing.Maps.Geocoder.prototype.formatFeature = function (t) { }),
        (MyListing.Maps.Geocoder.prototype.getUserLocation = function (i) {
            i = jQuery.extend(
                {
                    shouldFetchAddress: !0,
                    receivedCoordinates: function () { },
                    receivedAddress: function () { },
                    geolocationFailed: function () { },
                },
                i
            );
            if (!navigator.geolocation) return i.geolocationFailed();
            navigator.geolocation.getCurrentPosition(
                function (t) {
                    if ((i.receivedCoordinates(t), !1 !== i.shouldFetchAddress)) {
                        var e = new MyListing.Maps.LatLng(
                            t.coords.latitude,
                            t.coords.longitude
                        );
                        MyListing.Geocoder.geocode(e.toGeocoderFormat(), function (t) {
                            return t
                                ? i.receivedAddress(t)
                                : (console.log("Couldn't determine your location."),
                                    i.geolocationFailed());
                        });
                    }
                },
                function () {
                    i.geolocationFailed();
                }
            );
        }),
        (MyListing.Maps.Geocoder.prototype.setMap = function (t) {
            this.map = t;
        }),
        (MyListing.Maps.Map = function (t) {
            (this.$el = jQuery(t)), this.init(t);
        }),
        (MyListing.Maps.Map.prototype.init = function () { }),
        (MyListing.Maps.Map.prototype.setZoom = function (t) { }),
        (MyListing.Maps.Map.prototype.getZoom = function () { }),
        (MyListing.Maps.Map.prototype.getMinZoom = function () { }),
        (MyListing.Maps.Map.prototype.getMaxZoom = function () { }),
        (MyListing.Maps.Map.prototype.setCenter = function (t) { }),
        (MyListing.Maps.Map.prototype.getCenter = function () { }),
        (MyListing.Maps.Map.prototype.getDimensions = function () { }),
        (MyListing.Maps.Map.prototype.fitBounds = function (t) { }),
        (MyListing.Maps.Map.prototype.panTo = function (t) { }),
        (MyListing.Maps.Map.prototype.getClickPosition = function (t) { }),
        (MyListing.Maps.Map.prototype.addListener = function (t, e) { }),
        (MyListing.Maps.Map.prototype.addListenerOnce = function (t, e) { }),
        (MyListing.Maps.Map.prototype.trigger = function (t) { }),
        (MyListing.Maps.Map.prototype.addControl = function (t) { }),
        (MyListing.Maps.Map.prototype.getSourceObject = function () {
            return this.map;
        }),
        (MyListing.Maps.Map.prototype.getSourceEvent = function (t) {
            return void 0 !== this.events[t] ? this.events[t] : t;
        }),
        (MyListing.Maps.Map.prototype.closePopups = function () {
            this.trigger("mylisting:closing_popups");
            for (var t = 0; t < this.markers.length; t++)
                "object" === o(this.markers[t].options.popup) &&
                    this.markers[t].options.popup.hide();
        }),
        (MyListing.Maps.Map.prototype.removeMarkers = function () {
            for (var t = 0; t < this.markers.length; t++) this.markers[t].remove();
            (this.markers.length = 0), (this.markers = []);
        }),
        (MyListing.Maps.Map.prototype._maybeAddMarkers = function () {
            var i = this;
            if (
                ((i.markers = []),
                    i.trigger("updating_markers"),
                    "custom-locations" == i.options.items_type &&
                    i.options.locations.length)
            ) {
                "basic" == i.options.marker_type &&
                    i.options.locations.forEach(function (t) {
                        i._addBasicMarker(t);
                    }),
                    "advanced" == i.options.marker_type &&
                    i.options.locations.forEach(function (t) {
                        var e = new MyListing.Maps.Marker({
                            position: new MyListing.Maps.LatLng(t.marker_lat, t.marker_lng),
                            map: i,
                            popup: new MyListing.Maps.Popup(),
                            template: { type: "advanced", thumbnail: t.marker_image.url },
                        });
                        i.markers.push(e), i.bounds.extend(e.getPosition());
                    });
                var t = function (t) {
                    15 < this.getZoom() && this.setZoom(this.options.zoom);
                };
                i.addListenerOnce("zoom_changed", t.bind(i)),
                    i.addListenerOnce("bounds_changed", t.bind(i)),
                    i.fitBounds(i.bounds),
                    i.trigger("updated_markers");
            }
            "listings" == i.options.items_type &&
                i.options.listings_query.lat &&
                i.options.listings_query.lng &&
                i.options.listings_query.radius &&
                i.options.listings_query.listing_type &&
                i.options._section_id &&
                this._addMarkersThroughQuery();
        }),
        (MyListing.Maps.Map.prototype._addBasicMarker = function (i) {
            var o = this;
            if (i.marker_lat && i.marker_lng) {
                var t = new MyListing.Maps.Marker({
                    position: new MyListing.Maps.LatLng(i.marker_lat, i.marker_lng),
                    map: o,
                    template: { type: "basic", thumbnail: i.marker_image.url },
                });
                o.markers.push(t), o.bounds.extend(t.getPosition());
            } else
                i.address &&
                    MyListing.Geocoder.geocode(i.address, function (t) {
                        if (!t) return !1;
                        var e = new MyListing.Maps.Marker({
                            position: new MyListing.Maps.LatLng(t.latitude, t.longitude),
                            map: o,
                            template: { type: "basic", thumbnail: i.marker_image.url },
                        });
                        o.markers.push(e),
                            o.bounds.extend(e.getPosition()),
                            o.fitBounds(o.bounds),
                            o.setZoom(o.options.zoom);
                    });
        }),
        (MyListing.Maps.Map.prototype._addMarkersThroughQuery = function () {
            var n = this;
            n.$el.addClass("mylisting-map-loading"),
                jQuery.ajax({
                    url:
                        CASE27.mylisting_ajax_url +
                        "&action=get_listings&security=" +
                        CASE27.ajax_nonce,
                    type: "GET",
                    dataType: "json",
                    data: {
                        listing_type: n.options.listings_query.listing_type,
                        form_data: {
                            proximity: n.options.listings_query.radius,
                            lat: n.options.listings_query.lat,
                            lng: n.options.listings_query.lng,
                            search_location: "radius search",
                            per_page: n.options.listings_query.count,
                        },
                    },
                    success: function (t) {
                        jQuery("#" + n.options._section_id)
                            .find(".c27-map-listings")
                            .html(t.html),
                            jQuery("#" + n.options._section_id)
                                .find(".c27-map-listings .lf-item-container")
                                .each(function (t, e) {
                                    var o = jQuery(e);
                                    if (o.data("locations")) {
                                        var i = o.data("locations");
                                        jQuery.each(Object.values(i), function (t, e) {
                                            var i = new MyListing.Maps.Marker({
                                                position: new MyListing.Maps.LatLng(e.lat, e.lng),
                                                map: n,
                                                popup: new MyListing.Maps.Popup({
                                                    content:
                                                        '<div class="lf-item-container lf-type-2">' +
                                                        o.html() +
                                                        "</div>",
                                                }),
                                                template: {
                                                    type: "advanced",
                                                    thumbnail: o.data("thumbnail"),
                                                    icon_name: o.data("category-icon"),
                                                    icon_color: o.data("category-text-color"),
                                                    icon_background_color: o.data("category-color"),
                                                    listing_id: o.data("id"),
                                                },
                                            });
                                            n.markers.push(i), n.bounds.extend(i.getPosition());
                                        });
                                    }
                                }),
                            jQuery(".lf-background-carousel").owlCarousel({
                                margin: 20,
                                items: 1,
                                loop: !0,
                            }),
                            n.fitBounds(n.bounds),
                            n.trigger("updated_markers"),
                            n.$el.removeClass("mylisting-map-loading");
                    },
                });
        }),
        (MyListing.Maps.Marker = function (t) {
            (this.options = jQuery.extend(
                !0,
                {
                    position: !1,
                    map: !1,
                    popup: !1,
                    template: {
                        type: "basic",
                        icon_name: "",
                        icon_color: "",
                        icon_background_color: "",
                        listing_id: "",
                        thumbnail: "",
                    },
                },
                t
            )),
                this.init(t);
        }),
        (MyListing.Maps.Marker.prototype.init = function (t) { }),
        (MyListing.Maps.Marker.prototype.getPosition = function () { }),
        (MyListing.Maps.Marker.prototype.setPosition = function (t) { }),
        (MyListing.Maps.Marker.prototype.setMap = function (t) { }),
        (MyListing.Maps.Marker.prototype.remove = function () { }),
        (MyListing.Maps.Marker.prototype.getTemplate = function () {
            var t = document.createElement("div");
            (t.className = "marker-container"),
                (t.style.position = "absolute"),
                (t.style.cursor = "pointer"),
                (t.style.zIndex = 10);
            var e = "";
            return (
                "basic" == this.options.template.type &&
                (e = jQuery("#case27-basic-marker-template")
                    .html()
                    .replace("{{marker-bg}}", this.options.template.thumbnail)),
                "traditional" == this.options.template.type &&
                (e = jQuery("#case27-traditional-marker-template").html()),
                "user-location" == this.options.template.type &&
                (e = jQuery("#case27-user-location-marker-template").html()),
                "advanced" == this.options.template.type &&
                (e = jQuery("#case27-marker-template")
                    .html()
                    .replace("{{icon}}", this.options.template.icon_name)
                    .replace("{{icon-bg}}", this.options.template.icon_background_color)
                    .replace("{{listing-id}}", this.options.template.listing_id)
                    .replace("{{marker-bg}}", this.options.template.thumbnail)
                    .replace("{{icon-color}}", this.options.template.icon_color)),
                jQuery(t).append(e),
                t
            );
        }),
        (MyListing.Maps.Popup = function (t) {
            (this.options = jQuery.extend(
                !0,
                {
                    content: "",
                    classes: "cts-map-popup cts-listing-popup infoBox cts-popup-hidden",
                    position: !1,
                    map: !1,
                },
                t
            )),
                this.init(t);
        }),
        (MyListing.Maps.Popup.prototype.init = function (t) { }),
        (MyListing.Maps.Popup.prototype.setContent = function (t) { }),
        (MyListing.Maps.Popup.prototype.setPosition = function (t) { }),
        (MyListing.Maps.Popup.prototype.setMap = function (t) { }),
        (MyListing.Maps.Popup.prototype.remove = function () { }),
        (MyListing.Maps.Popup.prototype.show = function () { }),
        (MyListing.Maps.Popup.prototype.hide = function () { }),
        (MyListing.Maps.LatLng = function (t, e) {
            this.init(t, e);
        }),
        (MyListing.Maps.LatLng.prototype.init = function (t, e) { }),
        (MyListing.Maps.LatLng.prototype.getLatitude = function () { }),
        (MyListing.Maps.LatLng.prototype.getLongitude = function () { }),
        (MyListing.Maps.LatLng.prototype.toGeocoderFormat = function () { }),
        (MyListing.Maps.LatLng.prototype.getSourceObject = function () {
            return this.latlng;
        }),
        (MyListing.Maps.LatLngBounds = function (t, e) {
            this.init(t, e);
        }),
        (MyListing.Maps.LatLngBounds.prototype.init = function (t, e) { }),
        (MyListing.Maps.LatLngBounds.prototype.extend = function (t) { }),
        (MyListing.Maps.LatLngBounds.prototype.empty = function () { }),
        (MyListing.Maps.LatLngBounds.prototype.getSourceObject = function () {
            return this.bounds;
        }),
        (e.prototype.setLanguage = function (t, e) {
            if (this.supportedLanguages.indexOf(e) < 0)
                throw new Error("Language " + e + " is not supported");
            var i =
                this._languageSource ||
                (function (i) {
                    return Object.keys(i.sources).filter(function (t) {
                        var e = i.sources[t];
                        return /mapbox-streets-v\d/.test(e.url);
                    })[0];
                })(t);
            if (!i) return t;
            var o = this._getLanguageField(e),
                n = this._isLanguageField,
                s = this._excludedLayerIds,
                a = t.layers.map(function (t) {
                    return t.source === i ? p(n, t, o, s) : t;
                }),
                r = Object.assign({}, t, { layers: a });
            return this._languageTransform(r, e);
        }),
        (e.prototype._initialStyleUpdate = function () {
            var t = this._map.getStyle(),
                e = this._defaultLanguage || i(this.supportedLanguages);
            this._map.off("styledata", this._initialStyleUpdate),
                this._map.setStyle(this.setLanguage(t, e));
        }),
        (e.prototype.onAdd = function (t) {
            return (
                (this._map = t),
                this._map.on("styledata", this._initialStyleUpdate),
                (this._container = document.createElement("div")),
                this._container
            );
        }),
        (e.prototype.onRemove = function () {
            this._map.off("styledata", this._initialStyleUpdate),
                (this._map = void 0);
        }),
        "undefined" != typeof module && void 0 !== module.exports
            ? (module.exports = e)
            : ("function" != typeof Object.assign &&
                Object.defineProperty(Object, "assign", {
                    value: function (t, e) {
                        if (null === t)
                            throw new TypeError(
                                "Cannot convert undefined or null to object"
                            );
                        for (var i = Object(t), o = 1; o < arguments.length; o++) {
                            var n = arguments[o];
                            if (null !== n)
                                for (var s in n)
                                    Object.prototype.hasOwnProperty.call(n, s) && (i[s] = n[s]);
                        }
                        return i;
                    },
                    writable: !0,
                    configurable: !0,
                }),
                (window.MapboxLanguage = e)),
        (MyListing.Maps.Marker.prototype.init = function (t) {
            (this.options = jQuery.extend(
                !0,
                {
                    position: !1,
                    map: !1,
                    popup: !1,
                    template: {
                        type: "basic",
                        icon_name: "",
                        icon_color: "",
                        icon_background_color: "",
                        listing_id: "",
                        thumbnail: "",
                    },
                },
                t
            )),
                (this.marker = new mapboxgl.Marker(this.template())),
                this.options.position && this.setPosition(this.options.position),
                this.options.map && this.setMap(this.options.map);
        }),
        (MyListing.Maps.Marker.prototype.getPosition = function () {
            return this.options.position;
        }),
        (MyListing.Maps.Marker.prototype.setPosition = function (t) {
            return this.marker.setLngLat(t.getSourceObject()), this;
        }),
        (MyListing.Maps.Marker.prototype.setMap = function (t) {
            return this.marker.addTo(t.getSourceObject()), this;
        }),
        (MyListing.Maps.Marker.prototype.remove = function () {
            return (
                this.options.popup && this.options.popup.remove(),
                this.marker.remove(),
                this
            );
        }),
        (MyListing.Maps.Marker.prototype.template = function () {
            var t = this.getTemplate();
            return (
                t.addEventListener(
                    "click",
                    function (t) {
                        t.preventDefault(),
                            this.options.popup &&
                            this.options.map &&
                            this.options.position &&
                            (this.options.popup.setPosition(this.options.position),
                                setTimeout(
                                    function () {
                                        this.options.popup.setMap(this.options.map),
                                            this.options.popup.show(),
                                            this.options.popup.fitToScreen();
                                    }.bind(this),
                                    10
                                ));
                    }.bind(this)
                ),
                t
            );
        }),
        (MyListing.Maps.Popup.prototype.init = function (t) {
            (this.options = jQuery.extend(
                !0,
                {
                    content: "",
                    classes:
                        "cts-map-popup cts-listing-popup infoBox cts-popup-hidden listing-preview",
                    position: !1,
                    map: !1,
                },
                t
            )),
                (this.popup = new mapboxgl.Popup({
                    className: this.options.classes,
                    closeButton: !1,
                    closeOnClick: !1,
                    anchor: "left",
                })),
                (this.timeout = null),
                (this.dragSearchTimeout = null),
                this.options.position && this.setPosition(this.options.position),
                this.options.content && this.setContent(this.options.content),
                this.options.map && this.setMap(this.options.map);
        }),
        (MyListing.Maps.Popup.prototype.setContent = function (t) {
            return (this.options.content = t), this.popup.setHTML(t), this;
        }),
        (MyListing.Maps.Popup.prototype.setPosition = function (t) {
            return (
                (this.options.position = t),
                this.popup.setLngLat(t.getSourceObject()),
                this
            );
        }),
        (MyListing.Maps.Popup.prototype.setMap = function (t) {
            return (this.options.map = t), this;
        }),
        (MyListing.Maps.Popup.prototype.remove = function () {
            return this.popup.remove(), this;
        }),
        (MyListing.Maps.Popup.prototype.show = function () {
            MyListing.Explore &&
                ((MyListing.Explore.suspendDragSearch = !0),
                    (this.dragSearchTimeout = setTimeout(function () {
                        return (MyListing.Explore.suspendDragSearch = !1);
                    }, 1e3)));
            var t = this;
            return (
                clearTimeout(t.timeout),
                t.popup.addTo(t.options.map.getSourceObject()),
                setTimeout(function () {
                    (t.popup._container.className = t.popup._container.className.replace(
                        "cts-popup-hidden",
                        "cts-popup-visible"
                    )),
                        t._addTemplateClass();
                }, 10),
                t
            );
        }),
        (MyListing.Maps.Popup.prototype.hide = function () {
            this.dragSearchTimeout &&
                (clearTimeout(this.dragSearchTimeout), (this.dragSearchTimeout = null));
            var t = this;
            return (
                clearTimeout(t.timeout),
                void 0 !== t.popup._container &&
                ((t.popup._container.className = t.popup._container.className.replace(
                    "cts-popup-visible",
                    "cts-popup-hidden"
                )),
                    t._addTemplateClass()),
                (t.timeout = setTimeout(function () {
                    t.remove();
                }, 250)),
                t
            );
        }),
        (MyListing.Maps.Popup.prototype.fitToScreen = function (t) {
            var e = jQuery.extend({ top: 130, right: 360, bottom: 130 }, t || {}),
                i = this.options.map.getSourceObject(),
                o = i.getCanvas().getBoundingClientRect(),
                n = i.project(i.getCenter()),
                s = n.x,
                a = n.y,
                r = i.project(this.popup.getLngLat());
            return (
                o.width - r.x < e.right - 1 && (n.x += e.right - (o.width - r.x)),
                r.y < e.top - 1 && (n.y -= e.top - r.y),
                o.height - r.y < e.bottom - 1 && (n.y += e.bottom - (o.height - r.y)),
                (n.x === s && n.y === a) || i.panTo(i.unproject(n), { duration: 200 }),
                this
            );
        }),
        (MyListing.Maps.Popup.prototype._addTemplateClass = function () {
            if (jQuery(this.options.content).find(".lf-item")) {
                var t =
                    "tpl-" +
                    jQuery(this.options.content).find(".lf-item").data("template");
                t &&
                    void 0 !== this.popup._container &&
                    -1 === this.popup._container.className.indexOf(t) &&
                    (this.popup._container.className += " " + t);
            }
        }),
        (MyListing.Maps.LatLng.prototype.init = function (t, e) {
            (this.latitude = t),
                (this.longitude = e),
                (this.latlng = new mapboxgl.LngLat(e, t));
        }),
        (MyListing.Maps.LatLng.prototype.getLatitude = function () {
            return this.latlng.lat;
        }),
        (MyListing.Maps.LatLng.prototype.getLongitude = function () {
            return this.latlng.lng;
        }),
        (MyListing.Maps.LatLng.prototype.toGeocoderFormat = function () {
            return [this.getLongitude(), this.getLatitude()].join(",");
        }),
        (MyListing.Maps.LatLngBounds.prototype.init = function (t, e) {
            (this.southwest = t),
                (this.northeast = e),
                (this.bounds = new mapboxgl.LngLatBounds(t, e));
        }),
        (MyListing.Maps.LatLngBounds.prototype.extend = function (t) {
            this.bounds.extend(t.getSourceObject());
        }),
        (MyListing.Maps.LatLngBounds.prototype.empty = function () {
            return this.bounds.isEmpty();
        }),
        (t = window),
        (n = function () {
            function y(t, e, i, o) {
                n(t, i, o), n(e, 2 * i, 2 * o), n(e, 2 * i + 1, 2 * o + 1);
            }
            function n(t, e, i) {
                var o = t[e];
                (t[e] = t[i]), (t[i] = o);
            }
            function M(t, e, i, o) {
                var n = t - i,
                    s = e - o;
                return n * n + s * s;
            }
            function u(t) {
                return t[0];
            }
            function c(t) {
                return t[1];
            }
            function m(t, e, i, o, n) {
                void 0 === e && (e = u),
                    void 0 === i && (i = c),
                    void 0 === o && (o = 64),
                    void 0 === n && (n = Float64Array),
                    (this.nodeSize = o);
                for (
                    var s = (this.points = t).length < 65536 ? Uint16Array : Uint32Array,
                    a = (this.ids = new s(t.length)),
                    r = (this.coords = new n(2 * t.length)),
                    p = 0;
                    p < t.length;
                    p++
                )
                    (r[2 * (a[p] = p)] = e(t[p])), (r[2 * p + 1] = i(t[p]));
                !(function t(e, i, o, n, s, a) {
                    if (!(s - n <= o)) {
                        var r = (n + s) >> 1;
                        !(function t(e, i, o, n, s, a) {
                            for (; n < s;) {
                                if (600 < s - n) {
                                    var r = s - n + 1,
                                        p = o - n + 1,
                                        u = Math.log(r),
                                        c = 0.5 * Math.exp((2 * u) / 3),
                                        g =
                                            0.5 *
                                            Math.sqrt((u * c * (r - c)) / r) *
                                            (p - r / 2 < 0 ? -1 : 1);
                                    t(
                                        e,
                                        i,
                                        o,
                                        Math.max(n, Math.floor(o - (p * c) / r + g)),
                                        Math.min(s, Math.floor(o + ((r - p) * c) / r + g)),
                                        a
                                    );
                                }
                                var l = i[2 * o + a],
                                    d = n,
                                    h = s;
                                for (
                                    y(e, i, n, o), i[2 * s + a] > l && y(e, i, n, s);
                                    d < h;

                                ) {
                                    for (y(e, i, d, h), d++, h--; i[2 * d + a] < l;) d++;
                                    for (; i[2 * h + a] > l;) h--;
                                }
                                i[2 * n + a] === l ? y(e, i, n, h) : y(e, i, ++h, s),
                                    h <= o && (n = h + 1),
                                    o <= h && (s = h - 1);
                            }
                        })(e, i, r, n, s, a % 2),
                            t(e, i, o, n, r - 1, a + 1),
                            t(e, i, o, 1 + r, s, a + 1);
                    }
                })(a, r, o, 0, a.length - 1, 0);
            }
            m.prototype.range = function (t, e, i, o) {
                return (function (t, e, i, o, n, s, a) {
                    for (var r, p, u = [0, t.length - 1, 0], c = []; u.length;) {
                        var g = u.pop(),
                            l = u.pop(),
                            d = u.pop();
                        if (l - d <= a)
                            for (var h = d; h <= l; h++)
                                (r = e[2 * h]),
                                    (p = e[2 * h + 1]),
                                    i <= r && r <= n && o <= p && p <= s && c.push(t[h]);
                        else {
                            var y = Math.floor((d + l) / 2);
                            (r = e[2 * y]),
                                (p = e[2 * y + 1]),
                                i <= r && r <= n && o <= p && p <= s && c.push(t[y]);
                            var m = (g + 1) % 2;
                            (0 === g ? i <= r : o <= p) &&
                                (u.push(d), u.push(y - 1), u.push(m)),
                                (0 === g ? r <= n : p <= s) &&
                                (u.push(y + 1), u.push(l), u.push(m));
                        }
                    }
                    return c;
                })(this.ids, this.coords, t, e, i, o, this.nodeSize);
            };
            function t(t) {
                (this.options = s(Object.create(e), t)),
                    (this.trees = new Array(this.options.maxZoom + 1));
            }
            var e = {
                minZoom: 0,
                maxZoom: 16,
                radius: 40,
                extent: 512,
                nodeSize: 64,
                log: !(m.prototype.within = function (t, e, i) {
                    return (function (t, e, i, o, n, s) {
                        for (var a = [0, t.length - 1, 0], r = [], p = n * n; a.length;) {
                            var u = a.pop(),
                                c = a.pop(),
                                g = a.pop();
                            if (c - g <= s)
                                for (var l = g; l <= c; l++)
                                    M(e[2 * l], e[2 * l + 1], i, o) <= p && r.push(t[l]);
                            else {
                                var d = Math.floor((g + c) / 2),
                                    h = e[2 * d],
                                    y = e[2 * d + 1];
                                M(h, y, i, o) <= p && r.push(t[d]);
                                var m = (u + 1) % 2;
                                (0 === u ? i - n <= h : o - n <= y) &&
                                    (a.push(g), a.push(d - 1), a.push(m)),
                                    (0 === u ? h <= i + n : y <= o + n) &&
                                    (a.push(d + 1), a.push(c), a.push(m));
                            }
                        }
                        return r;
                    })(this.ids, this.coords, t, e, i, this.nodeSize);
                }),
                reduce: null,
                map: function (t) {
                    return t;
                },
            };
            function h(t) {
                return {
                    type: "Feature",
                    id: t.id,
                    properties: g(t),
                    geometry: {
                        type: "Point",
                        coordinates: [
                            ((o = t.x), 360 * (o - 0.5)),
                            ((e = t.y),
                                (i = ((180 - 360 * e) * Math.PI) / 180),
                                (360 * Math.atan(Math.exp(i))) / Math.PI - 90),
                        ],
                    },
                };
                var e, i, o;
            }
            function g(t) {
                var e = t.numPoints,
                    i =
                        1e4 <= e
                            ? Math.round(e / 1e3) + "k"
                            : 1e3 <= e
                                ? Math.round(e / 100) / 10 + "k"
                                : e;
                return s(s({}, t.properties), {
                    cluster: !0,
                    cluster_id: t.id,
                    point_count: e,
                    point_count_abbreviated: i,
                });
            }
            function f(t) {
                return t / 360 + 0.5;
            }
            function L(t) {
                var e = Math.sin((t * Math.PI) / 180),
                    i = 0.5 - (0.25 * Math.log((1 + e) / (1 - e))) / Math.PI;
                return i < 0 ? 0 : 1 < i ? 1 : i;
            }
            function s(t, e) {
                for (var i in e) t[i] = e[i];
                return t;
            }
            function v(t) {
                return t.x;
            }
            function b(t) {
                return t.y;
            }
            return (
                (t.prototype.load = function (t) {
                    var e = this.options,
                        i = e.log,
                        o = e.minZoom,
                        n = e.maxZoom,
                        s = e.nodeSize;
                    i && console.time("total time");
                    var a,
                        r,
                        p,
                        u,
                        c,
                        g = "prepare " + t.length + " points";
                    i && console.time(g), (this.points = t);
                    for (var l = [], d = 0; d < t.length; d++)
                        t[d].geometry &&
                            l.push(
                                ((a = t[d]),
                                    (r = d),
                                    void 0,
                                    (p = a.geometry.coordinates),
                                    (u = p[0]),
                                    (c = p[1]),
                                    { x: f(u), y: L(c), zoom: 1 / 0, index: r, parentId: -1 })
                            );
                    (this.trees[n + 1] = new m(l, v, b, s, Float32Array)),
                        i && console.timeEnd(g);
                    for (var h = n; o <= h; h--) {
                        var y = +Date.now();
                        (l = this._cluster(l, h)),
                            (this.trees[h] = new m(l, v, b, s, Float32Array)),
                            i &&
                            console.log(
                                "z%d: %d clusters in %dms",
                                h,
                                l.length,
                                +Date.now() - y
                            );
                    }
                    return i && console.timeEnd("total time"), this;
                }),
                (t.prototype.getClusters = function (t, e) {
                    var i = ((((t[0] + 180) % 360) + 360) % 360) - 180,
                        o = Math.max(-90, Math.min(90, t[1])),
                        n = 180 === t[2] ? 180 : ((((t[2] + 180) % 360) + 360) % 360) - 180,
                        s = Math.max(-90, Math.min(90, t[3]));
                    if (360 <= t[2] - t[0]) (i = -180), (n = 180);
                    else if (n < i) {
                        var a = this.getClusters([i, o, 180, s], e),
                            r = this.getClusters([-180, o, n, s], e);
                        return a.concat(r);
                    }
                    for (
                        var p = this.trees[this._limitZoom(e)],
                        u = [],
                        c = 0,
                        g = p.range(f(i), L(s), f(n), L(o));
                        c < g.length;
                        c += 1
                    ) {
                        var l = g[c],
                            d = p.points[l];
                        u.push(d.numPoints ? h(d) : this.points[d.index]);
                    }
                    return u;
                }),
                (t.prototype.getChildren = function (t) {
                    var e = t >> 5,
                        i = t % 32,
                        o = "No cluster with the specified id.",
                        n = this.trees[i];
                    if (!n) throw new Error(o);
                    var s = n.points[e];
                    if (!s) throw new Error(o);
                    for (
                        var a =
                            this.options.radius /
                            (this.options.extent * Math.pow(2, i - 1)),
                        r = [],
                        p = 0,
                        u = n.within(s.x, s.y, a);
                        p < u.length;
                        p += 1
                    ) {
                        var c = u[p],
                            g = n.points[c];
                        g.parentId === t &&
                            r.push(g.numPoints ? h(g) : this.points[g.index]);
                    }
                    if (0 === r.length) throw new Error(o);
                    return r;
                }),
                (t.prototype.getLeaves = function (t, e, i) {
                    (e = e || 10), (i = i || 0);
                    var o = [];
                    return this._appendLeaves(o, t, e, i, 0), o;
                }),
                (t.prototype.getTile = function (t, e, i) {
                    var o = this.trees[this._limitZoom(t)],
                        n = Math.pow(2, t),
                        s = this.options,
                        a = s.extent,
                        r = s.radius / a,
                        p = (i - r) / n,
                        u = (i + 1 + r) / n,
                        c = { features: [] };
                    return (
                        this._addTileFeatures(
                            o.range((e - r) / n, p, (e + 1 + r) / n, u),
                            o.points,
                            e,
                            i,
                            n,
                            c
                        ),
                        0 === e &&
                        this._addTileFeatures(
                            o.range(1 - r / n, p, 1, u),
                            o.points,
                            n,
                            i,
                            n,
                            c
                        ),
                        e === n - 1 &&
                        this._addTileFeatures(
                            o.range(0, p, r / n, u),
                            o.points,
                            -1,
                            i,
                            n,
                            c
                        ),
                        c.features.length ? c : null
                    );
                }),
                (t.prototype.getClusterExpansionZoom = function (t) {
                    for (var e = (t % 32) - 1; e <= this.options.maxZoom;) {
                        var i = this.getChildren(t);
                        if ((e++, 1 !== i.length)) break;
                        t = i[0].properties.cluster_id;
                    }
                    return e;
                }),
                (t.prototype._appendLeaves = function (t, e, i, o, n) {
                    for (var s = 0, a = this.getChildren(e); s < a.length; s += 1) {
                        var r = a[s],
                            p = r.properties;
                        if (
                            (p && p.cluster
                                ? n + p.point_count <= o
                                    ? (n += p.point_count)
                                    : (n = this._appendLeaves(t, p.cluster_id, i, o, n))
                                : n < o
                                    ? n++
                                    : t.push(r),
                                t.length === i)
                        )
                            break;
                    }
                    return n;
                }),
                (t.prototype._addTileFeatures = function (t, e, i, o, n, s) {
                    for (var a = 0, r = t; a < r.length; a += 1) {
                        var p = e[r[a]],
                            u = {
                                type: 1,
                                geometry: [
                                    [
                                        Math.round(this.options.extent * (p.x * n - i)),
                                        Math.round(this.options.extent * (p.y * n - o)),
                                    ],
                                ],
                                tags: p.numPoints ? g(p) : this.points[p.index].properties,
                            },
                            c = p.numPoints ? p.id : this.points[p.index].id;
                        void 0 !== c && (u.id = c), s.features.push(u);
                    }
                }),
                (t.prototype._limitZoom = function (t) {
                    return Math.max(
                        this.options.minZoom,
                        Math.min(t, this.options.maxZoom + 1)
                    );
                }),
                (t.prototype._cluster = function (t, e) {
                    for (
                        var i = [],
                        o = this.options,
                        n = o.radius,
                        s = o.extent,
                        a = o.reduce,
                        r = n / (s * Math.pow(2, e)),
                        p = 0;
                        p < t.length;
                        p++
                    ) {
                        var u = t[p];
                        if (!(u.zoom <= e)) {
                            u.zoom = e;
                            for (
                                var c = this.trees[e + 1],
                                g = c.within(u.x, u.y, r),
                                l = u.numPoints || 1,
                                d = u.x * l,
                                h = u.y * l,
                                y = a && 1 < l ? this._map(u, !0) : null,
                                m = (p << 5) + (e + 1),
                                M = 0,
                                f = g;
                                M < f.length;
                                M += 1
                            ) {
                                var L = f[M],
                                    v = c.points[L];
                                if (!(v.zoom <= e)) {
                                    v.zoom = e;
                                    var b = v.numPoints || 1;
                                    (d += v.x * b),
                                        (h += v.y * b),
                                        (l += b),
                                        (v.parentId = m),
                                        a && a((y = y || this._map(u, !0)), this._map(v));
                                }
                            }
                            1 === l
                                ? i.push(u)
                                : ((u.parentId = m),
                                    i.push({
                                        x: d / l,
                                        y: h / l,
                                        zoom: 1 / 0,
                                        id: m,
                                        parentId: -1,
                                        numPoints: l,
                                        properties: y,
                                    }));
                        }
                    }
                    return i;
                }),
                (t.prototype._map = function (t, e) {
                    if (t.numPoints) return e ? s({}, t.properties) : t.properties;
                    var i = this.points[t.index].properties,
                        o = this.options.map(i);
                    return e && o === i ? s({}, o) : o;
                }),
                t
            );
        }),
        "object" == ("undefined" == typeof exports ? "undefined" : o(exports)) &&
            "undefined" != typeof module
            ? (module.exports = n())
            : "function" == typeof define && define.amd
                ? define(n)
                : ((t = t || self).Supercluster = n()),
        (MyListing.Maps.Clusterer.prototype.init = function (t) {
            (this.map = t),
                (this.clusters = {}),
                (this.clusterer = !1),
                (this.clusterGroupPopup = new MyListing.Maps.Popup({ map: this.map })),
                this.map.addListener(
                    "mylisting:closing_popups",
                    function () {
                        this.clusterGroupPopup.hide();
                    }.bind(this)
                );
        }),
        (MyListing.Maps.Clusterer.prototype.load = function () {
            (this.clusterer = new Supercluster({
                radius: MyListing.MapConfig.ClusterSize,
                maxZoom: 20,
            }).load(this.getGeoJSON())),
                this.update();
        }),
        (MyListing.Maps.Clusterer.prototype.destroy = function () {
            this.clusterer = !1;
        }),
        (MyListing.Maps.Clusterer.prototype.getGeoJSON = function () {
            return this.map.markers.map(function (t, e) {
                return {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [t.getPosition().longitude, t.getPosition().latitude],
                    },
                    properties: {
                        sID: e + 1,
                        scID: 0,
                        marker: {
                            template: jQuery.extend(!0, {}, t.options.template),
                            popup: !!t.options.popup && t.options.popup.options.content,
                        },
                    },
                };
            });
        }),
        (MyListing.Maps.Clusterer.prototype.removeFeatures = function () {
            this.map.removeMarkers(),
                Object.keys(this.clusters).forEach(
                    function (t) {
                        this.clusters[t].remove();
                    }.bind(this)
                );
        }),
        (MyListing.Maps.Clusterer.prototype.update = function () {
            var t = this;
            if (!t.clusterer) return !1;
            var e = t.map.getSourceObject().getBounds(),
                i = t.clusterer.getClusters(
                    [e.getWest(), e.getSouth(), e.getEast(), e.getNorth()],
                    Math.floor(t.map.getSourceObject().getZoom())
                );
            this.removeFeatures(), t.displayFeatures(i);
        }),
        (MyListing.Maps.Clusterer.prototype.displayFeatures = function (t) {
            var n = this;
            t.forEach(function (o) {
                if (o.properties.cluster) {
                    var t = document.createElement("div");
                    (t.className = "cts-marker-cluster"),
                        (t.innerHTML = o.properties.point_count_abbreviated);
                    var e = new mapboxgl.Marker(t);
                    e.setLngLat(o.geometry.coordinates),
                        e.addTo(n.map.getSourceObject()),
                        (n.clusters[o.properties.cluster_id] = e),
                        t.addEventListener("click", function (t) {
                            if ((t.preventDefault(), n.map.getZoom() >= n.map.getMaxZoom())) {
                                var e = n.clusterer.getLeaves(o.properties.cluster_id),
                                    i =
                                        '<div class="marker-cluster-popup"><div class="lf-item marker-cluster-wrapper" data-template="marker-cluster-popup">';
                                e.forEach(function (t) {
                                    i += t.properties.marker.popup;
                                }),
                                    (i += "</div></div>"),
                                    n.clusterGroupPopup
                                        .setPosition(
                                            new MyListing.Maps.LatLng(
                                                o.geometry.coordinates[1],
                                                o.geometry.coordinates[0]
                                            )
                                        )
                                        .setContent(i),
                                    n.map.addListenerOnce("click", function (t) {
                                        n.clusterGroupPopup.show().fitToScreen({ bottom: 400 });
                                    });
                            } else
                                n.map
                                    .getSourceObject()
                                    .easeTo({
                                        center: o.geometry.coordinates,
                                        zoom: n.clusterer.getClusterExpansionZoom(
                                            o.properties.cluster_id
                                        ),
                                    });
                        });
                } else
                    n.map.markers.push(
                        new MyListing.Maps.Marker({
                            map: n.map,
                            popup:
                                !!o.properties.marker.popup &&
                                new MyListing.Maps.Popup({
                                    content: o.properties.marker.popup,
                                }),
                            position: new MyListing.Maps.LatLng(
                                o.geometry.coordinates[1],
                                o.geometry.coordinates[0]
                            ),
                            template: o.properties.marker.template,
                        })
                    );
            });
        }),
        (MyListing.Maps.Geocoder.prototype.init = function () { }),
        (MyListing.Maps.Geocoder.prototype.geocode = function (t, i, e) {
            var o = this,
                n = !1;
            if ("function" == typeof i) (e = i), (i = {});
            var s = {
                access_token: MyListing.MapConfig.AccessToken,
                limit: 1,
                language: MyListing.MapConfig.Language,
            };
            MyListing.MapConfig.TypeRestrictions.length &&
                MyListing.MapConfig.TypeRestrictions.join(",").length &&
                (i.types = MyListing.MapConfig.TypeRestrictions.join(",")),
                MyListing.MapConfig.CountryRestrictions.length &&
                MyListing.MapConfig.CountryRestrictions.join(",").length &&
                (i.country = MyListing.MapConfig.CountryRestrictions.join(","));
            i = jQuery.extend(!0, {}, s, i);
            if (!encodeURIComponent(t).length) return e(n);
            jQuery.get({
                url: "https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json".replace(
                    "{query}",
                    encodeURIComponent(t)
                ),
                data: i,
                dataType: "json",
                success: function (t, e) {
                    "success" === e &&
                        t &&
                        t.features.length &&
                        (n =
                            1 !== i.limit
                                ? t.features.map(o.formatFeature)
                                : o.formatFeature(t.features[0]));
                },
                complete: function () {
                    e(n);
                },
            });
        }),
        (MyListing.Maps.Geocoder.prototype.formatFeature = function (t) {
            return {
                latitude: t.geometry.coordinates[1],
                longitude: t.geometry.coordinates[0],
                address: t.place_name,
            };
        }),
        (MyListing.Maps.Autocomplete.prototype.init = function (t) {
            if (!t instanceof Element) return !1;
            var e = this;
            (this.el = t),
                (this.input = jQuery(this.el)),
                (this.focusedItem = 0),
                (this.hasQueried = !1),
                this.attachDropdown(),
                this.input.on(
                    "input",
                    MyListing.Helpers.debounce(this.querySuggestions.bind(this), 300)
                ),
                this.input.on("focusin", this.showDropdown.bind(this)),
                this.input.on("focusout", this.hideDropdown.bind(this)),
                this.input.on("keydown click", this.navigateDropdown.bind(this)),
                this.dropdown.on("click", ".suggestion", function (t) {
                    e.selectItem(jQuery(this).index());
                });
        }),
        (MyListing.Maps.Autocomplete.prototype.querySuggestions = function (t) {
            this.resetFocus(), this.showDropdown(), this.fireChangeEvent();
            MyListing.Geocoder.geocode(
                t.target.value,
                { limit: 5 },
                function (t) {
                    if (((this.hasQueried = !0), this.removeSuggestions(), !t)) return !1;
                    t.forEach(this.addSuggestion.bind(this));
                }.bind(this)
            );
        }),
        (MyListing.Maps.Autocomplete.prototype.navigateDropdown = function (t) {
            this.hasQueried || this.input.trigger("input"),
                this.showDropdown(),
                40 === t.keyCode && (this.focusedItem++, this.focusItem()),
                38 === t.keyCode && (this.focusedItem--, this.focusItem()),
                13 === t.keyCode &&
                (t.preventDefault(),
                    0 !== this.focusedItem && this.selectItem(this.focusedItem - 1));
        }),
        (MyListing.Maps.Autocomplete.prototype.focusItem = function () {
            this.dropdown.find(".suggestions-list .suggestion").removeClass("active");
            var t = this.dropdown.find(".suggestions-list .suggestion");
            this.focusedItem < 0 && (this.focusedItem = t.length),
                this.focusedItem > t.length && (this.focusedItem = 0),
                0 !== this.focusedItem &&
                this.dropdown
                    .find(".suggestions-list .suggestion")
                    .eq(this.focusedItem - 1)
                    .addClass("active");
        }),
        (MyListing.Maps.Autocomplete.prototype.resetFocus = function (t) {
            (this.focusedItem = 0),
                this.dropdown
                    .find(".suggestions-list .suggestion")
                    .removeClass("active");
        }),
        (MyListing.Maps.Autocomplete.prototype.showDropdown = function (t) {
            this.dropdown.addClass("active");
            var e = this.input.get(0).getBoundingClientRect(),
                i = this.input.offset();
            this.dropdown.css({
                top: i.top + e.height + "px",
                left: i.left + "px",
                width: e.width + "px",
            });
        }),
        (MyListing.Maps.Autocomplete.prototype.hideDropdown = function (t) {
            this.dropdown.removeClass("active");
        }),
        (MyListing.Maps.Autocomplete.prototype.selectItem = function (t) {
            var e = this.dropdown
                .find(".suggestions-list .suggestion")
                .eq(t)
                .data("place");
            this.input.val(e.address),
                this.resetFocus(),
                this.hideDropdown(),
                this.fireChangeEvent(e);
        }),
        (MyListing.Maps.Autocomplete.prototype.attachDropdown = function () {
            (this.dropdown = jQuery(
                '<div class="cts-autocomplete-dropdown"><div class="suggestions-list"></div></div>'
            )),
                this.input
                    .addClass("cts-autocomplete-input")
                    .attr("autocomplete", "off"),
                jQuery("body").append(this.dropdown);
        }),
        (MyListing.Maps.Autocomplete.prototype.removeSuggestions = function () {
            this.dropdown.find(".suggestions-list").html("");
        }),
        (MyListing.Maps.Autocomplete.prototype.addSuggestion = function (t) {
            var e = jQuery(
                [
                    '<div class="suggestion">',
                    '<i class="mi location_on"></i>',
                    '<span class="suggestion--address"></span>',
                    "</div>",
                ].join("")
            );
            e.data("place", t),
                e.find(".suggestion--address").text(t.address),
                this.dropdown.find(".suggestions-list").append(e);
        }),
        (MyListing.Maps.Map.prototype.init = function (t) {
            var e = this;
            this.options = jQuery.extend(
                {},
                MyListing.Maps.options,
                jQuery(t).data("options")
            );
            (this.markers = []),
                (this.bounds = new MyListing.Maps.LatLngBounds()),
                (this.id = !!jQuery(t).attr("id") && jQuery(t).attr("id")),
                (this.events = {
                    zoom_changed: "zoomstart",
                    bounds_changed: "moveend",
                }),
                24 < this.options.maxZoom && (this.options.maxZoom = 24),
                (this.map = new mapboxgl.Map({
                    container: t,
                    zoom: this.options.zoom,
                    minZoom: this.options.minZoom,
                    maxZoom: this.options.maxZoom,
                    interactive: this.options.draggable,
                    style: MyListing.Maps.skins[this.options.skin]
                        ? MyListing.Maps.skins[this.options.skin]
                        : MyListing.Maps.skins.skin1,
                    scrollZoom: this.options.scrollwheel,
                })),
                this.map.addControl(
                    new mapboxgl.NavigationControl({ showCompass: !1 })
                ),
                this.map.addControl(new mapboxgl.FullscreenControl()),
                this.addListenerOnce(
                    "load",
                    function () {
                        MyListing.Maps.MapboxSetLanguage(this);
                    }.bind(this)
                ),
                this.setZoom(3),
                this.setCenter(new MyListing.Maps.LatLng(0, 0)),
                this.options.cluster_markers &&
                0 < MyListing.MapConfig.ClusterSize &&
                ((this.clusterer = new MyListing.Maps.Clusterer(this)),
                    this.addListener(
                        "updating_markers",
                        function () {
                            this.clusterer.destroy();
                        }.bind(this)
                    ),
                    this.addListener(
                        "updated_markers",
                        function () {
                            this.clusterer.load();
                        }.bind(this)
                    ),
                    this.addListener("zoomend", function () {
                        return e.clusterer.update();
                    }),
                    this.addListener("dragend", function () {
                        return e.clusterer.update();
                    })),
                this._maybeAddMarkers(),
                this.addListener("zoom_changed", this.closePopups.bind(this)),
                this.addListener("click", this.closePopups.bind(this)),
                this.addListener("refresh", this.refresh.bind(this)),
                MyListing.Maps.instances.push({
                    id: this.id,
                    map: this.map,
                    instance: this,
                });
        }),
        (MyListing.Maps.Map.prototype.setZoom = function (t) {
            this.map.setZoom(t);
        }),
        (MyListing.Maps.Map.prototype.getZoom = function () {
            return this.map.getZoom();
        }),
        (MyListing.Maps.Map.prototype.getMinZoom = function () {
            return this.map.getMinZoom();
        }),
        (MyListing.Maps.Map.prototype.getMaxZoom = function () {
            return this.map.getMaxZoom();
        }),
        (MyListing.Maps.Map.prototype.setCenter = function (t) {
            this.map.setCenter(t.getSourceObject());
        }),
        (MyListing.Maps.Map.prototype.getCenter = function () {
            return new MyListing.Maps.LatLng(
                this.map.getCenter().lat,
                this.map.getCenter().lng
            );
        }),
        (MyListing.Maps.Map.prototype.getDimensions = function () {
            var t = this.map.getBounds(),
                e = t.getSouthWest(),
                i = t.getNorthEast(),
                o = this.map.getCanvas().offsetWidth,
                n = this.map.getCanvas().offsetHeight,
                s = Math.atan(n / o),
                a = MyListing.Helpers.coordinatesToDistance(e.lat, e.lng, i.lat, i.lng),
                r = Math.cos(s) * a,
                p = Math.sin(s) * a;
            return { diagonal: a, width: r, height: p, average: (r + p) / 2 };
        }),
        (MyListing.Maps.Map.prototype.fitBounds = function (t) {
            t.getSourceObject().isEmpty() ||
                this.map.fitBounds(t.getSourceObject(), { padding: 85, animate: !1 });
        }),
        (MyListing.Maps.Map.prototype.panTo = function (t) {
            this.map.panTo(t.getSourceObject());
        }),
        (MyListing.Maps.Map.prototype.getClickPosition = function (t) {
            return new MyListing.Maps.LatLng(t.lngLat.lat, t.lngLat.lng);
        }),
        (MyListing.Maps.Map.prototype.addListener = function (t, e) {
            this.map.on(this.getSourceEvent(t), function (t) {
                e(t);
            });
        }),
        (MyListing.Maps.Map.prototype.addListenerOnce = function (t, e) {
            this.map.once(this.getSourceEvent(t), function (t) {
                e(t);
            });
        }),
        (MyListing.Maps.Map.prototype.trigger = function (t) {
            this.map.fire(this.getSourceEvent(t));
        }),
        (MyListing.Maps.Map.prototype.refresh = function () {
            this.map.resize(),
                this.options.cluster_markers && this.clusterer.update();
        }),
        (MyListing.Maps.Map.prototype.addControl = function (e) {
            function t() { }
            (t.prototype.onAdd = function (t) {
                return (
                    (this._map = t),
                    (this._container = e),
                    (this._container.className += " mapboxgl-ctrl "),
                    this._container
                );
            }),
                (t.prototype.onRemove = function () {
                    this._container.parentNode.removeChild(this._container),
                        (this._map = void 0);
                }),
                this.map.addControl(new t());
        }),
        (MyListing.Maps.skins = {
            skin1: "mapbox://styles/mapbox/streets-v10",
            skin2: "mapbox://styles/mapbox/outdoors-v10",
            skin3: "mapbox://styles/mapbox/light-v9",
            skin4: "mapbox://styles/mapbox/dark-v9",
            skin6: "mapbox://styles/mapbox/satellite-streets-v10",
            skin7: "mapbox://styles/mapbox/navigation-preview-day-v4",
            skin8: "mapbox://styles/mapbox/navigation-preview-night-v4",
            skin9: "mapbox://styles/mapbox/navigation-guidance-day-v4",
            skin10: "mapbox://styles/mapbox/navigation-guidance-night-v4",
            skin12: "",
        }),
        (function () {
            if ("object" === o(MyListing.MapConfig.CustomSkins)) {
                var i = {};
                Object.keys(MyListing.MapConfig.CustomSkins).forEach(function (t) {
                    if (MyListing.MapConfig.CustomSkins[t])
                        if (
                            "mapbox://" !==
                            MyListing.MapConfig.CustomSkins[t].trim().substring(0, 9)
                        )
                            try {
                                var e = JSON.parse(MyListing.MapConfig.CustomSkins[t]);
                                e && "object" === o(e) && (i[t] = e);
                            } catch (t) { }
                        else i[t] = MyListing.MapConfig.CustomSkins[t].trim();
                }),
                    jQuery.extend(MyListing.Maps.skins, i);
            }
        })(),
        (MyListing.Maps.init = function () {
            (MyListing.Maps.MapboxLanguage = new e()),
                (MyListing.MapConfig.Language &&
                    -1 <
                    MyListing.Maps.MapboxLanguage.supportedLanguages.indexOf(
                        MyListing.MapConfig.Language
                    )) ||
                (i(MyListing.Maps.MapboxLanguage.supportedLanguages)
                    ? (MyListing.MapConfig.Language = i(
                        MyListing.Maps.MapboxLanguage.supportedLanguages
                    ))
                    : (MyListing.MapConfig.Language = "en")),
                "ar" === MyListing.MapConfig.Language &&
                mapboxgl.setRTLTextPlugin(
                    "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
                    null,
                    !0
                ),
                (MyListing.Maps.MapboxSetLanguage = function (t) {
                    var e = t.getSourceObject();
                    e.setStyle(
                        MyListing.Maps.MapboxLanguage.setLanguage(
                            e.getStyle(),
                            MyListing.MapConfig.Language
                        )
                    );
                }),
                (MyListing.Geocoder = new MyListing.Maps.Geocoder()),
                jQuery(function (t) {
                    function e() {
                        MyListing.Maps.instances.length &&
                            MyListing.Maps.instances.forEach(function (t) {
                                t.map.resize();
                            });
                    }
                    MyListing.MapConfig.AccessToken.length ||
                        (MyListing.MapConfig.AccessToken = "invalid_token"),
                        (mapboxgl.accessToken = MyListing.MapConfig.AccessToken),
                        t(".c27-map:not(.delay-init)").each(function (t, e) {
                            new MyListing.Maps.Map(e);
                        }),
                        t("#c27-explore-listings").length && MyListing.Explore.setupMap(),
                        (MyListing.Maps.loaded = !0),
                        t(document).trigger("maps:loaded"),
                        t("#c27-single-listing .listing-tab").on(
                            "mylisting:single:tab-switched",
                            function () {
                                MyListing.Maps.instances.forEach(function (t) {
                                    t.instance.map.resize();
                                });
                            }
                        ),
                        t(".mapboxgl-ctrl-icon.mapboxgl-ctrl-fullscreen").on(
                            "click",
                            function (t) {
                                setTimeout(e, 250);
                            }
                        );
                });
        }),
        MyListing.Maps.init();
});
