// ScrollHeatmap.jsx
import React, { useEffect, useRef, useState } from "react";
import "./scrollheat.css";
import sampleData from "./sample-heat.json";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";

// Function to determine priority based on value
const getPriority = (value) => {
  if (value >= 150) return "High";
  if (value >= 100) return "Medium";
  return "Low";
};

// Function to get color based on priority
const getColor = (priority) => {
  switch (priority) {
    case "High":
      return "#FF3B30";
    case "Medium":
      return "#FFCC00";
    case "Low":
      return "#34C759";
    default:
      return "#34C759";
  }
};

const ScrollHeatmap = () => {
  const mapRef = useRef(null);
  const heatLayerRef = useRef(null);
  const markersRef = useRef([]);
  const pulseLayerRef = useRef([]);
  const containerRef = useRef(null);

  const [Leaflet, setLeaflet] = useState(null);
  const [activeId, setActiveId] = useState(null);

  // Add priority to data points
  const data = sampleData.points.map((point) => ({
    ...point,
    priority: getPriority(point.value),
    color: getColor(getPriority(point.value)),
  }));

  const scrollpoints = sampleData.scrollpoints;

  // ✅ Dynamically load Leaflet + heat plugin
  useEffect(() => {
    let cancelled = false;
    async function loadLibraries() {
      try {
        const leafletModule = await import("leaflet");
        await import("leaflet.heat");
        if (!cancelled) setLeaflet(leafletModule);
      } catch (error) {
        console.error("Failed to load libraries:", error);
      }
    }
    loadLibraries();
    return () => (cancelled = true);
  }, []);

  // Get heatmap color based on severity
  const getHeatColor = (priority) => {
    switch (priority) {
      case "High":
        return { 1.0: "#FF3B30" }; // 🔴 Red
      case "Medium":
        return { 1.0: "#FFCC00" }; // 🟡 Yellow
      case "Low":
        return { 1.0: "#34C759" }; // 🟢 Green
      default:
        return { 1.0: "#34C759" };
    }
  };

  // ✅ Initialize map once Leaflet is ready
  useEffect(() => {
    if (!Leaflet || mapRef.current) return;
    const L = Leaflet;

    const map = L.map("map", {
      center: [23.5, 85.0],
      zoom: 7,
      minZoom: 5,
      maxZoom: 15,
      preferCanvas: true,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    const heat = L.heatLayer([], {
      radius: 25,
      blur: 18,
      maxZoom: 15,
    }).addTo(map);

    mapRef.current = map;
    heatLayerRef.current = heat;
  }, [Leaflet]);

  // ✅ Add markers with priority colors + initial heatmap
  useEffect(() => {
    if (!Leaflet || !mapRef.current) return;
    const L = Leaflet;
    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    pulseLayerRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];
    pulseLayerRef.current = [];

    // Add priority markers (initially hidden)
    data.forEach((pt) => {
      const priorityIcon = L.divIcon({
        className: "priority-marker",
        html: `<div class="priority-dot" style="background-color: ${pt.color}" title="${pt.city} - ${pt.value}"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

      const marker = L.marker([pt.lat, pt.lng], {
        icon: priorityIcon,
        opacity: 0, // Initially hidden
        interactive: true,
      }).addTo(map);

      markersRef.current.push(marker);
    });

    // ✅ Set initial global heatmap
    const arr = data.map((p) => [p.lat, p.lng, p.value]);
    heatLayerRef.current.setLatLngs(arr);
  }, [Leaflet, data]);

  // ✅ IntersectionObserver for scroll-based zooming
  useEffect(() => {
    const scroller = containerRef.current;
    if (!scroller) return;

    const options = { root: scroller, threshold: 0.55 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.dataset.id;
        if (entry.isIntersecting) {
          setActiveId(id);
        }
      });
    }, options);

    const els = scroller.querySelectorAll(".scrollpoint");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ✅ Fly to region + highlight hotspots based on priority
  useEffect(() => {
    if (activeId === "sp-dhanbad") {
      const highPriorityData = filteredData.filter(
        (p) => p.priority === "High"
      );
      const heatArr = highPriorityData.map((p) => [p.lat, p.lng, p.value]);
      heat.setLatLngs(
        heatArr.length > 0 ? heatArr : [[sp.center[0], sp.center[1], 50]]
      );
      heat.setOptions({ gradient: getHeatColor("High") });
    } else if (activeId === "sp-jamshedpur") {
      const mediumPriorityData = filteredData.filter(
        (p) => p.priority === "Medium"
      );
      const heatArr = mediumPriorityData.map((p) => [p.lat, p.lng, p.value]);
      heat.setLatLngs(
        heatArr.length > 0 ? heatArr : [[sp.center[0], sp.center[1], 50]]
      );
      heat.setOptions({ gradient: getHeatColor("Medium") });
    } else if (activeId === "sp-deoghar") {
      const lowPriorityData = filteredData.filter((p) => p.priority === "Low");
      const heatArr = lowPriorityData.map((p) => [p.lat, p.lng, p.value]);
      heat.setLatLngs(
        heatArr.length > 0 ? heatArr : [[sp.center[0], sp.center[1], 50]]
      );
      heat.setOptions({ gradient: getHeatColor("Low") });
    }

    if (!activeId || !Leaflet || !mapRef.current || !heatLayerRef.current)
      return;
    const L = Leaflet;
    const map = mapRef.current;
    const heat = heatLayerRef.current;

    const sp = scrollpoints.find((s) => s.id === activeId);
    if (!sp) return;

    // First card - show all markers with normal pan
    if (activeId === "sp-ranchi") {
      const arr = data.map((p) => [p.lat, p.lng, p.value]);
      heat.setLatLngs(arr);
      heat.setOptions({
        gradient: {
          0.3: "#34C759", // Low → Green
          0.6: "#FFCC00", // Medium → Yellow
          1.0: "#FF3B30", // High → Red
        },
      });
    }

    // Get data within the bounding box
    const [southWest, northEast] = sp.bbox;
    let filteredData = data.filter((p) => {
      return (
        p.lat >= southWest[0] &&
        p.lat <= northEast[0] &&
        p.lng >= southWest[1] &&
        p.lng <= northEast[1]
      );
    });

    // If no data in bbox, use proximity filter
    if (filteredData.length === 0) {
      const [cLat, cLng] = sp.center;
      filteredData = data.filter((p) => {
        const dLat = (p.lat - cLat) * 111;
        const dLng = (p.lng - cLng) * (111 * Math.cos((cLat * Math.PI) / 180));
        const km = Math.sqrt(dLat * dLat + dLng * dLng);
        return km < 200;
      });
    }

    // Second card - focus on high priority areas
    if (activeId === "sp-dhanbad") {
      const highPriorityData = filteredData.filter(
        (p) => p.priority === "High"
      );
      const heatArr = highPriorityData.map((p) => [p.lat, p.lng, p.value]);
      heat.setLatLngs(
        heatArr.length > 0 ? heatArr : [[sp.center[0], sp.center[1], 50]]
      );

      // Hide all markers first
      markersRef.current.forEach((marker) => {
        marker.setOpacity(0);
      });

      // Show only high priority markers in this region
      markersRef.current.forEach((marker, index) => {
        const point = data[index];
        if (
          point.priority === "High" &&
          filteredData.some((p) => p.lat === point.lat && p.lng === point.lng)
        ) {
          marker.setOpacity(1);
        }
      });
    }
    // Third card - focus on medium priority areas
    else if (activeId === "sp-jamshedpur") {
      const mediumPriorityData = filteredData.filter(
        (p) => p.priority === "Medium"
      );
      const heatArr = mediumPriorityData.map((p) => [p.lat, p.lng, p.value]);
      heat.setLatLngs(
        heatArr.length > 0 ? heatArr : [[sp.center[0], sp.center[1], 50]]
      );

      // Hide all markers first
      markersRef.current.forEach((marker) => {
        marker.setOpacity(0);
      });

      // Show only medium priority markers in this region
      markersRef.current.forEach((marker, index) => {
        const point = data[index];
        if (
          point.priority === "Medium" &&
          filteredData.some((p) => p.lat === point.lat && p.lng === point.lng)
        ) {
          marker.setOpacity(1);
        }
      });
    }
    // Fourth card - focus on low priority areas
    else if (activeId === "sp-deoghar") {
      const lowPriorityData = filteredData.filter((p) => p.priority === "Low");
      const heatArr = lowPriorityData.map((p) => [p.lat, p.lng, p.value]);
      heat.setLatLngs(
        heatArr.length > 0 ? heatArr : [[sp.center[0], sp.center[1], 50]]
      );

      // Hide all markers first
      markersRef.current.forEach((marker) => {
        marker.setOpacity(0);
      });

      // Show only low priority markers in this region
      markersRef.current.forEach((marker, index) => {
        const point = data[index];
        if (
          point.priority === "Low" &&
          filteredData.some((p) => p.lat === point.lat && p.lng === point.lng)
        ) {
          marker.setOpacity(1);
        }
      });
    }
    // For other cards, show all priorities in the region
    else {
      const heatArr = filteredData.map((p) => [p.lat, p.lng, p.value]);
      heat.setLatLngs(
        heatArr.length > 0 ? heatArr : [[sp.center[0], sp.center[1], 50]]
      );

      // Hide all markers first
      markersRef.current.forEach((marker) => {
        marker.setOpacity(0);
      });

      // Show all markers in this region
      markersRef.current.forEach((marker, index) => {
        const point = data[index];
        if (
          filteredData.some((p) => p.lat === point.lat && p.lng === point.lng)
        ) {
          marker.setOpacity(1);
        }
      });
    }

    map.flyTo(sp.center, sp.zoom, { duration: 1.2, easeLinearity: 0.25 });

    // Add pulse effect to highlight the focused area
    pulseLayerRef.current.forEach((x) => map.removeLayer(x));
    pulseLayerRef.current = [];

    // Add pulse marker for the center of the focused area
    const div = L.divIcon({
      className: "",
      html: `<div class="pulse" title="${sp.title}"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
    const m = L.marker(sp.center, {
      icon: div,
      interactive: false,
    }).addTo(map);
    pulseLayerRef.current.push(m);
  }, [activeId, Leaflet, data, scrollpoints]);

  // Timeline dots
  const timelineDots = scrollpoints.map((sp) => (
    <div
      key={sp.id}
      className={`dot ${activeId === sp.id ? "active" : ""}`}
      title={sp.title}
    />
  ));

  return (
    <div className="scrollheat-container">
      <div className="scroll-col" ref={containerRef}>
        {scrollpoints.map((sp) => (
          <section
            key={sp.id}
            className="scrollpoint"
            data-id={sp.id}
            id={sp.id}
            style={{
              border:
                activeId === sp.id ? "1px solid rgba(0,150,255,0.18)" : "none",
            }}
          >
            <h2>{sp.title}</h2>
            <p>
              {sp.id === "sp-ranchi"
                ? "Overview of all activity across Jharkhand with priority markers."
                : sp.id === "sp-dhanbad"
                ? "Focusing on high priority areas with the most critical issues."
                : sp.id === "sp-jamshedpur"
                ? "Focusing on medium priority areas that need attention."
                : sp.id === "sp-deoghar"
                ? "Focusing on low priority areas for monitoring."
                : "Showing all activity in this region."}
            </p>
            <div style={{ marginTop: "1rem", opacity: 0.85 }}>
              <small>
                Region center: {sp.center[0].toFixed(3)},{" "}
                {sp.center[1].toFixed(3)}
              </small>
            </div>
          </section>
        ))}
      </div>

      <div className="map-col">
        <div id="map" style={{ height: "100%" }}></div>

        <div className="legend">
          <div style={{ fontSize: 13, fontWeight: 600 }}>
            Activity Intensity
          </div>
          <div className="bar" />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 6,
            }}
          >
            <span style={{ fontSize: 11 }}>Low</span>
            <span style={{ fontSize: 11 }}>High</span>
          </div>
        </div>

        <div className="priority-legend">
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            Priority
          </div>
          <div className="priority-item">
            <div
              className="priority-dot"
              style={{ backgroundColor: "#FF3B30" }}
            ></div>
            <span>High (&gt;= 150)</span>
          </div>
          <div className="priority-item">
            <div
              className="priority-dot"
              style={{ backgroundColor: "#FFCC00" }}
            ></div>
            <span>Medium (100-149)</span>
          </div>
          <div className="priority-item">
            <div
              className="priority-dot"
              style={{ backgroundColor: "#34C759" }}
            ></div>
            <span>Low (&lt; 100)</span>
          </div>
        </div>

        <div className="timeline" aria-hidden>
          {timelineDots}
        </div>
      </div>
    </div>
  );
};

export default ScrollHeatmap;